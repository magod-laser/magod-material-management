/** @format */

const userRouter = require("express").Router();
var createError = require("http-errors");
const CryptoJS = require("crypto-js");
var bodyParser = require("body-parser");
const { infoLogger, errorLogger } = require("../../helpers/logger");

const { setupQueryMod } = require("../../helpers/dbconn");
const { signAccessToken } = require("../../helpers/jwt_helper");

var jsonParser = bodyParser.json();

// User login: validate credentials, fetch menus and generate access token
userRouter.post(`/login`, jsonParser, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    let passwrd = CryptoJS.SHA512(password);

    if (!username || !passwrd) return res.send(createError.BadRequest());

    infoLogger.info("Login attempt", {
      endpoint: "/login",
      username,
      method: req.method,
      ip: req.ip,
    });

    setupQueryMod(
      `SELECT usr.Name, usr.UserName, usr.Password, usr.Role, unt.UnitName, usr.ActiveUser
       FROM magod_setup.magod_userlist usr
       LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
       WHERE usr.UserName = ? AND usr.ActiveUser = '1'`,
      [username],
      async (err, d) => {
        if (err) {
          errorLogger.error("Error fetching user info", err, {
            endpoint: "/login",
            username,
          });
        }

        let data = d;

        if (data.length > 0) {
          if (data[0]["Password"] == passwrd) {
            delete data[0]["Password"];

            setupQueryMod(
              `SELECT m.MenuUrl, m.ModuleId
               FROM magod_setup.menumapping mm
               LEFT OUTER JOIN magod_setup.menus m ON m.Id = mm.MenuId
               WHERE mm.Role = ? AND mm.ActiveMenu = '1'`,
              [data[0]["Role"]],
              async (err, mdata) => {
                if (err) {
                  errorLogger.error("Error fetching menu mapping", err, {
                    endpoint: "/login",
                    role: data[0]["Role"],
                  });
                }

                let menuarray = [];
                mdata.forEach((element) => {
                  menuarray.push(element["MenuUrl"]);
                });

                const moduleIds = [
                  ...new Set(
                    mdata
                      .map((menu) => menu.ModuleId)
                      .filter((id) => id !== null)
                  ),
                ];

                let accessToken = await signAccessToken(data[0]["UserName"]);

                infoLogger.info("Login success", {
                  endpoint: "/login",
                  username: data[0]["UserName"],
                  records: data.length,
                });

                res.send({
                  accessToken: accessToken,
                  data: { ...data, access: menuarray },
                  moduleIds: moduleIds,
                });
              }
            );
          } else {
            res.send(createError.Unauthorized("Invalid Username/Password"));
            errorLogger.error(`Login Failed - ${username} IP: ${req.ip}`, {
              endpoint: "/login",
            });
          }
        } else {
          res.send(createError.Unauthorized("Invalid Username/Password"));
          errorLogger.error(`Login Failed - ${username} IP: ${req.ip}`, {
            endpoint: "/login",
          });
        }
      }
    );
  } catch (error) {
    next(error);
    errorLogger.error("Unexpected error during login", error, {
      endpoint: "/login",
    });
  }
});

// Save or update menu-role mapping for users
userRouter.post(`/savemenurolemapping`, async (req, res, next) => {
  let sucs = false;
  let updt = false;
  let nomenu = false;
  let inRole = null;

  try {
    let data = req.body.newselectedmenu;
    let msg = "";

    if (data.length > 0) {
      await setupQueryMod(
        `SELECT * FROM magod_setup.menumapping WHERE Role = ?`,
        [data[0]["role"]],
        async (err, dr) => {
          if (err) {
            errorLogger.error("Error fetching existing role mapping", err, {
              endpoint: "/savemenurolemapping",
              role: data[0]["role"],
            });
          }
          inRole = dr.length > 0 ? dr[0]["Role"] : null;
        }
      );
    }

    if (inRole != null) {
      await setupQueryMod(
        `UPDATE magod_setup.menumapping SET ActiveMenu = 0 WHERE Role = ?`,
        [data[0]["role"]],
        async (err, mapdata) => {
          if (err) {
            errorLogger.error(
              "Error deactivating existing menu mappings",
              err,
              {
                endpoint: "/savemenurolemapping",
                role: data[0]["role"],
              }
            );
          }
        }
      );

      for (let i = 0; i < data.length; i++) {
        await setupQueryMod(
          `SELECT Id FROM magod_setup.menus WHERE MenuName = ?`,
          [data[i]["MenuName"]],
          async (err, menuid) => {
            if (err) {
              errorLogger.error("Error fetching menu ID", err, {
                endpoint: "/savemenurolemapping",
                MenuName: data[i]["MenuName"],
              });
            }

            if (menuid.length > 0) {
              setupQueryMod(
                `UPDATE magod_setup.menumapping SET ActiveMenu = 1 WHERE Role = ? AND MenuId = ?`,
                [data[i]["role"], menuid[0]["Id"]],
                async (err, dmp) => {
                  if (err) {
                    errorLogger.error("Error updating menu mapping", err, {
                      endpoint: "/savemenurolemapping",
                      role: data[i]["role"],
                      MenuId: menuid[0]["Id"],
                    });
                  }

                  if (dmp.affectedRows > 0) {
                    msg = "updated";
                  } else if (dmp.affectedRows == 0) {
                    await setupQueryMod(
                      `INSERT INTO magod_setup.menumapping (Role, MenuId, ActiveMenu) VALUES (?, ?, '1')`,
                      [data[i]["role"], menuid[0]["Id"]],
                      async (err, ins) => {
                        if (err) {
                          errorLogger.error(
                            "Error inserting new menu mapping",
                            err,
                            {
                              endpoint: "/savemenurolemapping",
                              role: data[i]["role"],
                              MenuId: menuid[0]["Id"],
                            }
                          );
                        }
                        msg = "success";
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }

      res.send({ status: msg });
    } else if (inRole == null) {
      for (let i = 0; i < data.length; i++) {
        await setupQueryMod(
          `SELECT Id FROM magod_setup.menus WHERE MenuName = ?`,
          [data[i]["MenuName"]],
          async (err, menuid) => {
            if (err) {
              errorLogger.error("Error fetching menu ID", err, {
                endpoint: "/savemenurolemapping",
                MenuName: data[i]["MenuName"],
              });
            }

            if (menuid.length > 0) {
              await setupQueryMod(
                `INSERT INTO magod_setup.menumapping (Role, MenuId, ActiveMenu) VALUES (?, ?, '1')`,
                [data[i]["role"], menuid[0]["Id"]],
                async (err, ins) => {
                  if (err) {
                    errorLogger.error("Error inserting new menu mapping", err, {
                      endpoint: "/savemenurolemapping",
                      role: data[i]["role"],
                      MenuId: menuid[0]["Id"],
                    });
                  }
                  msg = "success";
                }
              );
            }
          }
        );
      }

      res.send({ status: msg });
    }
  } catch (error) {
    errorLogger.error("Unexpected error in saving menu-role mapping", error, {
      endpoint: "/savemenurolemapping",
    });
    next(error);
  }
});

// Fetch all active users with their unit names
userRouter.post(`/getusers`, async (req, res, next) => {
  try {
    infoLogger.info("Requested all active users", {
      endpoint: "/getusers",
      method: req.method,
    });

    setupQueryMod(
      `SELECT usr.Name, usr.UserName, usr.Role, unt.UnitName
       FROM magod_setup.magod_userlist usr
       LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
       WHERE usr.ActiveUser = 1`,
      async (err, d) => {
        if (err) {
          errorLogger.error("Error fetching active users", err, {
            endpoint: "/getusers",
          });
        }

        res.send(d);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching active users", error, {
      endpoint: "/getusers",
    });
    next(error);
  }
});

// Soft delete a user by setting ActiveUser = 0 and return updated user list
userRouter.post(`/delusers`, async (req, res, next) => {
  try {
    const { uname } = req.body;

    infoLogger.info("Requested user deletion", {
      endpoint: "/delusers",
      username: uname,
      method: req.method,
    });

    setupQueryMod(
      `UPDATE magod_setup.magod_userlist SET ActiveUser = 0 WHERE UserName = ?`,
      [uname],
      (err, data) => {
        if (err) {
          errorLogger.error("Error deactivating user", err, {
            endpoint: "/delusers",
            username: uname,
          });
        }

        if (data.affectedRows > 0) {
          setupQueryMod(
            `SELECT usr.Name, usr.UserName, usr.Role, unt.UnitName
             FROM magod_setup.magod_userlist usr
             LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
             WHERE usr.ActiveUser = 1`,
            async (err, d) => {
              if (err) {
                errorLogger.error(
                  "Error fetching active users after deletion",
                  err,
                  {
                    endpoint: "/delusers",
                  }
                );
              }
              const msg = "success";
              res.send({ d, status: msg });
            }
          );
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error deleting user", error, {
      endpoint: "/delusers",
    });
    next(error);
  }
});

// Save or update a user and return updated user list
userRouter.post(`/saveusers`, async (req, res, next) => {
  try {
    const data = req.body.usrdata;
    const passwrd = CryptoJS.SHA512(data.Password);
    let msg = "";

    infoLogger.info("Requested save/update user", {
      endpoint: "/saveusers",
      username: data.UserName,
      method: req.method,
    });

    // Check if user exists
    setupQueryMod(
      `SELECT Name, UserName, PassWord FROM magod_setup.magod_userlist WHERE UserName = ?`,
      [data.UserName],
      async (err, d) => {
        if (err) {
          errorLogger.error("Error checking existing user", err, {
            endpoint: "/saveusers",
            username: data.UserName,
          });
        }

        if (d.length === 0) {
          // Insert new user
          const insertSql = `INSERT INTO magod_setup.magod_userlist 
            (Name, UserName, ActiveUser, ResetPassword, UserPassWord, CreatedTime, Role, Password, UnitID) 
            VALUES (?, ?, '1', '0', '', CURRENT_TIMESTAMP, ?, ?, ?)`;

          setupQueryMod(
            insertSql,
            [data.Name, data.UserName, data.Role, passwrd, data.Unit],
            async (err, d) => {
              if (err) {
                errorLogger.error("Error inserting new user", err, {
                  endpoint: "/saveusers",
                  username: data.UserName,
                });
              }

              if (d.affectedRows > 0) {
                // Fetch updated user list
                setupQueryMod(
                  `SELECT usr.Name, usr.UserName, usr.Role, unt.UnitName
                   FROM magod_setup.magod_userlist usr
                   LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
                   WHERE usr.ActiveUser = 1`,
                  async (err, d) => {
                    if (err) {
                      errorLogger.error("Error fetching active users", err, {
                        endpoint: "/saveusers",
                      });
                    }
                    msg = "success";
                    res.send({ d, status: msg });
                  }
                );
              }
            }
          );
        } else {
          // Update existing user
          const updateSql = `UPDATE magod_setup.magod_userlist
            SET Name = ?, ActiveUser = '1', ResetPassword = '0', UserPassWord = '', Role = ?, Password = ?, UnitID = ?
            WHERE UserName = ?`;

          setupQueryMod(
            updateSql,
            [data.Name, data.Role, passwrd, data.Unit, data.UserName],
            async (err, d) => {
              if (err) {
                errorLogger.error("Error updating user", err, {
                  endpoint: "/saveusers",
                  username: data.UserName,
                });
              }

              if (d.affectedRows > 0) {
                // Fetch updated user list
                setupQueryMod(
                  `SELECT usr.Name, usr.UserName, usr.Role, unt.UnitName
                   FROM magod_setup.magod_userlist usr
                   LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
                   WHERE usr.ActiveUser = 1`,
                  async (err, d) => {
                    if (err) {
                      errorLogger.error("Error fetching active users", err, {
                        endpoint: "/saveusers",
                      });
                    }
                    msg = "updated";
                    res.send({ d, status: msg });
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error saving/updating user", error, {
      endpoint: "/saveusers",
    });
    next(error);
  }
});

userRouter.get("/user", async (req, res, next) => {
  try {
    const id = req.body.id;
    if (!id) res.send(createError.BadRequest());
    res.send({ id });
  } catch (error) {
    next(error);
  }
});

// Fetch all modules from magod_setup.modules
userRouter.post(`/getusermodules`, async (req, res, next) => {
  try {
    const { Module: strmodule } = req.body;

    infoLogger.info("Requested all modules", {
      endpoint: "/getusermodules",
      method: req.method,
    });

    setupQueryMod(`SELECT * FROM magod_setup.modules`, async (err, updata) => {
      if (err) {
        errorLogger.error("Error fetching modules", err, {
          endpoint: "/getusermodules",
        });
      }

      res.send(updata);
    });
  } catch (error) {
    errorLogger.error("Unexpected error fetching modules", error, {
      endpoint: "/getusermodules",
    });
    next(error);
  }
});

// Fetch all user roles from magod_setup.userroles
userRouter.post(`/getuserroles`, async (req, res, next) => {
  try {
    infoLogger.info("Requested all user roles", {
      endpoint: "/getuserroles",
      method: req.method,
    });

    setupQueryMod(`SELECT * FROM magod_setup.userroles`, async (err, data) => {
      if (err) {
        errorLogger.error("Error fetching user roles", err, {
          endpoint: "/getuserroles",
        });
      }

      res.send(data);
    });
  } catch (error) {
    errorLogger.error("Unexpected error fetching user roles", error, {
      endpoint: "/getuserroles",
    });
    next(error);
  }
});

// Add a new user role if it doesn't exist
userRouter.post(`/adduserroles`, async (req, res, next) => {
  try {
    const strrole = req.body.usrroledata.Role;

    infoLogger.info("Requested to add user role", {
      endpoint: "/adduserroles",
      role: strrole,
      method: req.method,
    });

    // Check if the role already exists
    setupQueryMod(
      `SELECT * FROM magod_setup.userroles WHERE Role = ?`,
      [strrole],
      async (err, datarole) => {
        if (err) {
          errorLogger.error("Error checking existing role", err, {
            endpoint: "/adduserroles",
            role: strrole,
          });
        }

        if (datarole.length === 0) {
          // Insert new role
          setupQueryMod(
            `INSERT INTO magod_setup.userroles (Role) VALUES (?)`,
            [strrole],
            async (err, data) => {
              if (err) {
                errorLogger.error("Error inserting new role", err, {
                  endpoint: "/adduserroles",
                  role: strrole,
                });
              }
              res.send({ status: "success" });
            }
          );
        } else {
          res.send({ status: "updated" });
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error adding user role", error, {
      endpoint: "/adduserroles",
    });
    next(error);
  }
});

// Delete a user role and deactivate its menu mappings
userRouter.post(`/deluserroles`, async (req, res, next) => {
  try {
    const oldrole = req.body.rolenm;

    infoLogger.info("Requested to delete user role", {
      endpoint: "/deluserroles",
      role: oldrole,
      method: req.method,
    });

    // Deactivate menu mappings for the role
    setupQueryMod(
      `UPDATE magod_setup.menumapping SET ActiveMenu = 0 WHERE Role = ?`,
      [oldrole],
      (err, mmdata) => {
        if (err) {
          errorLogger.error("Error deactivating menu mappings for role", err, {
            endpoint: "/deluserroles",
            role: oldrole,
          });
        }
      }
    );

    // Delete the role
    setupQueryMod(
      `DELETE FROM magod_setup.userroles WHERE Role = ?`,
      [oldrole],
      (err, data) => {
        if (err) {
          errorLogger.error("Error deleting user role", err, {
            endpoint: "/deluserroles",
            role: oldrole,
          });
        }

        res.send({ status: "Deleted" });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error deleting user role", error, {
      endpoint: "/deluserroles",
    });
    next(error);
  }
});

// Add or update a module in magod_setup.modules
userRouter.post(`/addusermodules`, async (req, res, next) => {
  try {
    const strrole = req.body.Module;

    if (strrole) {
      infoLogger.info("Requested to add/update module", {
        endpoint: "/addusermodules",
        moduleName: strrole,
        method: req.method,
      });

      // Check if module already exists
      setupQueryMod(
        `SELECT * FROM magod_setup.modules WHERE ModuleName = ?`,
        [strrole],
        async (err, data) => {
          if (err) {
            errorLogger.error("Error checking existing module", err, {
              endpoint: "/addusermodules",
              moduleName: strrole,
            });
          }

          if (data.length > 0) {
            // Update existing module
            setupQueryMod(
              `UPDATE magod_setup.modules SET ModuleName = ? WHERE ModuleName = ?`,
              [strrole, data[0]["ModuleName"]],
              async (err, updata) => {
                if (err) {
                  errorLogger.error("Error updating module", err, {
                    endpoint: "/addusermodules",
                    moduleName: strrole,
                  });
                }
                res.send(updata);
              }
            );
          } else {
            // Insert new module
            setupQueryMod(
              `INSERT INTO magod_setup.modules (ModuleName, ActiveModule) VALUES (?, '1')`,
              [strrole],
              async (err, data) => {
                if (err) {
                  errorLogger.error("Error inserting new module", err, {
                    endpoint: "/addusermodules",
                    moduleName: strrole,
                  });
                }

                if (data.affectedRows > 0) {
                  setupQueryMod(
                    `SELECT * FROM magod_setup.modules`,
                    async (err, allModules) => {
                      if (err) {
                        errorLogger.error("Error fetching modules", err, {
                          endpoint: "/addusermodules",
                        });
                      }
                      res.send(allModules);
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
    errorLogger.error("Unexpected error in add/update module", error, {
      endpoint: "/addusermodules",
    });
    next(error);
  }
});

// Fetch all active menus for a specific role
userRouter.post(`/getrolemenus`, async (req, res, next) => {
  const strrole = req.body.Role;

  try {
    infoLogger.info("Requested menus for role", {
      endpoint: "/getrolemenus",
      role: strrole,
      method: req.method,
    });

    setupQueryMod(
      `SELECT mm.Role, m.MenuName
       FROM magod_setup.menumapping mm
       LEFT OUTER JOIN magod_setup.menus m ON m.Id = mm.MenuId
       WHERE mm.Role = ? AND mm.ActiveMenu = '1'`,
      [strrole],
      async (err, data) => {
        if (err) {
          errorLogger.error("Error fetching role menus", err, {
            endpoint: "/getrolemenus",
            role: strrole,
          });
        }

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching role menus", error, {
      endpoint: "/getrolemenus",
      role: strrole,
    });
    next(error);
  }
});

// Fetch all active user menus
userRouter.post(`/getusermenus`, async (req, res, next) => {
  try {
    infoLogger.info("Requested all active user menus", {
      endpoint: "/getusermenus",
      method: req.method,
    });

    setupQueryMod(
      `SELECT m.MenuName, m.MenuUrl
       FROM magod_setup.menus m
       WHERE ActiveMenu = '1'`,
      async (err, data) => {
        if (err) {
          errorLogger.error("Error fetching active user menus", err, {
            endpoint: "/getusermenus",
          });
        }

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching user menus", error, {
      endpoint: "/getusermenus",
    });
    next(error);
  }
});

// Soft delete a user menu by setting ActiveMenu = 0
userRouter.post(`/delusermenus`, async (req, res, next) => {
  try {
    const mnuname = req.body.mname;

    infoLogger.info("Requested to delete user menu", {
      endpoint: "/delusermenus",
      menuName: mnuname,
      method: req.method,
    });

    setupQueryMod(
      `UPDATE magod_setup.menus SET ActiveMenu = '0' WHERE MenuName = ?`,
      [mnuname],
      (err, data) => {
        if (err) {
          errorLogger.error("Error deleting user menu", err, {
            endpoint: "/delusermenus",
            menuName: mnuname,
          });
        }

        res.send({ status: "Deleted" });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error deleting user menu", error, {
      endpoint: "/delusermenus",
    });
    next(error);
  }
});

// Add or update a user menu
userRouter.post(`/addusermenus`, async (req, res, next) => {
  try {
    const strmenu = req.body.menu.MenuName;
    const strurl = req.body.menu.MenuUrl;

    if (strmenu != null && strurl != null) {
      infoLogger.info("Requested to add/update user menu", {
        endpoint: "/addusermenus",
        menuName: strmenu,
        menuUrl: strurl,
        method: req.method,
      });

      // Check if menu already exists
      setupQueryMod(
        `SELECT * FROM magod_setup.menus WHERE MenuName = ?`,
        [strmenu],
        async (err, data) => {
          if (err) {
            errorLogger.error("Error checking existing menu", err, {
              endpoint: "/addusermenus",
              menuName: strmenu,
            });
          }

          if (data.length > 0) {
            // Update existing menu
            setupQueryMod(
              `UPDATE magod_setup.menus SET MenuUrl = ? WHERE MenuName = ?`,
              [strurl, strmenu],
              async (err, updata) => {
                if (err) {
                  errorLogger.error("Error updating menu", err, {
                    endpoint: "/addusermenus",
                    menuName: strmenu,
                  });
                }
                res.send({ status: "Updated" });
              }
            );
          } else {
            // Insert new menu
            setupQueryMod(
              `INSERT INTO magod_setup.menus (MenuName, MenuUrl, ActiveMenu) VALUES (?, ?, '1')`,
              [strmenu, strurl],
              async (err, data) => {
                if (err) {
                  errorLogger.error("Error inserting new menu", err, {
                    endpoint: "/addusermenus",
                    menuName: strmenu,
                  });
                }

                if (data.affectedRows > 0) {
                  // Fetch all active menus
                  setupQueryMod(
                    `SELECT m.MenuName, m.MenuUrl FROM magod_setup.menus m WHERE ActiveMenu = '1'`,
                    async (err, menus) => {
                      if (err) {
                        errorLogger.error("Error fetching active menus", err, {
                          endpoint: "/addusermenus",
                        });
                      }
                      res.send({ status: "success" });
                    }
                  );
                }
              }
            );
          }
        }
      );
    }
  } catch (error) {
    errorLogger.error("Unexpected error in add/update user menu", error, {
      endpoint: "/addusermenus",
    });
    next(error);
  }
});

// Fetch menu URLs and module IDs for a user based on role and username
userRouter.post("/fetchMenuUrls", async (req, res, next) => {
  try {
    const { role, username } = req.body;
    if (!role || !username) return res.send(createError.BadRequest());

    infoLogger.info("Requested menu URLs", {
      endpoint: "/fetchMenuUrls",
      username,
      role,
      method: req.method,
    });

    setupQueryMod(
      `SELECT usr.Name, usr.UserName, usr.Password, usr.Role, unt.UnitName, usr.ActiveUser
       FROM magod_setup.magod_userlist usr
       LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
       WHERE usr.UserName = ? AND usr.ActiveUser = '1'`,
      [username],
      async (err, d) => {
        if (err) {
          errorLogger.error("Error fetching user info", err, {
            endpoint: "/fetchMenuUrls",
            username,
          });
        }

        let data = d;

        if (data.length > 0) {
          setupQueryMod(
            `SELECT m.MenuUrl, ModuleId
             FROM magod_setup.menumapping mm
             LEFT OUTER JOIN magod_setup.menus m ON m.Id = mm.MenuId
             WHERE mm.Role = ? AND mm.ActiveMenu = '1'`,
            [data[0]["Role"]],
            async (err, mdata) => {
              if (err) {
                errorLogger.error("Error fetching menu mapping", err, {
                  endpoint: "/fetchMenuUrls",
                  role: data[0]["Role"],
                });
              }

              let menuarray = [];
              mdata.forEach((element) => {
                menuarray.push(element["MenuUrl"]);
              });

              const moduleIds = [
                ...new Set(
                  mdata.map((menu) => menu.ModuleId).filter((id) => id !== null)
                ),
              ];

              infoLogger.info("Fetched menu URLs successfully", {
                endpoint: "/fetchMenuUrls",
                username,
                records: data.length,
              });

              res.send({
                data: { ...data, access: menuarray },
                moduleIds: moduleIds,
              });
            }
          );
        } else {
          res.send(createError.Unauthorized("Invalid Username"));
          errorLogger.error(`Failed - ${username} IP: ${req.ip}`, {
            endpoint: "/fetchMenuUrls",
          });
        }
      }
    );
  } catch (error) {
    next(error);
    errorLogger.error("Unexpected error fetching menu URLs", error, {
      endpoint: "/fetchMenuUrls",
    });
  }
});

module.exports = userRouter;

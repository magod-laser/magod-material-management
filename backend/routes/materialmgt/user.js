/** @format */

const userRouter = require("express").Router();
var createError = require("http-errors");
const CryptoJS = require("crypto-js");
var bodyParser = require("body-parser");
const { infoLogger, errorLogger } = require("../../helpers/logger");

const { setupQuery, setupQueryMod } = require("../../helpers/dbconn");
const { signAccessToken } = require("../../helpers/jwt_helper");

var jsonParser = bodyParser.json();

// User login - validates username/password and returns access token with menu access
userRouter.post(`/login`, jsonParser, async (req, res, next) => {
  const { username, password } = req.body;

  infoLogger.info("Login attempt", {
    endpoint: "/login",
    username,
    ip: req.ip,
  });

  try {
    if (!username || !password) {
      errorLogger.error("Login failed: Missing username or password", {
        endpoint: "/login",
      });
      return res.send(createError.BadRequest());
    }

    let hashedPassword = CryptoJS.SHA512(password);

    setupQueryMod(
      `SELECT usr.Name, usr.UserName, usr.Password, usr.Role, unt.UnitName, usr.ActiveUser 
       FROM magod_setup.magod_userlist usr
       LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
       WHERE usr.UserName = ? AND usr.ActiveUser = '1'`,
      [username],
      async (err, data) => {
        if (err) {
          errorLogger.error("Database error fetching user", err, {
            endpoint: "/login",
            username,
          });
          return res.send(createError.InternalServerError());
        }

        if (data.length > 0) {
          if (data[0]["Password"] == hashedPassword) {
            delete data[0]["Password"];

            setupQueryMod(
              `SELECT m.MenuUrl, m.ModuleId 
               FROM magod_setup.menumapping mm
               LEFT OUTER JOIN magod_setup.menus m ON m.Id = mm.MenuId
               WHERE mm.Role = ? AND mm.ActiveMenu = '1'`,
              [data[0]["Role"]],
              async (err, mdata) => {
                if (err) {
                  errorLogger.error("Database error fetching menu data", err, {
                    endpoint: "/login",
                    username,
                  });
                  return res.send(createError.InternalServerError());
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

                infoLogger.info("Login Success", {
                  endpoint: "/login",
                  username,
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
            errorLogger.error(
              `Login Failed - Incorrect password for username: ${username} IP: ${req.ip}`
            );
          }
        } else {
          res.send(createError.Unauthorized("Invalid Username/Password"));
          errorLogger.error(
            `Login Failed - Username not found: ${username} IP: ${req.ip}`
          );
        }
      }
    );
  } catch (error) {
    next(error);
    errorLogger.error("Unexpected error during login", error, {
      endpoint: "/login",
      username,
    });
  }
});

// Save or update menu-role mapping for a role
userRouter.post(`/savemenurolemapping`, async (req, res, next) => {
  let inRole = "";
  const data = req.body.newselectedmenu;

  infoLogger.info("Menu-role mapping attempt", {
    endpoint: "/savemenurolemapping",
    role: data?.[0]?.role,
  });

  try {
    if (data.length > 0) {
      await setupQueryMod(
        `SELECT * FROM magod_setup.menumapping WHERE Role = ?`,
        [data[0]["role"]],
        async (err, dr) => {
          if (err) {
            errorLogger.error("Error fetching existing menu mappings", err, {
              role: data[0]["role"],
            });
          }
          inRole = dr?.[0]?.Role || null;
        }
      );
    }

    if (inRole != null) {
      await setupQueryMod(
        `UPDATE magod_setup.menumapping SET ActiveMenu = 0 WHERE Role = ?`,
        [data[0]["role"]],
        async (err, mapdata) => {
          if (err)
            errorLogger.error("Error resetting ActiveMenu for role", err, {
              role: data[0]["role"],
            });
        }
      );

      for (let i = 0; i < data.length; i++) {
        await setupQueryMod(
          `SELECT Id FROM magod_setup.menus WHERE MenuName = ?`,
          [data[i]["MenuName"]],
          async (err, menuid) => {
            if (err)
              errorLogger.error("Error fetching menu ID", err, {
                MenuName: data[i]["MenuName"],
              });
            if (menuid.length > 0) {
              setupQueryMod(
                `UPDATE magod_setup.menumapping SET ActiveMenu = 1 WHERE Role = ? AND MenuId = ?`,
                [data[i]["role"], menuid[0]["Id"]],
                async (err, dmp) => {
                  if (err)
                    errorLogger.error("Error updating menu mapping", err, {
                      role: data[i]["role"],
                      MenuId: menuid[0]["Id"],
                    });
                  if (dmp.affectedRows > 0) {
                    msg = "updated";
                  } else if (dmp.affectedRows == 0) {
                    await setupQueryMod(
                      `INSERT INTO magod_setup.menumapping (Role, MenuId, ActiveMenu) VALUES (?, ?, 1)`,
                      [data[i]["role"], menuid[0]["Id"]],
                      async (err, ins) => {
                        if (err)
                          errorLogger.error(
                            "Error inserting new menu mapping",
                            err,
                            { role: data[i]["role"], MenuId: menuid[0]["Id"] }
                          );
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
    } else {
      for (let i = 0; i < data.length; i++) {
        await setupQueryMod(
          `SELECT Id FROM magod_setup.menus WHERE MenuName = ?`,
          [data[i]["MenuName"]],
          async (err, menuid) => {
            if (err)
              errorLogger.error("Error fetching menu ID for new role", err, {
                MenuName: data[i]["MenuName"],
              });
            if (menuid.length > 0) {
              await setupQueryMod(
                `INSERT INTO magod_setup.menumapping (Role, MenuId, ActiveMenu) VALUES (?, ?, 1)`,
                [data[i]["role"], menuid[0]["Id"]],
                async (err, ins) => {
                  if (err)
                    errorLogger.error(
                      "Error inserting menu mapping for new role",
                      err,
                      { role: data[i]["role"], MenuId: menuid[0]["Id"] }
                    );
                  msg = "success";
                }
              );
            }
          }
        );
      }

      res.send({ status: msg });
    }

    infoLogger.info("Menu-role mapping completed", {
      role: data?.[0]?.role,
      status: msg,
    });
  } catch (error) {
    errorLogger.error("Unexpected error in savemenurolemapping", error, {
      endpoint: "/savemenurolemapping",
    });
    next(error);
  }
});

// Fetch all active users with their roles and unit names
userRouter.post(`/getusers`, async (req, res, next) => {
  infoLogger.info("Fetching all active users", { endpoint: "/getusers" });

  try {
    setupQueryMod(
      `SELECT usr.Name, usr.UserName, usr.Role, unt.UnitName 
       FROM magod_setup.magod_userlist usr
       LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
       WHERE usr.ActiveUser = ?`,
      [1],
      async (err, d) => {
        if (err) {
          errorLogger.error("Error fetching active users", err, {
            endpoint: "/getusers",
          });
          return res.send([]);
        }
        infoLogger.info("Fetched active users successfully", {
          endpoint: "/getusers",
          records: d.length,
        });
        res.send(d);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in getusers", error, {
      endpoint: "/getusers",
    });
    next(error);
  }
});

// Deactivate a user and return updated active users list
userRouter.post(`/delusers`, async (req, res, next) => {
  const usrname = req.body.uname;
  infoLogger.info("Deleting user", {
    endpoint: "/delusers",
    username: usrname,
  });

  try {
    setupQueryMod(
      `UPDATE magod_setup.magod_userlist SET ActiveUser = ? WHERE UserName = ?`,
      [0, usrname],
      (err, data) => {
        if (err) {
          errorLogger.error("Error deactivating user", err, {
            endpoint: "/delusers",
            username: usrname,
          });
          return res.send({ d: [], status: "error" });
        }

        if (data.affectedRows > 0) {
          setupQueryMod(
            `SELECT usr.Name, usr.UserName, usr.Role, unt.UnitName
             FROM magod_setup.magod_userlist usr
             LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
             WHERE usr.ActiveUser = ?`,
            [1],
            async (err, d) => {
              if (err) {
                errorLogger.error(
                  "Error fetching active users after deletion",
                  err,
                  { endpoint: "/delusers" }
                );
                return res.send({ d: [], status: "error" });
              }
              infoLogger.info("User deactivated successfully", {
                endpoint: "/delusers",
                username: usrname,
              });
              res.send({ d, status: "success" });
            }
          );
        } else {
          errorLogger.error("No rows affected when deactivating user", null, {
            endpoint: "/delusers",
            username: usrname,
          });
          res.send({ d: [], status: "not_found" });
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in delusers", error, {
      endpoint: "/delusers",
      username: usrname,
    });
    next(error);
  }
});

// Save or update a user
userRouter.post(`/saveusers`, async (req, res, next) => {
  const data = req.body.usrdata;
  const hashedPassword = CryptoJS.SHA512(data.Password).toString();
  infoLogger.info("Saving user", {
    endpoint: "/saveusers",
    username: data.UserName,
  });

  try {
    // Check if user already exists
    setupQueryMod(
      `SELECT Name, UserName, Password FROM magod_setup.magod_userlist WHERE UserName = ?`,
      [data.UserName],
      async (err, d) => {
        if (err) {
          errorLogger.error("Error checking existing user", err, {
            endpoint: "/saveusers",
            username: data.UserName,
          });
          return res.send({ d: [], status: "error" });
        }

        let msg = "";
        if (d.length === 0) {
          // Insert new user
          const insertSql = `INSERT INTO magod_setup.magod_userlist 
            (Name, UserName, ActiveUser, ResetPassword, UserPassWord, CreatedTime, Role, Password, UnitID)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?)`;
          setupQueryMod(
            insertSql,
            [
              data.Name,
              data.UserName,
              1,
              0,
              "",
              data.Role,
              hashedPassword,
              data.Unit,
            ],
            async (err, insertData) => {
              if (err) {
                errorLogger.error("Error inserting new user", err, {
                  endpoint: "/saveusers",
                  username: data.UserName,
                });
                return res.send({ d: [], status: "error" });
              }
              msg = "success";
              // Fetch updated active users
              setupQueryMod(
                `SELECT usr.Name, usr.UserName, usr.Role, unt.UnitName
                 FROM magod_setup.magod_userlist usr
                 LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
                 WHERE usr.ActiveUser = ?`,
                [1],
                async (err, users) => {
                  if (err) {
                    errorLogger.error("Error fetching active users", err, {
                      endpoint: "/saveusers",
                    });
                    return res.send({ d: [], status: "error" });
                  }
                  infoLogger.info("User inserted successfully", {
                    endpoint: "/saveusers",
                    username: data.UserName,
                  });
                  res.send({ d: users, status: msg });
                }
              );
            }
          );
        } else {
          // Update existing user
          const updateSql = `UPDATE magod_setup.magod_userlist 
            SET Name = ?, ActiveUser = ?, ResetPassword = ?, UserPassWord = ?, Role = ?, Password = ?, UnitID = ?
            WHERE UserName = ?`;
          setupQueryMod(
            updateSql,
            [
              data.Name,
              1,
              0,
              "",
              data.Role,
              hashedPassword,
              data.Unit,
              data.UserName,
            ],
            async (err, updateData) => {
              if (err) {
                errorLogger.error("Error updating user", err, {
                  endpoint: "/saveusers",
                  username: data.UserName,
                });
                return res.send({ d: [], status: "error" });
              }
              msg = "updated";
              // Fetch updated active users
              setupQueryMod(
                `SELECT usr.Name, usr.UserName, usr.Role, unt.UnitName
                 FROM magod_setup.magod_userlist usr
                 LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
                 WHERE usr.ActiveUser = ?`,
                [1],
                async (err, users) => {
                  if (err) {
                    errorLogger.error("Error fetching active users", err, {
                      endpoint: "/saveusers",
                    });
                    return res.send({ d: [], status: "error" });
                  }
                  infoLogger.info("User updated successfully", {
                    endpoint: "/saveusers",
                    username: data.UserName,
                  });
                  res.send({ d: users, status: msg });
                }
              );
            }
          );
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in saveusers", error, {
      endpoint: "/saveusers",
      username: data.UserName,
    });
    next(error);
  }
});

// Get user by ID
userRouter.get("/user", async (req, res, next) => {
  const id = req.body.id;

  infoLogger.info("Fetching user by ID", { endpoint: "/user", id });

  try {
    if (!id) {
      errorLogger.error("Missing user ID", { endpoint: "/user" });
      return res.send(createError.BadRequest());
    }

    res.send({ id });

    infoLogger.info("Fetched user successfully", { endpoint: "/user", id });
  } catch (error) {
    errorLogger.error("Unexpected error fetching user", error, {
      endpoint: "/user",
      id,
    });
    next(error);
  }
});

// Get all user modules
userRouter.post("/getusermodules", async (req, res, next) => {
  const strmodule = req.body.Module;

  infoLogger.info("Fetching all modules", {
    endpoint: "/getusermodules",
    Module: strmodule,
  });

  try {
    setupQueryMod(`SELECT * FROM magod_setup.modules`, async (err, updata) => {
      if (err) {
        errorLogger.error("Error fetching modules", err, {
          endpoint: "/getusermodules",
          Module: strmodule,
        });
        return res.send(createError.InternalServerError());
      }

      res.send(updata);
      infoLogger.info("Modules fetched successfully", {
        endpoint: "/getusermodules",
        count: updata.length,
      });
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /getusermodules", error, {
      endpoint: "/getusermodules",
    });
    next(error);
  }
});

// Get all user roles
userRouter.post("/getuserroles", async (req, res, next) => {
  infoLogger.info("Fetching all user roles", { endpoint: "/getuserroles" });

  try {
    setupQueryMod(`SELECT * FROM magod_setup.userroles`, async (err, data) => {
      if (err) {
        errorLogger.error("Error fetching user roles", err, {
          endpoint: "/getuserroles",
        });
        return res.send(createError.InternalServerError());
      }

      res.send(data);
      infoLogger.info("User roles fetched successfully", {
        endpoint: "/getuserroles",
        count: data.length,
      });
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /getuserroles", error, {
      endpoint: "/getuserroles",
    });
    next(error);
  }
});

// Add a new user role
userRouter.post("/adduserroles", async (req, res, next) => {
  const strrole = req.body.usrroledata.Role;
  infoLogger.info("Attempting to add user role", {
    endpoint: "/adduserroles",
    role: strrole,
  });

  try {
    setupQueryMod(
      `SELECT * FROM magod_setup.userroles WHERE Role = ?`,
      [strrole],
      async (err, datarole) => {
        if (err) {
          errorLogger.error("Error checking existing role", err, {
            endpoint: "/adduserroles",
            role: strrole,
          });
          return res.send(createError.InternalServerError());
        }

        if (datarole.length === 0) {
          setupQueryMod(
            `INSERT INTO magod_setup.userroles (Role) VALUES (?)`,
            [strrole],
            async (err, data) => {
              if (err) {
                errorLogger.error("Error inserting new role", err, {
                  endpoint: "/adduserroles",
                  role: strrole,
                });
                return res.send(createError.InternalServerError());
              }

              res.send({ status: "success" });
              infoLogger.info("User role added successfully", {
                endpoint: "/adduserroles",
                role: strrole,
              });
            }
          );
        } else {
          res.send({ status: "updated" });
          infoLogger.info("User role already exists", {
            endpoint: "/adduserroles",
            role: strrole,
          });
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /adduserroles", error, {
      endpoint: "/adduserroles",
      role: strrole,
    });
    next(error);
  }
});

// Delete a user role
userRouter.post("/deluserroles", async (req, res, next) => {
  const oldrole = req.body.rolenm;
  infoLogger.info("Attempting to delete user role", {
    endpoint: "/deluserroles",
    role: oldrole,
  });

  try {
    // Deactivate menus for this role
    setupQueryMod(
      `UPDATE magod_setup.menumapping SET ActiveMenu = 0 WHERE Role = ?`,
      [oldrole],
      (err, mmdata) => {
        if (err) {
          errorLogger.error("Error deactivating role menus", err, {
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
          return res.send(createError.InternalServerError());
        }

        res.send({ status: "Deleted" });
        infoLogger.info("User role deleted successfully", {
          endpoint: "/deluserroles",
          role: oldrole,
        });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /deluserroles", error, {
      endpoint: "/deluserroles",
      role: oldrole,
    });
    next(error);
  }
});

// Add or update a module
userRouter.post("/addusermodules", async (req, res, next) => {
  const strrole = req.body.Module;
  infoLogger.info("Attempting to add/update module", {
    endpoint: "/addusermodules",
    Module: strrole,
  });

  try {
    if (!strrole) {
      errorLogger.error("Module name is missing", {
        endpoint: "/addusermodules",
      });
      return res.send(createError.BadRequest());
    }

    // Check if module already exists
    setupQueryMod(
      `SELECT * FROM magod_setup.modules WHERE ModuleName = ?`,
      [strrole],
      async (err, data) => {
        if (err) {
          errorLogger.error("Error fetching module", err, {
            endpoint: "/addusermodules",
            Module: strrole,
          });
          return res.send(createError.InternalServerError());
        }

        if (data.length > 0) {
          // Module exists — update it
          setupQueryMod(
            `UPDATE magod_setup.modules SET ModuleName = ? WHERE ModuleName = ?`,
            [strrole, data[0]["ModuleName"]],
            async (err, updata) => {
              if (err) {
                errorLogger.error("Error updating module", err, {
                  endpoint: "/addusermodules",
                  Module: strrole,
                });
                return res.send(createError.InternalServerError());
              }
              res.send(updata);
              infoLogger.info("Module updated successfully", {
                endpoint: "/addusermodules",
                Module: strrole,
              });
            }
          );
        } else {
          // Module does not exist — insert it
          setupQueryMod(
            `INSERT INTO magod_setup.modules (ModuleName, ActiveModule) VALUES (?, '1')`,
            [strrole],
            async (err, data) => {
              if (err) {
                errorLogger.error("Error inserting module", err, {
                  endpoint: "/addusermodules",
                  Module: strrole,
                });
                return res.send(createError.InternalServerError());
              }

              if (data.affectedRows > 0) {
                setupQueryMod(
                  `SELECT * FROM magod_setup.modules`,
                  [],
                  async (err, modules) => {
                    if (err) {
                      errorLogger.error(
                        "Error fetching modules after insert",
                        err,
                        { endpoint: "/addusermodules" }
                      );
                      return res.send(createError.InternalServerError());
                    }
                    res.send(modules);
                    infoLogger.info("Module inserted successfully", {
                      endpoint: "/addusermodules",
                      Module: strrole,
                    });
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /addusermodules", error, {
      endpoint: "/addusermodules",
    });
    next(error);
  }
});

// Get menus for a specific role
userRouter.post("/getrolemenus", async (req, res, next) => {
  const strrole = req.body.Role;
  infoLogger.info("Fetching menus for role", {
    endpoint: "/getrolemenus",
    Role: strrole,
  });

  try {
    if (!strrole) {
      errorLogger.error("Role is missing", { endpoint: "/getrolemenus" });
      return res.send(createError.BadRequest());
    }

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
            Role: strrole,
          });
          return res.send(createError.InternalServerError());
        }
        res.send(data);
        infoLogger.info("Role menus fetched successfully", {
          endpoint: "/getrolemenus",
          Role: strrole,
        });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /getrolemenus", error, {
      endpoint: "/getrolemenus",
      Role: strrole,
    });
    next(error);
  }
});

// Get all active user menus
userRouter.post("/getusermenus", async (req, res, next) => {
  infoLogger.info("Fetching all active user menus", {
    endpoint: "/getusermenus",
  });

  try {
    setupQueryMod(
      `SELECT m.MenuName, m.MenuUrl 
       FROM magod_setup.menus m
       WHERE ActiveMenu = '1'`,
      async (err, data) => {
        if (err) {
          errorLogger.error("Error fetching active menus", err, {
            endpoint: "/getusermenus",
          });
          return res.send(createError.InternalServerError());
        }
        res.send(data);
        infoLogger.info("Active menus fetched successfully", {
          endpoint: "/getusermenus",
        });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /getusermenus", error, {
      endpoint: "/getusermenus",
    });
    next(error);
  }
});

// Delete (deactivate) a user menu
userRouter.post("/delusermenus", async (req, res, next) => {
  const mnuname = req.body.mname;
  infoLogger.info("Deleting user menu", {
    endpoint: "/delusermenus",
    menuName: mnuname,
  });

  try {
    setupQueryMod(
      `UPDATE magod_setup.menus SET ActiveMenu = '0' WHERE MenuName = ?`,
      [mnuname],
      (err, data) => {
        if (err) {
          errorLogger.error("Error deleting user menu", err, {
            endpoint: "/delusermenus",
            menuName: mnuname,
          });
          return res.send(createError.InternalServerError());
        }
        res.send({ status: "Deleted" });
        infoLogger.info("User menu deactivated successfully", {
          endpoint: "/delusermenus",
          menuName: mnuname,
        });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /delusermenus", error, {
      endpoint: "/delusermenus",
      menuName: mnuname,
    });
    next(error);
  }
});

// Add or update a user menu
userRouter.post("/addusermenus", async (req, res, next) => {
  const { MenuName, MenuUrl } = req.body.menu;
  infoLogger.info("Adding/updating user menu", {
    endpoint: "/addusermenus",
    MenuName,
    MenuUrl,
  });

  try {
    if (!MenuName || !MenuUrl) {
      errorLogger.error("MenuName or MenuUrl is missing", {
        endpoint: "/addusermenus",
      });
      return res.send(createError.BadRequest());
    }

    // Check if menu already exists
    setupQueryMod(
      `SELECT * FROM magod_setup.menus WHERE MenuName = ?`,
      [MenuName],
      async (err, data) => {
        if (err) {
          errorLogger.error("Error checking existing menu", err, {
            endpoint: "/addusermenus",
            MenuName,
          });
          return res.send(createError.InternalServerError());
        }

        if (data.length > 0) {
          // Menu exists, update URL
          setupQueryMod(
            `UPDATE magod_setup.menus SET MenuUrl = ? WHERE MenuName = ?`,
            [MenuUrl, MenuName],
            async (err, updata) => {
              if (err) {
                errorLogger.error("Error updating menu", err, {
                  endpoint: "/addusermenus",
                  MenuName,
                });
                return res.send(createError.InternalServerError());
              }
              infoLogger.info("Menu updated successfully", {
                endpoint: "/addusermenus",
                MenuName,
              });
              res.send({ status: "Updated" });
            }
          );
        } else {
          // Menu doesn't exist, insert new
          setupQueryMod(
            `INSERT INTO magod_setup.menus (MenuName, MenuUrl, ActiveMenu) VALUES (?, ?, '1')`,
            [MenuName, MenuUrl],
            async (err, insertData) => {
              if (err) {
                errorLogger.error("Error inserting menu", err, {
                  endpoint: "/addusermenus",
                  MenuName,
                });
                return res.send(createError.InternalServerError());
              }
              infoLogger.info("Menu added successfully", {
                endpoint: "/addusermenus",
                MenuName,
              });
              res.send({ status: "success" });
            }
          );
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /addusermenus", error, {
      endpoint: "/addusermenus",
      MenuName,
      MenuUrl,
    });
    next(error);
  }
});

// New endpoint to fetch menu URLs
// Fetch menu URLs for a user
userRouter.post("/fetchMenuUrls", async (req, res, next) => {
  const { role, username } = req.body;
  infoLogger.info("Fetching menu URLs", {
    endpoint: "/fetchMenuUrls",
    role,
    username,
    ip: req.ip,
  });

  try {
    if (!role || !username) {
      errorLogger.error("Missing role or username", {
        endpoint: "/fetchMenuUrls",
        role,
        username,
      });
      return res.send(createError.BadRequest());
    }

    // Get user details
    setupQueryMod(
      `SELECT usr.Name, usr.UserName, usr.Password, usr.Role, unt.UnitName, usr.ActiveUser
       FROM magod_setup.magod_userlist usr
       LEFT JOIN magod_setup.magodlaser_units unt ON unt.UnitID = usr.UnitID
       WHERE usr.UserName = ? AND usr.ActiveUser = '1'`,
      [username],
      async (err, users) => {
        if (err) {
          errorLogger.error("Error fetching user", err, {
            endpoint: "/fetchMenuUrls",
            username,
          });
          return res.send(createError.InternalServerError());
        }

        if (users.length === 0) {
          errorLogger.error("Invalid username", {
            endpoint: "/fetchMenuUrls",
            username,
          });
          return res.send(createError.Unauthorized("Invalid Username"));
        }

        const user = users[0];

        // Get menu URLs and module IDs for the user's role
        setupQueryMod(
          `SELECT m.MenuUrl, m.ModuleId
           FROM magod_setup.menumapping mm
           LEFT JOIN magod_setup.menus m ON m.Id = mm.MenuId
           WHERE mm.Role = ? AND mm.ActiveMenu = '1'`,
          [user.Role],
          async (err, menus) => {
            if (err) {
              errorLogger.error("Error fetching menus", err, {
                endpoint: "/fetchMenuUrls",
                role: user.Role,
              });
              return res.send(createError.InternalServerError());
            }

            const menuArray = menus.map((m) => m.MenuUrl);
            const moduleIds = [
              ...new Set(
                menus.map((m) => m.ModuleId).filter((id) => id !== null)
              ),
            ];

            infoLogger.info("Fetched menu URLs successfully", {
              endpoint: "/fetchMenuUrls",
              username,
            });

            res.send({
              data: { ...user, access: menuArray },
              moduleIds,
            });
          }
        );
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /fetchMenuUrls", error, {
      endpoint: "/fetchMenuUrls",
      username,
    });
    next(error);
  }
});

module.exports = userRouter;

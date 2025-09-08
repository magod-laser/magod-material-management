const shopFloorIssueRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch part issue voucher list by status
shopFloorIssueRouter.get("/getPartIssueVoucherList", async (req, res, next) => {
  const { status } = req.query;

  infoLogger.info("Requested part issue voucher list", {
    endpoint: "/getPartIssueVoucherList",
    method: req.method,
    Status: status,
  });

  try {
    misQueryMod(
      `SELECT n1.DwgName as AssyName, s.*, n.TaskNo, n.NcId, n.Machine, n.Operation, 
                n.Mtrl_Code, n.CustMtrl, n.Cust_Code, c.Cust_Name 
         FROM magodmis.shopfloor_part_issueregister s,
              magodmis.ncprograms n,
              magodmis.ncprogram_partslist n1,
              magodmis.cust_data c
         WHERE s.NcId = n.Ncid 
           AND n1.NcId = n.Ncid  
           AND s.Status = ? 
           AND n.Cust_Code = c.Cust_Code 
         ORDER BY Issue_date DESC`,
      [status],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching part issue voucher list", err, {
            endpoint: "/getPartIssueVoucherList",
            Status: status,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched part issue voucher list successfully", {
          endpoint: "/getPartIssueVoucherList",
          Status: status,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching part issue voucher list",
      error,
      {
        endpoint: "/getPartIssueVoucherList",
        Status: status,
      }
    );
    next(error);
  }
});

// Fetch production material issue parts by IssueID
shopFloorIssueRouter.get(
  "/getProductionMaterialIssueParts",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Requested production material issue parts", {
      endpoint: "/getProductionMaterialIssueParts",
      method: req.method,
      IssueID: id,
    });

    try {
      misQueryMod(
        `SELECT n1.DwgName as AssyName, s.*, n.TaskNo, n.NCProgramNo, n.NcId, n.Machine, n.Operation,
        n.Mtrl_Code, n.CustMtrl, n.Cust_Code 
        FROM magodmis.shopfloor_part_issueregister s
        JOIN magodmis.ncprograms n ON s.NcId = n.NcId
        JOIN magodmis.ncprogram_partslist n1 ON n1.NcId = n.NcId
        WHERE s.IssueID = ?`,
        [id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching production material issue parts",
              err,
              {
                endpoint: "/getProductionMaterialIssueParts",
                IssueID: id,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Fetched production material issue parts successfully",
            {
              endpoint: "/getProductionMaterialIssueParts",
              IssueID: id,
              records: data.length,
            }
          );

          data && data.length !== 0 ? res.send(data[0]) : res.send([]);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching production material issue parts",
        error,
        {
          endpoint: "/getProductionMaterialIssueParts",
          IssueID: id,
        }
      );
      next(error);
    }
  }
);

// Fetch production material issue parts table by IV_ID
shopFloorIssueRouter.get(
  "/getProductionMaterialIssuePartsTable",
  async (req, res, next) => {
    const { id, custCode } = req.query;

    infoLogger.info("Requested production material issue parts table", {
      endpoint: "/getProductionMaterialIssuePartsTable",
      method: req.method,
      IV_ID: id,
      CustCode: custCode,
    });

    try {
      misQueryMod(
        `SELECT s.*, m.PartId, m1.RV_No, m1.CustDocuNo
         FROM magodmis.shopfloor_bom_issuedetails s,
              magodmis.mtrl_part_receipt_details m,
              magodmis.material_receipt_register m1
         WHERE m.Id = s.PartReceipt_DetailsID
           AND m1.RvID = s.RV_Id
           AND s.IV_ID = ?`,
        [id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching production material issue parts table",
              err,
              {
                endpoint: "/getProductionMaterialIssuePartsTable",
                IV_ID: id,
                CustCode: custCode,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Fetched production material issue parts table successfully",
            {
              endpoint: "/getProductionMaterialIssuePartsTable",
              IV_ID: id,
              CustCode: custCode,
              records: data.length,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching production material issue parts table",
        error,
        {
          endpoint: "/getProductionMaterialIssuePartsTable",
          IV_ID: id,
          CustCode: custCode,
        }
      );
      next(error);
    }
  }
);

// Fetch material issue voucher list by status
shopFloorIssueRouter.get(
  "/getMaterialIssueVoucherList",
  async (req, res, next) => {
    const { status } = req.query;

    infoLogger.info("Requested material issue voucher list", {
      endpoint: "/getMaterialIssueVoucherList",
      method: req.method,
      Status: status,
    });

    try {
      misQueryMod(
        `SELECT s.*, c.Cust_Name, n.TaskNo, n.NcId, n.Machine, n.Operation,
                n.Mtrl_Code, n.CustMtrl, n.Cust_Code
         FROM magodmis.shopfloor_material_issueregister s,
              magodmis.cust_data c,
              magodmis.ncprograms n
         WHERE s.Status = ? 
           AND n.Cust_Code = c.Cust_Code 
           AND s.NcId = n.Ncid
         ORDER BY Issue_date DESC`,
        [status],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching material issue voucher list",
              err,
              {
                endpoint: "/getMaterialIssueVoucherList",
                Status: status,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Fetched material issue voucher list successfully", {
            endpoint: "/getMaterialIssueVoucherList",
            Status: status,
            records: data.length,
          });

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching material issue voucher list",
        error,
        {
          endpoint: "/getMaterialIssueVoucherList",
          Status: status,
        }
      );
      next(error);
    }
  }
);

// Fetch shop material issue voucher by IssueID
shopFloorIssueRouter.get(
  "/getShopMaterialIssueVoucher",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Requested shop material issue voucher", {
      endpoint: "/getShopMaterialIssueVoucher",
      method: req.method,
      IssueID: id,
    });

    try {
      misQueryMod(
        `SELECT s.*, n.TaskNo, n.Machine, n.Operation,
         n.MProcess, c.Cust_name, n.Qty, n.CustMtrl, n.Mtrl_Code, n.Para1, n.Para2, n.Para3
         FROM magodmis.shopfloor_material_issueregister s, magodmis.ncprograms n,
              magodmis.cust_data c
         WHERE s.IssueID = ? AND s.NcId = n.NcId
           AND s.Status <> 'Closed' AND n.Cust_Code = c.Cust_Code
         ORDER BY s.Iv_No`,
        [id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching shop material issue voucher",
              err,
              {
                endpoint: "/getShopMaterialIssueVoucher",
                IssueID: id,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Fetched shop material issue voucher successfully", {
            endpoint: "/getShopMaterialIssueVoucher",
            IssueID: id,
            records: data.length,
          });

          data && data.length !== 0 ? res.send(data[0]) : res.send([]);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching shop material issue voucher",
        error,
        {
          endpoint: "/getShopMaterialIssueVoucher",
          IssueID: id,
        }
      );
      next(error);
    }
  }
);

// Fetch shop material issue voucher table by IssueID
shopFloorIssueRouter.get(
  "/getShopMaterialIssueVoucherTable",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Requested shop material issue voucher table", {
      endpoint: "/getShopMaterialIssueVoucherTable",
      method: req.method,
      IssueID: id,
    });

    try {
      misQueryMod(
        `SELECT n.NcPgmMtrlId, n.IssueId, n.ShapeMtrlID, n.Para1, n.Para2,
                n.Para3, n.Used, n.Rejected
         FROM magodmis.ncprogrammtrlallotmentlist n
         WHERE n.IssueId = ?`,
        [id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching shop material issue voucher table",
              err,
              {
                endpoint: "/getShopMaterialIssueVoucherTable",
                IssueID: id,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Fetched shop material issue voucher table successfully",
            {
              endpoint: "/getShopMaterialIssueVoucherTable",
              IssueID: id,
              records: data.length,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching shop material issue voucher table",
        error,
        {
          endpoint: "/getShopMaterialIssueVoucherTable",
          IssueID: id,
        }
      );
      next(error);
    }
  }
);

// Fetch Shop Floor Service Part Table
shopFloorIssueRouter.get(
  "/getShopFloorServicePartTable",
  async (req, res, next) => {
    const { type, hasbom } = req.query;

    infoLogger.info("Request received for Shop Floor Service Part Table", {
      endpoint: "/getShopFloorServicePartTable",
      method: req.method,
      type,
      hasbom,
    });

    try {
      const query = `
        SELECT n.*, c.Cust_Name
        FROM magodmis.ncprograms n
        JOIN magodmis.nc_task_list n1 ON n1.NcTaskId = n.NcTaskId
        JOIN magodmis.orderschedule o ON o.ScheduleId = n1.ScheduleID
        JOIN magodmis.cust_data c ON n.Cust_Code = c.Cust_code
        WHERE n.Qty > n.QtyAllotted
          AND n.Machine IS NOT NULL
          AND NOT (n.PStatus = 'Created' OR n.PStatus = 'Suspended' 
                   OR n.PStatus = 'Closed' OR n.PStatus = 'ShortClosed')
          AND o.Type = ?
          AND HasBOM = ?
          AND n.Suspend = 0
        ORDER BY n.Ncid DESC
      `;
      const values = [type, hasbom];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Database error in getShopFloorServicePartTable",
            err,
            {
              endpoint: "/getShopFloorServicePartTable",
              type,
              hasbom,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully fetched Shop Floor Service Part Table", {
          endpoint: "/getShopFloorServicePartTable",
          type,
          hasbom,
          recordsFetched: data?.length || 0,
        });

        res.send(data || []);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in getShopFloorServicePartTable",
        error,
        {
          endpoint: "/getShopFloorServicePartTable",
          type,
          hasbom,
        }
      );
      next(error);
    }
  }
);

// Fetch shop floor service tree view machine data
shopFloorIssueRouter.get(
  "/getShopFloorServiceTreeViewMachine",
  async (req, res, next) => {
    const { type, hasbom } = req.query;

    infoLogger.info("Request received", {
      endpoint: "/getShopFloorServiceTreeViewMachine",
      method: req.method,
      query: { type, hasbom },
    });

    try {
      const query = `
        SELECT n.machine, count(*)
        FROM magodmis.ncprograms n
        JOIN magodmis.nc_task_list n1 ON n1.NcTaskId = n.NcTaskId
        JOIN magodmis.orderschedule o ON o.ScheduleId = n1.ScheduleID
        JOIN magodmis.cust_data c ON n.Cust_Code = c.Cust_code
        WHERE n.Qty > n.QtyAllotted 
          AND n.Machine IS NOT NULL
          AND NOT (n.PStatus = 'Created' OR n.PStatus = 'Suspended' OR n.PStatus = 'Closed' OR n.PStatus = 'ShortClosed')
          AND o.Type = ?
          AND HasBOM = ?
        GROUP BY n.machine
      `;

      misQueryMod(query, [type, hasbom], (err, data) => {
        if (err) {
          errorLogger.error("Database error", err, {
            endpoint: "/getShopFloorServiceTreeViewMachine",
            query: { type, hasbom },
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Request successful", {
          endpoint: "/getShopFloorServiceTreeViewMachine",
          query: { type, hasbom },
          recordsFetched: data?.length || 0,
        });

        res.send(data || []);
      });
    } catch (error) {
      errorLogger.error("Unexpected error", error, {
        endpoint: "/getShopFloorServiceTreeViewMachine",
        query: { type, hasbom },
      });
      next(error);
    }
  }
);

// Fetch shop floor service process details by Type, HasBOM, and Machine
shopFloorIssueRouter.get(
  "/getShopFloorServiceTreeViewProcess",
  async (req, res, next) => {
    const { type, hasbom, machine, tree } = req.query;

    infoLogger.info("Request received for shop floor service process details", {
      endpoint: "/getShopFloorServiceTreeViewProcess",
      method: req.method,
      query: { type, hasbom, machine, tree },
    });

    try {
      if (tree === "1") {
        const query = `
          SELECT n.MProcess, count(*)
          FROM magodmis.ncprograms n
          JOIN magodmis.nc_task_list n1 ON n1.NcTaskId = n.NcTaskId
          JOIN magodmis.orderschedule o ON o.ScheduleId = n1.ScheduleID
          JOIN magodmis.cust_data c ON n.Cust_Code = c.Cust_code
          WHERE n.Qty > n.QtyAllotted
            AND n.Machine IS NOT NULL
            AND NOT (n.PStatus = 'Created' OR n.PStatus = 'Suspended' OR n.PStatus = 'Closed' OR n.PStatus = 'ShortClosed')
            AND o.Type = ?
            AND HasBOM = ?
            AND n.Machine = ?
          GROUP BY n.MProcess
        `;
        const values = [type, hasbom, machine];

        misQueryMod(query, values, (err, data) => {
          if (err) {
            errorLogger.error(
              "Database error fetching grouped process data",
              err,
              {
                endpoint: "/getShopFloorServiceTreeViewProcess",
                query: { type, hasbom, machine, tree },
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Fetched grouped process data successfully", {
            endpoint: "/getShopFloorServiceTreeViewProcess",
            query: { type, hasbom, machine, tree },
            recordsFetched: data?.length || 0,
          });

          res.send(data || []);
        });
      } else {
        const query = `
          SELECT n.*, c.Cust_Name
          FROM magodmis.ncprograms n
          JOIN magodmis.nc_task_list n1 ON n1.NcTaskId = n.NcTaskId
          JOIN magodmis.orderschedule o ON o.ScheduleId = n1.ScheduleID
          JOIN magodmis.cust_data c ON n.Cust_Code = c.Cust_code
          WHERE n.Qty > n.QtyAllotted
            AND n.Machine IS NOT NULL
            AND NOT (n.PStatus = 'Created' OR n.PStatus = 'Suspended' OR n.PStatus = 'Closed' OR n.PStatus = 'ShortClosed')
            AND o.Type = ?
            AND HasBOM = ?
            AND n.Machine = ?
          ORDER BY n.Ncid DESC
        `;
        const values = [type, hasbom, machine];

        misQueryMod(query, values, (err, data) => {
          if (err) {
            errorLogger.error(
              "Database error fetching detailed process data",
              err,
              {
                endpoint: "/getShopFloorServiceTreeViewProcess",
                query: { type, hasbom, machine, tree },
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Fetched detailed process data successfully", {
            endpoint: "/getShopFloorServiceTreeViewProcess",
            query: { type, hasbom, machine, tree },
            recordsFetched: data?.length || 0,
          });

          res.send(data || []);
        });
      }
    } catch (error) {
      errorLogger.error(
        "Unexpected error in shop floor service process route",
        error,
        {
          endpoint: "/getShopFloorServiceTreeViewProcess",
          query: { type, hasbom, machine, tree },
        }
      );
      next(error);
    }
  }
);

// Fetch shop floor service material codes by Type, HasBOM, Machine, and Process
shopFloorIssueRouter.get(
  "/getShopFloorServiceTreeViewMtrlCode",
  async (req, res, next) => {
    const { type, hasbom, machine, process, tree } = req.query;

    infoLogger.info("Request received for shop floor service material codes", {
      endpoint: "/getShopFloorServiceTreeViewMtrlCode",
      method: req.method,
      query: { type, hasbom, machine, process, tree },
    });

    try {
      if (tree === "1") {
        const query = `
          SELECT n.Mtrl_Code, count(*)
          FROM magodmis.ncprograms n
          JOIN magodmis.nc_task_list n1 ON n1.NcTaskId = n.NcTaskId
          JOIN magodmis.orderschedule o ON o.ScheduleId = n1.ScheduleID
          JOIN magodmis.cust_data c ON n.Cust_Code = c.Cust_code
          WHERE n.Qty > n.QtyAllotted
            AND n.Machine IS NOT NULL
            AND NOT (n.PStatus = 'Created' OR n.PStatus = 'Suspended' OR n.PStatus = 'Closed' OR n.PStatus = 'ShortClosed')
            AND o.Type = ?
            AND HasBOM = ?
            AND n.Machine = ?
            AND n.MProcess = ?
          GROUP BY n.Mtrl_Code
        `;
        const values = [type, hasbom, machine, process];

        misQueryMod(query, values, (err, data) => {
          if (err) {
            errorLogger.error(
              "Database error fetching grouped material codes",
              err,
              {
                endpoint: "/getShopFloorServiceTreeViewMtrlCode",
                query: { type, hasbom, machine, process, tree },
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Fetched grouped material codes successfully", {
            endpoint: "/getShopFloorServiceTreeViewMtrlCode",
            query: { type, hasbom, machine, process, tree },
            recordsFetched: data?.length || 0,
          });

          res.send(data || []);
        });
      } else {
        const query = `
          SELECT n.*, c.Cust_Name
          FROM magodmis.ncprograms n
          JOIN magodmis.nc_task_list n1 ON n1.NcTaskId = n.NcTaskId
          JOIN magodmis.orderschedule o ON o.ScheduleId = n1.ScheduleID
          JOIN magodmis.cust_data c ON n.Cust_Code = c.Cust_code
          WHERE n.Qty > n.QtyAllotted
            AND n.Machine IS NOT NULL
            AND NOT (n.PStatus = 'Created' OR n.PStatus = 'Suspended' OR n.PStatus = 'Closed' OR n.PStatus = 'ShortClosed')
            AND o.Type = ?
            AND HasBOM = ?
            AND n.Machine = ?
            AND n.MProcess = ?
          ORDER BY n.Ncid DESC
        `;
        const values = [type, hasbom, machine, process];

        misQueryMod(query, values, (err, data) => {
          if (err) {
            errorLogger.error(
              "Database error fetching detailed material codes",
              err,
              {
                endpoint: "/getShopFloorServiceTreeViewMtrlCode",
                query: { type, hasbom, machine, process, tree },
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Fetched detailed material codes successfully", {
            endpoint: "/getShopFloorServiceTreeViewMtrlCode",
            query: { type, hasbom, machine, process, tree },
            recordsFetched: data?.length || 0,
          });

          res.send(data || []);
        });
      }
    } catch (error) {
      errorLogger.error(
        "Unexpected error in shop floor service material codes route",
        error,
        {
          endpoint: "/getShopFloorServiceTreeViewMtrlCode",
          query: { type, hasbom, machine, process, tree },
        }
      );
      next(error);
    }
  }
);

// Fetch shop floor service details for a clicked material code
shopFloorIssueRouter.get(
  "/getShopFloorServiceTreeViewMtrlCodeClick",
  async (req, res, next) => {
    const { type, hasbom, machine, process, material } = req.query;

    infoLogger.info("Request received for shop floor material code click", {
      endpoint: "/getShopFloorServiceTreeViewMtrlCodeClick",
      method: req.method,
      query: { type, hasbom, machine, process, material },
    });

    try {
      const query = `
        SELECT n.*, c.Cust_Name
        FROM magodmis.ncprograms n
        JOIN magodmis.nc_task_list n1 ON n1.NcTaskId = n.NcTaskId
        JOIN magodmis.orderschedule o ON o.ScheduleId = n1.ScheduleID
        JOIN magodmis.cust_data c ON n.Cust_Code = c.Cust_code
        WHERE n.Qty > n.QtyAllotted
          AND n.Machine IS NOT NULL
          AND NOT (n.PStatus = 'Created' OR n.PStatus = 'Suspended' OR n.PStatus = 'Closed' OR n.PStatus = 'ShortClosed')
          AND o.Type = ?
          AND HasBOM = ?
          AND n.Machine = ?
          AND n.MProcess = ?
          AND n.Mtrl_Code = ?
        ORDER BY n.Ncid DESC
      `;

      const values = [type, hasbom, machine, process, material];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Database error fetching material code click data",
            err,
            {
              endpoint: "/getShopFloorServiceTreeViewMtrlCodeClick",
              query: { type, hasbom, machine, process, material },
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched material code click data successfully", {
          endpoint: "/getShopFloorServiceTreeViewMtrlCodeClick",
          query: { type, hasbom, machine, process, material },
          recordsFetched: data?.length || 0,
        });

        res.send(data || []);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in material code click route",
        error,
        {
          endpoint: "/getShopFloorServiceTreeViewMtrlCodeClick",
          query: { type, hasbom, machine, process, material },
        }
      );
      next(error);
    }
  }
);

module.exports = shopFloorIssueRouter;

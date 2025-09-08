const ncprogrammtrlallotmentlistRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Insert a new record into ncprogrammtrlallotmentlist
ncprogrammtrlallotmentlistRouter.post(
  "/insertncprogrammtrlallotmentlist",
  async (req, res, next) => {
    const {
      TaskNo,
      NCProgramNo,
      ShapeMtrlID,
      Mtrl_Code,
      NCPara1,
      NCPara2,
      NCPara3,
      Para1,
      Para2,
      Para3,
      IssueId,
      NoReturn,
      Ncid,
    } = req.body;

    infoLogger.info("Requested insert into ncprogrammtrlallotmentlist", {
      endpoint: "/insertncprogrammtrlallotmentlist",
      method: req.method,
      TaskNo,
      NCProgramNo,
      ShapeMtrlID,
      Mtrl_Code,
      NCPara1,
      NCPara2,
      NCPara3,
      Para1,
      Para2,
      Para3,
      IssueId,
      NoReturn,
      Ncid,
    });

    try {
      misQueryMod(
        `INSERT INTO magodmis.ncprogrammtrlallotmentlist 
         (TaskNo, NCProgramNo, ShapeMtrlID, Mtrl_Code,
          NCPara1, NCPara2, NCPara3, Para1, Para2, Para3, IssueId, NoReturn, Ncid) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          TaskNo,
          NCProgramNo,
          ShapeMtrlID,
          Mtrl_Code,
          NCPara1,
          NCPara2,
          NCPara3,
          Para1,
          Para2,
          Para3,
          IssueId,
          NoReturn,
          Ncid,
        ],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error inserting into ncprogrammtrlallotmentlist",
              err,
              {
                endpoint: "/insertncprogrammtrlallotmentlist",
                TaskNo,
                NCProgramNo,
                ShapeMtrlID,
                Mtrl_Code,
                NCPara1,
                NCPara2,
                NCPara3,
                Para1,
                Para2,
                Para3,
                IssueId,
                NoReturn,
                Ncid,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Inserted into ncprogrammtrlallotmentlist successfully",
            {
              endpoint: "/insertncprogrammtrlallotmentlist",
              TaskNo,
              NCProgramNo,
              ShapeMtrlID,
              Mtrl_Code,
              NCPara1,
              NCPara2,
              NCPara3,
              Para1,
              Para2,
              Para3,
              IssueId,
              NoReturn,
              Ncid,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error inserting into ncprogrammtrlallotmentlist",
        error,
        {
          endpoint: "/insertncprogrammtrlallotmentlist",
          TaskNo,
          NCProgramNo,
          ShapeMtrlID,
          Mtrl_Code,
          NCPara1,
          NCPara2,
          NCPara3,
          Para1,
          Para2,
          Para3,
          IssueId,
          NoReturn,
          Ncid,
        }
      );
      next(error);
    }
  }
);

// Mark a ncprogrammtrlallotmentlist record to return to stock by NcPgmMtrlId
ncprogrammtrlallotmentlistRouter.post(
  "/updatencprogrammtrlallotmentlistReturnStock",
  async (req, res, next) => {
    const { id } = req.body;

    infoLogger.info(
      "Requested to mark ncprogrammtrlallotmentlist record to return to stock",
      {
        endpoint: "/updatencprogrammtrlallotmentlistReturnStock",
        method: req.method,
        NcPgmMtrlId: id,
      }
    );

    try {
      misQueryMod(
        `UPDATE ncprogrammtrlallotmentlist n 
         SET n.ReturnToStock = -1
         WHERE n.NcPgmMtrlId = ?`,
        [id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error updating ncprogrammtrlallotmentlist ReturnToStock",
              err,
              {
                endpoint: "/updatencprogrammtrlallotmentlistReturnStock",
                NcPgmMtrlId: id,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Updated ncprogrammtrlallotmentlist ReturnToStock successfully",
            {
              endpoint: "/updatencprogrammtrlallotmentlistReturnStock",
              NcPgmMtrlId: id,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error updating ncprogrammtrlallotmentlist ReturnToStock",
        error,
        {
          endpoint: "/updatencprogrammtrlallotmentlistReturnStock",
          NcPgmMtrlId: id,
        }
      );
      next(error);
    }
  }
);

module.exports = ncprogrammtrlallotmentlistRouter;

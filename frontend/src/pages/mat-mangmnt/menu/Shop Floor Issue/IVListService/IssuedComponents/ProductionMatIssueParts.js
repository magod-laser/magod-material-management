import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../../../../../utils";
import BootstrapTable from "react-bootstrap-table-next";
import { useNavigate } from "react-router-dom";
import OkModal from "../../../../components/OkModal";
import { toast } from "react-toastify";
import ShopFloorAcceptReturnPartsYesNoModal from "../../../../components/ShopFloorAcceptReturnPartsYesNoModal";

import PrintIVListServicePart from "../../../../print/shopfloorissue/PrintIVListServicePart";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function ProductionMatIssueParts() {
  const nav = useNavigate();
  const location = useLocation();
  // console.log("CustCode", location?.state?.custCode);

  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false); //cancel
  const [show2, setShow2] = useState(false); //accept
  const [showYN, setShowYN] = useState(false);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const [modalMessage, setModalMessage] = useState(
    "By cancelling this Issue Voucher the material stock will revert to Receipt Voucher. Continue?"
  );

  let [formHeader, setFormHeader] = useState({
    AssyName: "",
    CustMtrl: "",
    Cust_Code: "",
    Cust_name: "",
    IV_No: "",
    IssueID: "",
    Issue_date: "",
    Machine: "",
    Mtrl_Code: "",
    NCProgramNo: "",
    NC_ProgramNo: "",
    NcId: "",
    Operation: "",
    QtyIssued: "",
    QtyReturned: "",
    QtyUsed: "",
    Remarks: "",
    Status: "",
    TaskNo: "",
  });

  const fetchData = async () => {
    let url =
      endpoints.getProductionMaterialIssueParts +
      "?id=" +
      location.state.issueIDVal;
    console.log("issueIDVal", location?.state?.issueIDVal);
    getRequest(url, async (data) => {
      console.log("data = ", data);
      //get cust name
      let url1 = endpoints.getCustomerByCustCode + "?code=" + data.Cust_Code;
      getRequest(url1, async (cdata) => {
        setFormHeader({
          AssyName: data.AssyName,
          CustMtrl: data.CustMtrl,
          Cust_Code: data.Cust_Code,
          Cust_name: cdata.Cust_name,
          IV_No: data.IV_No,
          IssueID: data.IssueID,
          Issue_date: formatDate(new Date(data.Issue_date), 3), //data.Issue_date,
          Machine: data.Machine,
          Mtrl_Code: data.Mtrl_Code,
          NCProgramNo: data.NCProgramNo,
          NC_ProgramNo: data.NC_ProgramNo,
          NcId: data.NcId,
          Operation: data.Operation,
          QtyIssued: data.QtyIssued,
          QtyReturned: data.QtyReturned,
          QtyUsed: data.QtyUsed,
          Remarks: data.Remarks,
          Status: data.Status,
          TaskNo: data.TaskNo,
        });
      });
    });
    //get table data

    let url2 =
      endpoints.getProductionMaterialIssuePartsTable +
      "?id=" +
      location?.state?.issueIDVal;
    // +
    // "&custCode=" +
    // location?.state?.custCode;
    getRequest(url2, (data) => {
      console.log("table data..................... = ", data);
      setTableData(data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      text: "Id",
      dataField: "Id",
      hidden: true,
    },
    {
      text: "RV No",
      dataField: "RV_No",
      sort: true,
    },
    {
      text: "Part ID",
      dataField: "PartId",
      sort: true,
    },
    {
      text: "Issued",
      dataField: "QtyIssued",
      sort: true,
    },
    {
      text: "Used",
      dataField: "QtyUsed",
      sort: true,
    },
    {
      text: "Returned",
      dataField: "QtyReturned",
      sort: true,
    },
  ];

  const modalResponseok = (msg) => {
    console.log("msg = ", msg);
    if (msg === "ok") {
      for (let i = 0; i < tableData.length; i++) {
        let update1 = {
          Id: tableData[i].PartReceipt_DetailsID,
          Qty: tableData[i].QtyIssued,
        };
        //update QtyIssue mtrlpartreceiptdetails
        postRequest(
          endpoints.updateQtyIssuedPartReceiptDetails,
          update1,
          (data) => {
            console.log("update1");
          }
        );

        //shopfloorbomissuedetails set qtyreturn = qtyissue
        let update2 = {
          Id: tableData[i].Id,
        };
        postRequest(
          endpoints.updateQtyReturnedShopfloorBOMIssueDetails,
          update2,
          (data) => {
            console.log("update2");
          }
        );
      }

      //update ncprogram qtyalloated
      let update3 = {
        Id: formHeader.NcId,
        Qty: formHeader.QtyIssued,
      };
      postRequest(endpoints.updateQtyAllotedncprograms, update3, (data) => {
        console.log("update3");
      });

      //update shopfloorpartissueregiser stats closed
      let update4 = {
        Id: formHeader.IssueID,
        status: "Cancelled",
      };
      postRequest(
        endpoints.updateStatusShopfloorPartIssueRegister,
        update4,
        (data) => {
          console.log("update4");
          setFormHeader({ ...formHeader, Status: "Cancelled" });
        }
      );

      // toast.success("Parts Cancelled Successfully");
      toast.success("Issue Voucher Cancelled");
    }
    console.log("formHeader.Status after updates:", formHeader.Status);
  };

  const cancelButton = () => {
    setShow(true);
    setShow1(true);
  };

  const acceptReturn = () => {
    let flag = 0;
    for (let i = 0; i < tableData.length; i++) {
      if (
        tableData[i].QtyIssued !==
        tableData[i].QtyUsed + tableData[i].QtyReturned
      ) {
        flag = 1;
      }
    }
    if (flag == 1) {
      toast.error(
        "Cannot Accept Partial Return, Use Issued Quantity before returning"
      );
    } else {
      setShow2(true);
      setShowYN(true);
    }
  };
  const printButton = () => {
    // nav(
    //   "/MaterialManagement/ShopFloorIssue/IVListService/PrintIVListServicePart",
    //   {
    //     state: {
    //       formHeader: formHeader,
    //       tableData: tableData,
    //     },
    //   }
    // );
    setIsPrintModalOpen(true);
  };
  return (
    <div>
      <ShopFloorAcceptReturnPartsYesNoModal
        showYN={showYN}
        setShowYN={setShowYN}
        formHeader={formHeader}
        setFormHeader={setFormHeader}
        tableData={tableData}
      />
      <OkModal
        show={show}
        setShow={setShow}
        modalMessage={modalMessage}
        modalResponseok={modalResponseok}
      />

      <PrintIVListServicePart
        isOpen={isPrintModalOpen}
        formHeader={formHeader}
        tableData={tableData}
        setIsPrintModalOpen={setIsPrintModalOpen}
      />

      <h4 className="title">Production Material Issue :Parts</h4>

      <div className="table_top_style">
        <div className="row">
          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Issue Vr No
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.IV_No}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Assembly Name
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.AssyName}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "33px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Allotted
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.QtyIssued}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "13px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Vr Date
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Issue_date}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "15px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Operation
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Operation}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "48px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Returned
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.QtyReturned}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Program No
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.NCProgramNo}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Material
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Mtrl_Code}
              disabled
            />
          </div>

          <div className="d-flex col-md-6" style={{ gap: "15px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Customer
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Cust_name}
              disabled
            />
          </div>

          <div className="d-flex col-md-5">
            <button className="button-style" onClick={printButton}>
              Print
            </button>
            <button
              className="button-style "
              onClick={cancelButton}
              // disabled={show1 || formHeader.Status === "Closed" ? true : false}
              // disabled={
              //   show1 || formHeader.Status === "Cancelled" ? true : false
              // }
              // disabled={
              //   show1 ||
              //   formHeader.Status === "Cancelled" ||
              //   formHeader.Status === "Closed"
              // }
              disabled={
                formHeader.Status === "Cancelled" ||
                formHeader.Status === "Closed" ||
                formHeader.Status !== "Created" ||
                formHeader.QtyReturned > 0 ||
                formHeader.QtyUsed > 0
              }
            >
              Cancel
            </button>
            <button
              className="button-style "
              onClick={acceptReturn}
              // disabled={show2 || formHeader.Status === "Closed" ? true : false}
              disabled={
                formHeader.Status !== "Created" ||
                formHeader.QtyReturned === 0 ||
                formHeader.Status === "Closed"
              }
            >
              Accept Return
            </button>
            <button
              className="button-style "
              id="btnclose"
              type="submit"
              onClick={() => nav("/MaterialManagement")}
            >
              Close
            </button>{" "}
          </div>
        </div>
        <div className="row"></div>

        <div className="row"></div>
        <div className="row"></div>
      </div>

      <div>
        <div
          style={{ height: "400px", overflowY: "scroll", marginTop: "30px" }}
        >
          <BootstrapTable
            keyField="Id"
            columns={columns}
            data={tableData}
            striped
            hover
            condensed
            //pagination={paginationFactory()}
            //selectRow={selectRow}
            headerClasses="header-class tableHeaderBGColor"
          ></BootstrapTable>
        </div>
      </div>
    </div>
  );
}

export default ProductionMatIssueParts;

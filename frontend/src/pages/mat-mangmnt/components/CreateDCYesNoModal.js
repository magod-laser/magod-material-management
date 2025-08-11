import { useRef } from "react";
import Modal from "react-bootstrap/Modal";
import { formatDate } from "../../../utils";
import { toast } from "react-toastify";

const { getRequest, postRequest } = require("../../api/apiinstance");
const { endpoints } = require("../../api/constants");

function CreateDCYesNoModal(props) {
  const toastId = useRef(null);

  const handleSave = (e) => {
    props.saveButtonState(e);
    toastId.createDC = toast.loading("Creating the DC");

    let newNo = (parseInt(props.runningNoData.Running_No) + 1).toString();
    let series = "";

    for (let i = 0; i < props.runningNoData.Length; i++) {
      if (newNo.length < props.runningNoData.Length) {
        newNo = 0 + newNo;
      }
    }
    series =
      (props.runningNoData.Prefix || "") +
      newNo +
      (props.runningNoData.Suffix || "");

    let yy = formatDate(new Date(), 6).toString().substring(2);
    let no = yy + "/" + series;

    //get cust data
    let url1 =
      endpoints.getCustomerByCustCode + "?code=" + props.formHeader.Cust_code;

    getRequest(url1, (data) => {
      let DCRegister = {
        DC_Type: "Material Return",
        DC_No: no,
        DC_Date: formatDate(new Date(), 2),
        Cust_Code: props.formHeader.Cust_code,
        Cust_Name: props.formHeader.Customer,
        Cust_Address: data.Address,
        Cust_Place: data.City,
        Cust_State: data.State,
        PIN_Code: data.Pin_Code,
        GSTNo: props.type === "parts" ? "" : data.GSTNo,
        ECC_No: props.type === "parts" ? data.ECC_No : "",
        TIN_No: props.type === "parts" ? data.TIN_No : "",
        CST_No: props.type === "parts" ? data.CST_No : "",
        AuhtorisingDocu:
          props.formHeader.IV_No +
          " Dt " +
          formatDate(
            new Date(props.formHeader.IV_Date.toString().substring(0, 10)),
            7
          ),
        Total_Wt: props.formHeader.TotalWeight,
        ScarpWt: 0,
        DCStatus: "Draft",
        Remarks:
          props.formHeader.IV_No +
          " Dt " +
          formatDate(
            new Date(
              new Date(
                props.formHeader.IV_Date.toString().substring(0, 10)
              ).toDateString()
            ),
            7
          ),
      };

      //insert dc_register table
      postRequest(endpoints.insertDCRegister, DCRegister, async (data) => {});

      //get the last insert id of dc details
      getRequest(endpoints.getLastInsertIDDCDetails, (data) => {
        let dc_id = data.DC_ID + 1;

        for (let i = 0; i < props.outData.length; i++) {
          let dcdetails = {
            DC_ID: dc_id,
            DC_Srl: i + 1,
            Cust_Code: props.outData[i].Cust_Code,
            cust_docu_No: props.formHeader.IV_No,
            Item_Descrption:
              props.type === "parts"
                ? props.outData[i].PartId
                : props.outData[i].MtrlDescription,
            Material:
              props.type === "parts"
                ? props.outData[i].Remarks
                : props.outData[i].Material,
            Qty:
              props.type === "parts"
                ? props.outData[i].QtyReturned
                : props.outData[i].Qty,
            Unit_Wt: props.type === "parts" ? props.outData[i].UnitWt : 0,
            DC_Srl_Wt: props.outData[i].TotalWeight,
            Excise_CL_no: null,
            DespStatus: "Closed",
          };

          //insert dcdetails
          postRequest(endpoints.insertDCDetails, dcdetails, async (data) => {});

          let dcupdatedetails = {
            Iv_Id: props.formHeader.Iv_Id,
            PkngDcNo: no,
            Dc_ID: dc_id,
          };

          //update material issue register
          postRequest(
            endpoints.updateStatusDCNoDCID,
            dcupdatedetails,
            async (data) => {}
          );

          props.getDCID(dc_id);

          //update the running no
          const inputData = {
            runningNoData: props.runningNoData,

            newRunningNo: newNo,
          };
          postRequest(endpoints.getAndUpdateRunningNo, inputData, (data) => {});
        }
      });
    });

    let todayDateSplited = formatDate(new Date(), 2).split("-");
    let sortedTodayDate = `${todayDateSplited[2]}/${todayDateSplited[1]}/${todayDateSplited[0]}`;

    props.formHeader.IVStatus = "Returned";
    props.formHeader.PkngDCDate = sortedTodayDate;
    props.createDcResponse(props.formHeader);

    toast.dismiss(toastId.createDC);
    toast.success("DC Created Successfully");
  };

  const handleNo = () => props.setShowCreateDC(false);
  const handleYes = (e) => {
    handleSave(e);

    props.setShowCreateDC(false);
  };

  return (
    <>
      <Modal show={props.showCreateDC} onHide={handleNo}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>Create DC</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "12px" }}>
          You cannot cancel this DC once created, be very sure before you
          proceed.
          <br />
          Do you want to create DC?
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-style"
            onClick={handleYes}
            style={{ width: "10%", fontSize: "12px" }}
          >
            Yes
          </button>
          <button
            className="button-style"
            onClick={handleNo}
            style={{ width: "10%", fontSize: "12px" }}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateDCYesNoModal;

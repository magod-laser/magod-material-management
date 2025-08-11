import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { formatDate } from "../../../utils";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { getRequest, postRequest } = require("../../api/apiinstance");
const { endpoints } = require("../../api/constants");

function CreateDCSaveClearCancelModal(props) {
  const { show, setShow, handleShow } = props;
  const [pnno, setpnno] = useState("");
  const handleClose = () => setShow(false);

  const handleClear = () => {
    setpnno("");
  };

  const handleSave = () => {
    //get running no
    let yyyy = formatDate(new Date(), 6).toString();
    const url = endpoints.getRunningNo + "?SrlType=Outward_DCNo&Period=" + yyyy;
    getRequest(url, (data) => {
      data.map((obj) => {
        let newNo = parseInt(obj.Running_No) + 1;
        let series = "";
        for (
          let i = 0;
          i < parseInt(obj.Length) - newNo.toString().length;
          i++
        ) {
          series = series + "0";
        }
        series = series + "" + newNo;
        let yy = formatDate(new Date(), 6).toString().substring(2);
        let no = yy + "/" + series;
        if (newNo == pnno) {
          let url1 =
            endpoints.getCustomerByCustCode +
            "?code=" +
            props.formHeader.Cust_code;
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
                  new Date(
                    props.formHeader.IV_Date.toString().substring(0, 10)
                  ),
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
            postRequest(
              endpoints.insertDCRegister,
              DCRegister,
              async (data) => {}
            );

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
                postRequest(
                  endpoints.insertDCDetails,
                  dcdetails,
                  async (data) => {}
                );

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
                //send dc id to main page
                props.getDCID(dc_id);

                //update the running no
                const inputData = {
                  SrlType: "Outward_DCNo",
                  Period: formatDate(new Date(), 6),
                  RunningNo: newNo,
                };
                postRequest(endpoints.updateRunningNo, inputData, (data) => {});
              }
            });
          });

          toast.success("DC Created Successfully");
          setpnno("");
          setShow(false);
        } else {
          toast.warning(
            <div>
              As per records the DC No should be : {newNo}
              <br />
              <br />
              Please change the Number
            </div>
          );
        }
      });
    });
  };

  let inputEvent = (e) => {
    setpnno(e.target.value);
  };
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            DC Number Updater
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <b>Enter DC No</b>
              <br />
              <b>{props.formHeader.Customer}</b>
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>PN No</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter PN No"
                autoFocus
                name="pnno"
                value={pnno}
                onChange={inputEvent}
              />
            </Form.Group>
          </Form>
          <div className="justify-content-center">
            <button
              className="button-style"
              onClick={handleSave}
              style={{ width: "145px" }}
            >
              Save
            </button>
            <button
              className="button-style"
              onClick={handleClear}
              style={{ width: "145px" }}
            >
              Clear
            </button>
            <button
              className="button-style"
              onClick={handleClose}
              style={{ width: "146px" }}
            >
              Cancel
            </button>
          </div>
        </Modal.Body>

        {/* <Modal.Footer>
          
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default CreateDCSaveClearCancelModal;

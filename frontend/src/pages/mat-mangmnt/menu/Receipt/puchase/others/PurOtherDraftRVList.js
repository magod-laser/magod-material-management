import { useState, useEffect } from "react";
import { formatDate } from "../../../../../../utils";
import BootstrapTable from "react-bootstrap-table-next";
import { useNavigate } from "react-router-dom";
const { getRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

export default function PurOtherDraftRVList(props) {
  const nav = useNavigate();

  const [formHeader, setFormHeader] = useState({
    rvId: "",
    receiptDate: "",
    rvNo: "Draft",
    rvDate: "",
    status: "Created",
    customer: props.type2 === "purchase" ? "0000" : "",
    customerName: "",
    reference: "",
    weight: "0",
    calcWeight: "0",
    type: props.type === "sheets" ? "Sheets" : "Units",
    address: "",
  });
  let [custdata, setCustdata] = useState([]);
  let [mtrlDetails, setMtrlDetails] = useState([]);
  let [locationData, setLocationData] = useState([]);

  const [tabledata, setTableData] = useState([]);
  const [data, setData] = useState({
    CustDocuNo: "",
    Cust_Code: "",
    Customer: "",
    RVStatus: "",
    RV_Date: "",
    RV_No: "",
    ReceiptDate: "",
    RvID: "",
    TotalWeight: "",
    TotalCalculatedWeight: "",
  });

  const fetchData = () => {
    getRequest(endpoints.getSheetsCreatedPurchaseMaterial, (data) => {
      setTableData(data);
    });
  };

  async function fetchData2() {
    getRequest(endpoints.getCustomers, (data) => {
      if (props.type2 === "purchase") {
        data = data.filter((obj) => obj.Cust_Code == 0);
      }
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }
      setCustdata(data);
    });
    getRequest(endpoints.getMaterialLocationList, (data) => {
      setLocationData(data);
    });
    getRequest(endpoints.getMtrlData, (data) => {
      setMtrlDetails(data);
    });
  }

  let changeCustomer = async (e) => {
    const found = custdata.find((obj) => obj.Cust_Code === e[0].Cust_Code);
    setFormHeader((preValue) => {
      return {
        ...preValue,
        customerName: found.Cust_name,
        customer: found.Cust_Code,
        address: found.Address,
      };
    });
  };

  useEffect(() => {
    fetchData();
    fetchData2();
  }, []);

  function statusFormatter(cell) {
    return formatDate(new Date(cell), 3);
  }

  const openButtonClick = () => {
    nav("/MaterialManagement/Receipt/OpenButtonDraftSheetUnit", {
      state: { id: data.RvID, type: "sheets" },
    });
  };

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",
    onSelect: (row, isSelect, rowIndex, e) => {
      setData({
        CustDocuNo: row.CustDocuNo,
        Cust_Code: row.Cust_Code,
        Customer: row.Customer,
        RVStatus: row.RVStatus,
        RV_Date: formatDate(new Date(row.RV_Date), 3),
        RV_No: row.RV_No,
        ReceiptDate: formatDate(new Date(row.ReceiptDate), 3),
        RvID: row.RvID,
        TotalWeight: row.TotalWeight,
        TotalCalculatedWeight: row.TotalCalculatedWeight,
      });
    },
  };

  const columns = [
    {
      text: "RV No",
      dataField: "RV_No",
      sort: true,
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "RV Date",
      dataField: "RV_Date",
      sort: true,
      formatter: statusFormatter,
    },
    {
      text: "Customer",
      dataField: "Customer",
      sort: true,
    },
    {
      text: "Cust Doc No",
      sort: true,
      dataField: "CustDocuNo",
    },
  ];
  return (
    <div>
      <>
        <h4 className="title">Magod : Sheets Receipt List Created</h4>

        <div className="row">
          <div className="d-flex col-md-7">
            <div className="col-md-2">
              <label className="form-label">Customer</label>
            </div>
            <div className="col-md-6">
              <select className="ip-select" name="customer" disabled={true}>
                <option value={data.customer} disabled selected>
                  {data.Customer}
                </option>
              </select>
            </div>
          </div>
          <div className="col-md-5 mb-2 text-center">
            <button
              className="button-style "
              style={{ width: "55px" }}
              onClick={openButtonClick}
            >
              Open
            </button>
            <button
              className="button-style "
              id="btnclose"
              type="submit"
              onClick={() => nav("/MaterialManagement")}
            >
              Close
            </button>
          </div>

          <div
            style={{ height: "350px", overflowY: "scroll" }}
            className="col-md-7 col-sm-12"
          >
            <BootstrapTable
              keyField="RvID"
              columns={columns}
              data={tabledata}
              striped
              hover
              condensed
              selectRow={selectRow}
              headerClasses="header-class tableHeaderBGColor"
            ></BootstrapTable>
          </div>

          <div className="col-md-5 col-sm-12">
            <div className="ip-box form-bg" style={{ height: "350px" }}>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Receipt Date</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.ReceiptDate}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">RV No</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.RV_No}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">RV Date</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.RV_Date}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Cust Code</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.Cust_Code}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Customer</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.Customer}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Cust Docu No</label>
                </div>

                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.CustDocuNo}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Total Weight</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.TotalWeight}
                    readOnly
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mt-1">
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Calculated Weight
                  </label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.TotalCalculatedWeight}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">RV Status</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.RVStatus}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

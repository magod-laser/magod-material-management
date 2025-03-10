import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import BootstrapTable from "react-bootstrap-table-next";
import UpdateStockModal from "./UpdateStockModal";
import { useNavigate } from "react-router-dom";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function StockDispatch() {
  const nav = useNavigate();
  const [firstTable, setFirstTable] = useState([]);
  const [secondTable, setSecondTable] = useState([]);
  const [secondTableAll, setSecondTableAll] = useState([]);
  const [thirdTable, setThirdTable] = useState([]);

  const [dateVal, setDateVal] = useState("1988-01-01");

  const [open, setOpen] = useState();
  const handleOpen = () => {
    setOpen(true);
  };

  const InputEvent = (e) => {
    const { name, value } = e.target;
    console.log("value = ", value);
    setDateVal(value);
  };

  const columns1 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Invoice No",
      dataField: "Inv_No",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "PN No",
      dataField: "DC_No",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Customer",
      dataField: "Cust_Name",
      sort: true,
    },
    {
      text: "Inv Type",
      dataField: "DC_InvType",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Material",
      dataField: "Material",
      sort: true,
    },
    {
      text: "Total Weight",
      dataField: "DC_Srl_Wt",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
  ];

  const columns2 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Srl",
      dataField: "DC_Inv_Srl",
      sort: true,
    },
    {
      text: "Material",
      dataField: "Material",
      sort: true,
    },
    {
      text: "Qty",
      dataField: "Qty",
      sort: true,
    },
    {
      text: "Unit Weight",
      dataField: "Unit_Wt",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Srl Weight",
      dataField: "DC_Srl_Wt",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
  ];

  const columns3 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Inv Type",
      dataField: "DC_InvType",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Invoice No",
      dataField: "Inv_No",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Customer",
      dataField: "Cust_Name",
      sort: true,
    },
    {
      text: "Total Weight",
      dataField: "WeightOut",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
  ];
  const loadData = () => {
    //first table
    const url1 = endpoints.getStockDispatchFirstTable + "?date=" + dateVal;
    getRequest(url1, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setFirstTable(data);
      console.log("first table = ", data);
    });

    //second table
    const url2 = endpoints.getStockDispatchSecondTable + "?date=" + dateVal;
    getRequest(url2, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setSecondTableAll(data);
      console.log("second table = ", data);
    });

    //third table
    const url3 = endpoints.getStockDispatchThirdTable + "?date=" + dateVal;
    getRequest(url3, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setThirdTable(data);
      console.log("third table = ", data);
    });
  };

  const selectRow1 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        //console.log("row = ", row);
        setSecondTable(
          secondTableAll.filter((obj) => {
            return obj.DC_Inv_No === row.DC_Inv_No;
          })
        );
      }
    },
  };

  const updateLedger = async () => {
    let flag = 0;
    for (let i = 0; i < firstTable.length; i++) {
      if (firstTable[i].DC_Srl_Wt <= 0) {
        flag = 1;
      }
    }
    if (flag == 1) {
      toast.error("Update Receipt Weight before updating stock ledger");
    } else {
      let flag1 = 0;
      for (let i = 0; i < firstTable.length; i++) {
        //insertStockArrivalMtrlReceiptList
        let paraData1 = {
          InvDate: dateVal,
          Inv_No: firstTable[i].Inv_No,
          Cust_Name: firstTable[i].Cust_Name,
          Material: firstTable[i].Material,
          DC_InvType: firstTable[i].DC_InvType,
          Dc_no: firstTable[i].DC_No,
          WeightOut: firstTable[i].DC_Srl_Wt,
        };
        postRequest(
          endpoints.insertStockDispatchMtrlSales,
          paraData1,
          async (data) => {
            console.log("updated");
            flag1 = 1;
          }
        );
      }

      //if (flag1 == 1) {
      toast.success("Stock Ledger is Updated");
      loadData();
      //}
    }
  };

  const [sort1, setSort1] = React.useState({
    dataField: "id",
    order: "asc",
  });

  const [sort2, setSort2] = React.useState({
    dataField: "id",
    order: "asc",
  });

  const [sort3, setSort3] = React.useState({
    dataField: "id",
    order: "asc",
  });

  const onSortChange1 = (dataField, order) => {
    setSort1({ dataField, order });
  };

  const onSortChange2 = (dataField, order) => {
    setSort2({ dataField, order });
  };

  const onSortChange3 = (dataField, order) => {
    setSort3({ dataField, order });
  };

  return (
    <div>
      <UpdateStockModal open={open} setOpen={setOpen} />
      <h4 className="title">Stock Dispatch Updated Form </h4>
      <div className="row">
        <div className="d-flex col-md-3">
          <div className="col-md-3">
            <label className="form-label">Stock Date</label>
          </div>
          <div className="col-md-6">
            <input
              className="input-field"
              type="date"
              name="date"
              onChange={InputEvent}
            />
          </div>
        </div>
        <div className="col-md-1">
          <button
            className="button-style"
            style={{ width: "70px" }}
            onClick={loadData}
          >
            Load Data
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="button-style"
            style={{ width: "140px" }}
            onClick={updateLedger}
          >
            Update Stock Ledger
          </button>
        </div>
        <div className="col-md-2">
          <button
            className="button-style "
            id="btnclose"
            type="submit"
            onClick={() => nav("/MaterialManagement")}
          >
            Close
          </button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-7">
          <div className="row">
            <div style={{ height: "200px", overflowY: "scroll" }}>
              <BootstrapTable
                keyField="id"
                columns={columns1}
                data={firstTable}
                striped
                hover
                condensed
                selectRow={selectRow1}
                headerClasses="header-class tableHeaderBGColor"
                sort={sort1}
                onSortChange={onSortChange1}
              ></BootstrapTable>
            </div>
          </div>
          <div className="row mt-3">
            <div style={{ height: "200px", overflowY: "scroll" }}>
              <BootstrapTable
                keyField="id"
                columns={columns2}
                data={secondTable}
                striped
                hover
                condensed
                //selectRow={selectRow1}
                headerClasses="header-class tableHeaderBGColor"
                sort={sort2}
                onSortChange={onSortChange2}
              ></BootstrapTable>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div style={{ height: "400px", overflowY: "scroll" }}>
            <BootstrapTable
              keyField="id"
              columns={columns3}
              data={thirdTable}
              striped
              hover
              condensed
              //selectRow={selectRow1}
              headerClasses="header-class tableHeaderBGColor"
              sort={sort3}
              onSortChange={onSortChange3}
            ></BootstrapTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockDispatch;

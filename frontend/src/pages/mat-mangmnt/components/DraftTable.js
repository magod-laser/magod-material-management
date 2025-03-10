import React from "react";

function DraftTable() {
  const products = [];
  const columns = [
    {
      text: "RV No",
      dataField: "RV_No",
    },
    {
      text: "RV Date",
      dataField: "RV_Date",
      // sort:true
    },
    {
      text: "Customer",
      dataField: "Customer",
    },
    {
      text: "Cust Doc No",
      dataField: "CustDocuNo",
    },
  ];

  return <div>DraftTable</div>;
}

export default DraftTable;

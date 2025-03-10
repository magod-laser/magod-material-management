import React, { useState, useEffect } from "react";
import "../../../MatMenu.css";
import { useDispatch, useSelector } from "react-redux";
// import { getMaterialReceiptByType } from "../../../../actions/materialReceiptAction";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { dateToShort } from "../../../../../../utils";

function DraftRVList() {
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

  return (
    <div>
      <h4 className="form-title">Customer : Parts Receipt List Created</h4>
      <hr className="horizontal-line" />

      <div className="col-md-6 col-sm-12">
        <BootstrapTable
          keyField="RvID"
          // columns={columns}
          // data={list}
          striped
          hover
          condensed
          pagination={paginationFactory()}
          // selectRow={selectRow}
        ></BootstrapTable>
      </div>
    </div>
  );
}

export default DraftRVList;

// export default function DraftRVList() {
//   const dispatch = useDispatch();
//   const materialReceipt = useSelector((state) => state.materialReceipt);
//   const { loading, error, list } = materialReceipt;
//   const [data, setData] = useState({
//     CustDocuNo: "",
//     Cust_Code: "",
//     Customer: "",
//     RVStatus: "",
//     RV_Date: "",
//     RV_No: "",
//     ReceiptDate: "",
//     RvID: "",
//     TotalWeight: "",
//     TotalCalculatedWeight: "",
//   });

//   useEffect(() => {
//     // dispatch(getMaterialReceiptByType("Created", "Parts"));
//   }, [dispatch]);

//   const openButtonClick = () => {
//     //console.log("data = ", data);
//     console.log("button click : ");
//   };

//   const columns = [
//     {
//       text: "RV No",
//       dataField: "RV_No",
//     },
//     {
//       text: "RV Date",
//       dataField: "RV_Date",
//       sort: true,
//       formatter: statusFormatter,
//     },
//     {
//       text: "Customer",
//       dataField: "Customer",
//     },
//     {
//       text: "Cust Doc No",
//       dataField: "CustDocuNo",
//     },
//   ];
//   // Process the returned date in the formatter
//   function statusFormatter(cell, row, rowIndex, formatExtraData) {
//     return dateToShort(cell);
//   }
//   const selectRow = {
//     mode: "radio",
//     clickToSelect: true,
//     bgColor: "#8A92F0",
//     onSelect: (row, isSelect, rowIndex, e) => {
//       setData({
//         CustDocuNo: row.CustDocuNo,
//         Cust_Code: row.Cust_Code,
//         Customer: row.Customer,
//         RVStatus: row.RVStatus,
//         RV_Date: dateToShort(row.RV_Date),
//         RV_No: row.RV_No,
//         ReceiptDate: dateToShort(row.ReceiptDate),
//         RvID: row.RvID,
//         TotalWeight: row.TotalWeight,
//         TotalCalculatedWeight: row.TotalCalculatedWeight,
//       });
//     },
//   };

//   return (
//     <>
//       <h4 className="form-title">Customer : Parts Receipt List Created</h4>
//       <hr className="horizontal-line" />
//       <div className="row">
//         <div className="col-md-6 col-sm-12">
//           <BootstrapTable
//             keyField="RvID"
//             columns={columns}
//             data={list}
//             striped
//             hover
//             condensed
//             pagination={paginationFactory()}
//             selectRow={selectRow}
//           ></BootstrapTable>
//         </div>

//         <div className="col-md-6 col-sm-12">
//           <div className="ip-box form-bg">
//             <div className="row">
//               <div className="col-md-12 col-sm-12">
//                 <div className="ip-box form-bg">
//                   <div className="row">
//                     <div className="row">
//                       <div className="col-md-3 ">
//                         <label className="">Receipt Date</label>
//                       </div>
//                       <div className="col-md-8 ">
//                         <input
//                           className="in-field"
//                           value={data.ReceiptDate}
//                           readOnly
//                         />
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-md-3 ">
//                         <label className="">RV No</label>
//                       </div>
//                       <div className="col-md-8 ">
//                         <input
//                           className="in-field"
//                           value={data.RV_No}
//                           readOnly
//                         />
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-md-3">
//                         <label className="">RV Date</label>
//                       </div>
//                       <div className="col-md-8 ">
//                         <input
//                           className="in-field"
//                           value={data.RV_Date}
//                           readOnly
//                         />
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-md-3 ">
//                         <label className="">Cust code</label>
//                       </div>
//                       <div className="col-md-8 ">
//                         <input
//                           className="in-field"
//                           value={data.Cust_Code}
//                           readOnly
//                         />
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-md-3 ">
//                         <label className="">Customer</label>
//                       </div>
//                       <div className="col-md-8 ">
//                         <input
//                           className="in-field"
//                           value={data.Customer}
//                           readOnly
//                         />
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-md-3">
//                         <label className="">Cust Docu No</label>
//                       </div>

//                       <div className="col-md-8 ">
//                         <input
//                           className="in-field"
//                           value={data.CustDocuNo}
//                           readOnly
//                         />
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-md-3 ">
//                         <label className="">Total Weight</label>
//                       </div>
//                       <div className="col-md-8 ">
//                         <input
//                           className="in-field"
//                           value={data.TotalWeight}
//                           readOnly
//                         />
//                       </div>
//                     </div>

//                     <div className="row">
//                       <div className="col-md-3">
//                         <label className="">Calculatd weight</label>
//                       </div>
//                       <div className="col-md-8 ">
//                         <input
//                           className="in-field"
//                           value={data.TotalCalculatedWeight}
//                           readOnly
//                         />
//                       </div>
//                     </div>
//                     <div className="row">
//                       <div className="col-md-3 ">
//                         <label className="">RV status</label>
//                       </div>
//                       <div className="col-md-8 ">
//                         <input
//                           className="in-field"
//                           value={data.RVStatus}
//                           readOnly
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="row justify-content-center mt-4">
//               <button
//                 className="button-style "
//                 style={{ width: "120px" }}
//                 //data.RvID
//                 onClick={openButtonClick}
//               >
//                 Open
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

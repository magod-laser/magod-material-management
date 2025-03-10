import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import ChangeLocationModal from "./ChangeLocationModal";
import MaterialMoverForm from "./MaterialMoverForm";

function ChangeLocation() {
  return (
    <div>
      <MaterialMoverForm type="location" />
    </div>
  );
}

// function ChangeLocation(props) {
//   const [open, setOpen] = useState();
//   const PopupOpen = () => {
//     // alert("open yaaa");
//     setOpen(true);
//   };
//   return (
//     <div>
//       <ChangeLocationModal open={open} setOpen={setOpen} />
//       <h4 className="form-title"> Material Mover</h4>
//       <hr className="horizontal-line" />

//       <div className="row">
//         <div className="row ">
//           <div className="col-md-3"></div>
//           <div className="col-md-3"></div>

//           <div className="col-md-6 ">
//             <div
//               className="row justify-content-center"
//               style={{ border: "1px solid gray" }}
//             >
//               {" "}
//               <div className="row ">
//                 <div className="col-md-4">
//                   <button className="button-style">Load Data</button>
//                 </div>
//                 <div className="col-md-4">
//                   <button className="button-style">Save</button>
//                 </div>
//                 <div className="col-md-4">
//                   <button className="button-style" onClick={PopupOpen}>
//                     Change Location
//                   </button>
//                 </div>
//               </div>
//               <div className="row ">
//                 <div className="col-md-6" style={{ marginBottom: "20px" }}>
//                   <label>From Location</label>
//                   <input type="text" />
//                 </div>
//                 <div className="col-md-6" style={{ marginBottom: "20px" }}>
//                   <label className="form-label">To Location</label>
//                   <select
//                     className="ip-select"
//                     name="customer"
//                     //onChange={changeCustomer}
//                     // disabled={boolVal1}
//                   >
//                     {/* {custdata.map((customer, index) =>
//                   customer.Cust_Code == 0 ? ( */}
//                     <option>
//                       {/* key={index} value={customer.Cust_Code} */}
//                       {/* {customer.Cust_name} */}
//                     </option>
//                     {/* ) : (
//                     ""
//                   )
//                 )} */}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="row mt-3">
//         <div className="col-md-6">
//           {" "}
//           <div style={{ height: "400px", overflowY: "scroll" }}>
//             <Table bordered>
//               <thead
//                 style={{
//                   textAlign: "center",
//                   position: "sticky",
//                   top: "-1px",
//                 }}
//               >
//                 <tr>
//                   <th>Select</th>
//                   <th>Mtrl Stock ID</th>
//                   <th>Mtrl Code</th>
//                   <th>Para1</th>
//                   <th>Para2</th>
//                   <th>Locked</th>
//                   <th>Scrap</th>
//                   <th>Scrap Weight</th>
//                   <th>Location No</th>
//                 </tr>
//               </thead>

//               <tbody className="tablebody">
//                 <tr
//                 // onClick={() => selectedRowFn(item, key)}
//                 // className={
//                 //   key === selectedRow?.index ? "selcted-row-clr" : ""
//                 // }
//                 >
//                   <td>
//                     <input type="checkbox" />
//                   </td>
//                   <td>asdfghj</td>
//                   <td>asdfghj</td>
//                   <td>asdfghj</td>
//                   <td>asdfghj</td>
//                   <td>
//                     {" "}
//                     <input type="checkbox" />
//                   </td>
//                   <td>
//                     {" "}
//                     <input type="checkbox" />
//                   </td>
//                   <td>asdfghj</td>
//                   <td>asdfghj</td>
//                 </tr>
//               </tbody>
//             </Table>
//           </div>
//         </div>
//         <div className="col-md-6">
//           {" "}
//           <div style={{ height: "400px", overflowY: "scroll" }}>
//             <Table bordered>
//               <thead
//                 style={{
//                   textAlign: "center",
//                   position: "sticky",
//                   top: "-1px",
//                 }}
//               >
//                 <tr>
//                   <th>Mtrl Stock ID</th>
//                   <th>Para1</th>
//                   <th>Para2</th>
//                   <th>Locked</th>
//                   <th>Scrap</th>
//                   <th>Weight</th>
//                   <th>Scrap Weight</th>
//                   <th>Location</th>
//                 </tr>
//               </thead>

//               <tbody className="tablebody">
//                 <tr
//                 // onClick={() => selectedRowFn(item, key)}
//                 // className={
//                 //   key === selectedRow?.index ? "selcted-row-clr" : ""
//                 // }
//                 >
//                   <td>asdfghj</td>
//                   <td>asdfghj</td>
//                   <td>asdfghj</td>
//                   <td>
//                     {" "}
//                     <input type="checkbox" />
//                   </td>
//                   <td>
//                     {" "}
//                     <input type="checkbox" />
//                   </td>
//                   <td>asdfghj</td>
//                   <td>asdfghj</td>
//                   <td>asdfghj</td>
//                 </tr>
//               </tbody>
//             </Table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default ChangeLocation;

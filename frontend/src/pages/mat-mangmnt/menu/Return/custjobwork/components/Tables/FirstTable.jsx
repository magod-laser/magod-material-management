import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";

import { FaArrowUp } from "react-icons/fa";

export default function FirstTable(props) {
  // remove materials from third table for particular document.... func
  // const removeMtrlThirdTable = (rowData, k) => {
  //   let found = false;
  //   const newArray = props.allData.filter(
  //     (obj) =>
  //       obj.Mtrl_Rv_id === rowData.Mtrl_Rv_id &&
  //       obj.Mtrl_Code === rowData.Mtrl_Code &&
  //       obj.DynamicPara1 === rowData.DynamicPara1 &&
  //       obj.DynamicPara2 === rowData.DynamicPara2 &&
  //       obj.Scrap === rowData.Scrap
  //     // {
  //     //   return (
  //     //     obj.RV_No === rowData.RV_No &&
  //     //     obj.Mtrl_Code === rowData.Mtrl_Code &&
  //     //     obj.DynamicPara1 === rowData.DynamicPara1 &&
  //     //     obj.DynamicPara2 === rowData.DynamicPara2
  //     //   );
  //     // }
  //   );

  //   for (let i = 0; i < newArray.length; i++) {
  //     const element = newArray[i];
  //     found = props.thirdTableData.some(
  //       (el) => el.Cust_Docu_No === element.Cust_Docu_No
  //     );

  //     if (found) {
  //       const newThirdTableData = props.thirdTableData.filter(
  //         (data) => data.Cust_Docu_No !== element.Cust_Docu_No
  //       );
  //       props.setThirdTableData(newThirdTableData);
  //     } else {
  //     }
  //   }
  // };

  // console.log("third table", props.thirdTableData);
  // function removeMtrlFromThirdTable(rowData) {
  //   let newArray = props.allData.filter(
  //     (obj) => (obj) =>
  //       obj.Mtrl_Rv_id === rowData.Mtrl_Rv_id &&
  //       obj.Mtrl_Code === rowData.Mtrl_Code &&
  //       obj.DynamicPara1 === rowData.DynamicPara1 &&
  //       obj.DynamicPara2 === rowData.DynamicPara2 &&
  //       obj.Scrap === rowData.Scrap
  //   );

  //   console.log("newArray", newArray);

  //   // console.log("rowdata", rowData);
  //   // console.log("third table", props.thirdTableData);
  //   // console.log("rowdata", rowData);

  //   // console.log("Mtrl_Rv_id", rowData.Mtrl_Rv_id);
  //   // console.log("Mtrl_Code", rowData.Mtrl_Code);
  //   // console.log("DynamicPara1", rowData.DynamicPara1);
  //   // console.log("DynamicPara2", rowData.DynamicPara2);
  //   // console.log("Scrap", rowData.Scrap);

  //   // console.log(
  //   //   "fitler",
  //   //   props.thirdTableData.filter((obj) => obj.Mtrl_Rv_id != rowData.Mtrl_Rv_id)
  //   // );

  //   // const newArray = props.thirdTableData.filter(
  //   //   (obj) =>
  //   //     obj.RV_No != rowData.RV_No &&
  //   //     obj.Cust_Docu_No != rowData.Cust_Docu_No &&
  //   //     obj.Mtrl_Rv_id != rowData.Mtrl_Rv_id &&
  //   //     obj.Mtrl_Code != rowData.Mtrl_Code &&
  //   //     obj.DynamicPara1 != rowData.DynamicPara1 &&
  //   //     obj.DynamicPara2 != rowData.DynamicPara2 &&
  //   //     obj.DynamicPara3 != rowData.DynamicPara3 &&
  //   //     obj.ScrapWeight != rowData.ScrapWeight &&
  //   //     obj.Weight != rowData.Weight &&
  //   //     obj.InStock != rowData.InStock &&
  //   //     obj.Scrap != rowData.Scrap
  //   // );

  //   // console.log("removeMtrlFromThirdTable newArray", newArray);

  //   // for (let i = 0; i < newArray.length; i++) {
  //   //   const element = newArray[i];
  //   //   console.log("remove", props.thirdTableData.pop(element));
  //   // }

  //   // props.setThirdTableData(newArray);
  // }

  // console.log("props.thirdTableData", props.thirdTableData);
  function removeMtrlThirdTable(rowData) {
    const newArray = props.thirdTableData.filter(
      (obj) =>
        obj.Mtrl_Rv_id != rowData.Mtrl_Rv_id ||
        obj.Mtrl_Code != rowData.Mtrl_Code ||
        obj.DynamicPara1 != rowData.DynamicPara1 ||
        obj.DynamicPara2 != rowData.DynamicPara2 ||
        obj.Scrap != rowData.Scrap
    );

    return newArray;
    // console.log("newArray", newArray);
    // props.setThirdTableData(newArray);
  }

  const firstTableCheckBoxClickFunc = (rowData, k) => {
    // let newThirdTableData = props.thirdTableData;

    // const newArray = props.allData.filter(
    //   (obj) =>
    //     obj.Mtrl_Rv_id === rowData.Mtrl_Rv_id &&
    //     obj.Mtrl_Code === rowData.Mtrl_Code &&
    //     obj.DynamicPara1 === rowData.DynamicPara1 &&
    //     obj.DynamicPara2 === rowData.DynamicPara2 &&
    //     obj.Scrap === rowData.Scrap
    // );

    // console.log("fiterrere", newArray);

    // for (let i = 0; i < newArray.length; i++) {
    //   const element0 = newArray[i];

    //   for (let j = 0; j < props.thirdTableData.length; j++) {
    //     const element1 = props.thirdTableData[j];

    //     if (element0.MtrlStockID === element1.MtrlStockID) {
    //       console.log("stock id", i + j, element0.MtrlStockID);

    //       // newThirdTableData[j];

    //       newThirdTableData = newThirdTableData.filter(
    //         (obj) => obj.MtrlStockID === element0.MtrlStockID
    //       );

    //       console.log("newThirdTableData", newThirdTableData);
    //       // console.log("data", props.thirdTableData[j]);
    //       // props.thirdTableData
    //       // props.setThirdTableData(props.thirdTableData);
    //     }
    //   }
    // }

    // console.log("after filter", props.thirdTableData);

    // // console.log("rowData", rowData);
    // // console.log("remove");
    // // console.log("add");

    // // removeMtrlFromThirdTable(rowData);

    let respArr = removeMtrlThirdTable(rowData);
    // console.log("respArr", respArr);
    let issueChecked = document.getElementById(`checkBoxFirstTable${k}`);
    // console.log("checked...", issueChecked.checked);

    if (issueChecked.checked) {
      const newArray = props.allData.filter(
        (obj) =>
          obj.Mtrl_Rv_id === rowData.Mtrl_Rv_id &&
          obj.Mtrl_Code === rowData.Mtrl_Code &&
          obj.DynamicPara1 === rowData.DynamicPara1 &&
          obj.DynamicPara2 === rowData.DynamicPara2 &&
          obj.Scrap === rowData.Scrap
      );

      // console.log("sdsdfdf", respArr);
      for (let i = 0; i < newArray.length; i++) {
        const element = newArray[i];
        respArr.push(element);
      }

      // console.log("respArr", respArr);
      props.setThirdTableData(respArr);
    } else {
      const newArray = props.thirdTableData.filter(
        (obj) =>
          obj.Mtrl_Rv_id != rowData.Mtrl_Rv_id ||
          obj.Mtrl_Code != rowData.Mtrl_Code ||
          obj.DynamicPara1 != rowData.DynamicPara1 ||
          obj.DynamicPara2 != rowData.DynamicPara2 ||
          obj.Scrap != rowData.Scrap
      );

      props.setThirdTableData(newArray);
    }
    // else {
    //   const newArray = props.thirdTableData.filter(
    //     (obj) =>
    //       obj.Mtrl_Rv_id != rowData.Mtrl_Rv_id &&
    //       obj.Mtrl_Code != rowData.Mtrl_Code &&
    //       obj.DynamicPara1 != rowData.DynamicPara1 &&
    //       obj.DynamicPara2 != rowData.DynamicPara2 &&
    //       obj.Scrap != rowData.Scrap
    //   );
    //   props.setThirdTableData(newArray);
    // }
    // if (issueChecked.checked) {
    //   removeMtrlThirdTable(rowData, k);
    //   const newArray = props.allData.filter(
    //     (obj) =>
    //       obj.Mtrl_Rv_id === rowData.Mtrl_Rv_id &&
    //       obj.Mtrl_Code === rowData.Mtrl_Code &&
    //       obj.DynamicPara1 === rowData.DynamicPara1 &&
    //       obj.DynamicPara2 === rowData.DynamicPara2 &&
    //       obj.Scrap === rowData.Scrap
    //     // {
    //     //   return (
    //     //     obj.Mtrl_Rv_id === rowData.Mtrl_Rv_id &&
    //     //     obj.RV_No === rowData.RV_No &&
    //     //     obj.Mtrl_Code === rowData.Mtrl_Code &&
    //     //     obj.DynamicPara1 === rowData.DynamicPara1 &&
    //     //     obj.DynamicPara2 === rowData.DynamicPara2
    //     //   );
    //     // }
    //   );
    //   props.setThirdTableData(props.thirdTableData.concat(newArray));
    // } else {
    //   removeMtrlThirdTable(rowData, k);
    // }
  };

  const sortedData = () => {
    let dataCopy = [...props.firstTableData];

    if (props.sortConfigFirst.key) {
      dataCopy.sort((a, b) => {
        if (
          !parseFloat(a[props.sortConfigFirst.key]) ||
          !parseFloat(b[props.sortConfigFirst.key])
        ) {
          // console.log("string");
          if (a[props.sortConfigFirst.key] < b[props.sortConfigFirst.key]) {
            return props.sortConfigFirst.direction === "asc" ? -1 : 1;
          }
          if (a[props.sortConfigFirst.key] > b[props.sortConfigFirst.key]) {
            return props.sortConfigFirst.direction === "asc" ? 1 : -1;
          }
          return 0;
        } else {
          // console.log("number");
          if (
            parseFloat(a[props.sortConfigFirst.key]) <
            parseFloat(b[props.sortConfigFirst.key])
          ) {
            return props.sortConfigFirst.direction === "asc" ? -1 : 1;
          }
          if (
            parseFloat(a[props.sortConfigFirst.key]) >
            parseFloat(b[props.sortConfigFirst.key])
          ) {
            return props.sortConfigFirst.direction === "asc" ? 1 : -1;
          }
          return 0;
        }
      });
    }

    return dataCopy;
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (
      props.sortConfigFirst.key === key &&
      props.sortConfigFirst.direction === "asc"
    ) {
      direction = "desc";
    }
    props.setSortConfigFirst({ key, direction });
  };

  return (
    <>
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th>SL No</th>
            <th onClick={() => requestSort("RV_No")} className="cursor">
              RV No
              <FaArrowUp
                className={
                  props.sortConfigFirst.key === "RV_No"
                    ? props.sortConfigFirst.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("Cust_Docu_No")} className="cursor">
              Cust Document
              <FaArrowUp
                className={
                  props.sortConfigFirst.key === "Cust_Docu_No"
                    ? props.sortConfigFirst.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("Mtrl_Code")} className="cursor">
              Material Code
              <FaArrowUp
                className={
                  props.sortConfigFirst.key === "Mtrl_Code"
                    ? props.sortConfigFirst.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("DynamicPara1")} className="cursor">
              Width
              <FaArrowUp
                className={
                  props.sortConfigFirst.key === "DynamicPara1"
                    ? props.sortConfigFirst.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("DynamicPara2")} className="cursor">
              Length
              <FaArrowUp
                className={
                  props.sortConfigFirst.key === "DynamicPara2"
                    ? props.sortConfigFirst.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("Scrap")} className="cursor">
              Scrap
              <FaArrowUp
                className={
                  props.sortConfigFirst.key === "Scrap"
                    ? props.sortConfigFirst.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("Weight")} className="cursor">
              Weight
              <FaArrowUp
                className={
                  props.sortConfigFirst.key === "Weight"
                    ? props.sortConfigFirst.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("ScrapWeight")} className="cursor">
              Scrap Weight
              <FaArrowUp
                className={
                  props.sortConfigFirst.key === "ScrapWeight"
                    ? props.sortConfigFirst.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("InStock")} className="cursor">
              In Stock
              <FaArrowUp
                className={
                  props.sortConfigFirst.key === "InStock"
                    ? props.sortConfigFirst.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th>Issue</th>
          </tr>
        </thead>
        <tbody>
          {sortedData().map((val, k) => (
            <tr
              onClick={() => props.selectRowFirstFun(val)}
              className={
                val === props.firstTableSelectedRow[0] ? "rowSelectedClass" : ""
              }
              key={k}
            >
              <td>{k + 1}</td>
              <td>{val.RV_No}</td>
              <td>{val.Cust_Docu_No}</td>
              <td>{val.Mtrl_Code}</td>
              <td>{val.DynamicPara1}</td>
              <td>{val.DynamicPara2}</td>
              <td>
                <input
                  type="checkbox"
                  checked={val.Scrap === 0 ? false : true}
                />
              </td>
              <td>{parseFloat(val.Weight).toFixed(3)}</td>
              <td>{parseFloat(val.ScrapWeight).toFixed(3)}</td>
              <td>{val.InStock}</td>
              <td>
                <input
                  type="checkbox"
                  name=""
                  id={`checkBoxFirstTable${k}`}
                  // checked={checkedCheckBox}
                  onClick={() => firstTableCheckBoxClickFunc(val, k)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

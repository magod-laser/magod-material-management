import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

import { FaArrowUp } from "react-icons/fa";

export default function ThirdTable(props) {
  const sortedData = () => {
    let dataCopy = [...props.thirdTableData];

    if (props.sortConfigThird.key) {
      dataCopy.sort((a, b) => {
        if (
          !parseFloat(a[props.sortConfigThird.key]) ||
          !parseFloat(b[props.sortConfigThird.key])
        ) {
          // console.log("string");
          if (a[props.sortConfigThird.key] < b[props.sortConfigThird.key]) {
            return props.sortConfigThird.direction === "asc" ? -1 : 1;
          }
          if (a[props.sortConfigThird.key] > b[props.sortConfigThird.key]) {
            return props.sortConfigThird.direction === "asc" ? 1 : -1;
          }
          return 0;
        } else {
          // console.log("number");
          if (
            parseFloat(a[props.sortConfigThird.key]) <
            parseFloat(b[props.sortConfigThird.key])
          ) {
            return props.sortConfigThird.direction === "asc" ? -1 : 1;
          }
          if (
            parseFloat(a[props.sortConfigThird.key]) >
            parseFloat(b[props.sortConfigThird.key])
          ) {
            return props.sortConfigThird.direction === "asc" ? 1 : -1;
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
      props.sortConfigThird.key === key &&
      props.sortConfigThird.direction === "asc"
    ) {
      direction = "desc";
    }
    props.setSortConfigThird({ key, direction });
  };

  return (
    <>
      <Table striped className="table-data border">
        <thead className="tableHeaderBGColor">
          <tr>
            <th>SL No</th>
            <th onClick={() => requestSort("MtrlStockID")} className="cursor">
              Mtrl Stock ID
              <FaArrowUp
                className={
                  props.sortConfigThird.key === "MtrlStockID"
                    ? props.sortConfigThird.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("Mtrl_Code")} className="cursor">
              Mtrl Code
              <FaArrowUp
                className={
                  props.sortConfigThird.key === "Mtrl_Code"
                    ? props.sortConfigThird.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("DynamicPara1")} className="cursor">
              DynamicPara1
              <FaArrowUp
                className={
                  props.sortConfigThird.key === "DynamicPara1"
                    ? props.sortConfigThird.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("DynamicPara2")} className="cursor">
              DynamicPara2
              <FaArrowUp
                className={
                  props.sortConfigThird.key === "DynamicPara2"
                    ? props.sortConfigThird.direction === "desc"
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
                  props.sortConfigThird.key === "Weight"
                    ? props.sortConfigThird.direction === "desc"
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
                  props.sortConfigThird.key === "ScrapWeight"
                    ? props.sortConfigThird.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData().map((val, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <td>{val.MtrlStockID}</td>
              <td>{val.Mtrl_Code}</td>
              <td>{val.DynamicPara1}</td>
              <td>{val.DynamicPara2}</td>
              <td>{parseFloat(val.Weight || 0).toFixed(3)}</td>
              <td>{parseFloat(val.ScrapWeight || 0).toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

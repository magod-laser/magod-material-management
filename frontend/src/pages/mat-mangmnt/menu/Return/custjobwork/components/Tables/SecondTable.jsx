import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

import { FaArrowUp } from "react-icons/fa";

export default function SecondTable(props) {
  const sortedData = () => {
    let dataCopy = [...props.secondTableData];

    if (props.sortConfigSecond.key) {
      dataCopy.sort((a, b) => {
        if (
          !parseFloat(a[props.sortConfigSecond.key]) ||
          !parseFloat(b[props.sortConfigSecond.key])
        ) {
          // console.log("string");
          if (a[props.sortConfigSecond.key] < b[props.sortConfigSecond.key]) {
            return props.sortConfigSecond.direction === "asc" ? -1 : 1;
          }
          if (a[props.sortConfigSecond.key] > b[props.sortConfigSecond.key]) {
            return props.sortConfigSecond.direction === "asc" ? 1 : -1;
          }
          return 0;
        } else {
          // console.log("number");
          if (
            parseFloat(a[props.sortConfigSecond.key]) <
            parseFloat(b[props.sortConfigSecond.key])
          ) {
            return props.sortConfigSecond.direction === "asc" ? -1 : 1;
          }
          if (
            parseFloat(a[props.sortConfigSecond.key]) >
            parseFloat(b[props.sortConfigSecond.key])
          ) {
            return props.sortConfigSecond.direction === "asc" ? 1 : -1;
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
      props.sortConfigSecond.key === key &&
      props.sortConfigSecond.direction === "asc"
    ) {
      direction = "desc";
    }
    props.setSortConfigSecond({ key, direction });
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
                  props.sortConfigSecond.key === "MtrlStockID"
                    ? props.sortConfigSecond.direction === "desc"
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
                  props.sortConfigSecond.key === "Weight"
                    ? props.sortConfigSecond.direction === "desc"
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
                  props.sortConfigSecond.key === "ScrapWeight"
                    ? props.sortConfigSecond.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("RVId")} className="cursor">
              RV ID
              <FaArrowUp
                className={
                  props.sortConfigSecond.key === "RVId"
                    ? props.sortConfigSecond.direction === "desc"
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
            <tr
              onClick={() => props.selectRowSecondFun(val)}
              className={
                // checking if item exist then classname...rowSelectedClass else ''
                props.thirdTableData.some(
                  (el) => el.MtrlStockID === val.MtrlStockID
                )
                  ? "rowSelectedClass"
                  : ""
              }
              key={key}
            >
              <td>{key + 1}</td>
              <td>{val.MtrlStockID}</td>

              <td>{parseFloat(val.Weight).toFixed(3)}</td>
              <td>{parseFloat(val.ScrapWeight).toFixed(3)}</td>
              <td>{val.RVId}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

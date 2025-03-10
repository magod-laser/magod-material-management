import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";

import { FaArrowUp } from "react-icons/fa";

export default function FirstTable(props) {
  // console.log("props in frist table..", props);

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
      <Table
        hover
        condensed
        className="table-data border header-class table-striped"
      >
        <thead className="tableHeaderBGColor">
          <tr>
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
          </tr>
        </thead>
        <tbody>
          {sortedData().map((val, key) => (
            <tr
              onClick={() => props.selectRowFirstFunc(val)}
              className={
                val.RvID === props.firstTableSelectedRow.RvID
                  ? "rowSelectedClass"
                  : props.thirdTableRVIDs.includes(val.RV_No)
                  ? "rowSelectedLight"
                  : ""
              }
            >
              <td>{val.RV_No}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

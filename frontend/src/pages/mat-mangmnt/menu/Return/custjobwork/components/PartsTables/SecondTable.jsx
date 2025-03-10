import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import { FaArrowUp } from "react-icons/fa";

export default function SecondTable(props) {
  //   console.log("props in second table..", props);

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
      <Table
        hover
        condensed
        className="table-data border header-class table-striped"
      >
        <thead className="tableHeaderBGColor">
          <tr>
            <th>SL No</th>
            <th onClick={() => requestSort("PartId")} className="cursor">
              Part ID
              <FaArrowUp
                className={
                  props.sortConfigSecond.key === "PartId"
                    ? props.sortConfigSecond.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("QtyReceived")} className="cursor">
              Received
              <FaArrowUp
                className={
                  props.sortConfigSecond.key === "QtyReceived"
                    ? props.sortConfigSecond.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("QtyRejected")} className="cursor">
              Rejected
              <FaArrowUp
                className={
                  props.sortConfigSecond.key === "QtyRejected"
                    ? props.sortConfigSecond.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("QtyIssued")} className="cursor">
              Issued
              <FaArrowUp
                className={
                  props.sortConfigSecond.key === "QtyIssued"
                    ? props.sortConfigSecond.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("QtyUsed")} className="cursor">
              Used
              <FaArrowUp
                className={
                  props.sortConfigSecond.key === "QtyUsed"
                    ? props.sortConfigSecond.direction === "desc"
                      ? "rotateClass"
                      : ""
                    : "displayNoneClass"
                }
              />
            </th>
            <th onClick={() => requestSort("QtyReturned")} className="cursor">
              Returned
              <FaArrowUp
                className={
                  props.sortConfigSecond.key === "QtyReturned"
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
              onClick={() => props.selectRowSecondFunc(val)}
              className={
                props.thirdTableData.some(
                  (el) =>
                    el.CustBOM_Id === val.CustBOM_Id &&
                    el.RV_No === val.RV_No &&
                    el.CustDocuNo === val.CustDocuNo &&
                    el.Id === val.Id &&
                    el.PartId === val.PartId &&
                    el.RVId === val.RVId
                )
                  ? "rowSelectedClass"
                  : ""
              }
              key={key}
            >
              <td>{key + 1}</td>
              <td>{val.PartId}</td>
              <td>{val.QtyReceived}</td>
              <td>{val.QtyRejected}</td>
              <td>{val.QtyIssued}</td>
              <td>{val.QtyUsed}</td>
              <td>{val.QtyReturned}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

import Table from "react-bootstrap/Table";

import { FaArrowUp } from "react-icons/fa";

export default function FirstTable(props) {
  
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
   
  }

  const firstTableCheckBoxClickFunc = (rowData, k) => {
   
    let respArr = removeMtrlThirdTable(rowData);
    let issueChecked = document.getElementById(`checkBoxFirstTable${k}`);


    if (issueChecked.checked) {
      const newArray = props.allData.filter(
        (obj) =>
          obj.Mtrl_Rv_id === rowData.Mtrl_Rv_id &&
          obj.Mtrl_Code === rowData.Mtrl_Code &&
          obj.DynamicPara1 === rowData.DynamicPara1 &&
          obj.DynamicPara2 === rowData.DynamicPara2 &&
          obj.Scrap === rowData.Scrap
      );


      for (let i = 0; i < newArray.length; i++) {
        const element = newArray[i];
        respArr.push(element);
      }

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
    
  };

  const sortedData = () => {
    let dataCopy = [...props.firstTableData];

    if (props.sortConfigFirst.key) {
      dataCopy.sort((a, b) => {
        if (
          !parseFloat(a[props.sortConfigFirst.key]) ||
          !parseFloat(b[props.sortConfigFirst.key])
        ) {
         
          if (a[props.sortConfigFirst.key] < b[props.sortConfigFirst.key]) {
            return props.sortConfigFirst.direction === "asc" ? -1 : 1;
          }
          if (a[props.sortConfigFirst.key] > b[props.sortConfigFirst.key]) {
            return props.sortConfigFirst.direction === "asc" ? 1 : -1;
          }
          return 0;
        } else {
         
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

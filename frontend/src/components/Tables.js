import Table from "react-bootstrap/Table";

const Tables = ({ theadData, tbodyData }) => {
  return (
    <Table striped className="table-data border ">
      <thead className="tableHeaderBGColor">
        <tr>
          {theadData.map((heading) => {
            return <th key={heading}>{heading}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {tbodyData.map((row, index) => {
          return (
            <tr key={index}>
              {theadData.map((key, index) => {
                return <td key={row[key]}>{row[key]}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default Tables;

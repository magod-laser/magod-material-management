import "../../../MatMenu.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

function DraftRVList() {
  return (
    <div>
      <h4 className="form-title">Customer : Parts Receipt List Created</h4>
      <hr className="horizontal-line" />

      <div className="col-md-6 col-sm-12">
        <BootstrapTable
          keyField="RvID"
          striped
          hover
          condensed
          pagination={paginationFactory()}
        ></BootstrapTable>
      </div>
    </div>
  );
}

export default DraftRVList;

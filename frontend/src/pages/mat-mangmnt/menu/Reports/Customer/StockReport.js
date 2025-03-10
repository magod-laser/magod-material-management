import React from "react";
import StockList from "../../Store management/Stock/StockList";
import MaterialStockList from "./Components/MaterialStockList";

function StockReport() {
  return (
    <div>
      {/* {" "}
      <MaterialStockList /> */}
      <StockList type="customer" />
    </div>
  );
}

export default StockReport;

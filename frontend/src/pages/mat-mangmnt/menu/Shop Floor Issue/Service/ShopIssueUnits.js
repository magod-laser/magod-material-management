import React from "react";
import NavComp from "../Service/Components/NavComp";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import ShopFloorMaterialAllotment from "./PartsComponents/ShopFloorMaterialAllotment";

function ShopIssueUnits() {
  return (
    <div>
      <ShopFloorMaterialAllotment type="Service" hasbom="0" formtype="Units" />
    </div>
  );
}

export default ShopIssueUnits;

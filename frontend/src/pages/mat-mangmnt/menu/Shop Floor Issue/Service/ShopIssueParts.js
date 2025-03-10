import React from "react";

import ShopFloorMaterialAllotment from "./PartsComponents/ShopFloorMaterialAllotment";

function ShopIssueParts() {
  return (
    <div>
      <ShopFloorMaterialAllotment type="Service" hasbom="1" formtype="Parts" />
    </div>
  );
}

export default ShopIssueParts;

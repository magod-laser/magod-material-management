export const dateToShort = (myDate) => {
  //console.log("mydate = ", myDate);
  var convertedStartDate = new Date(myDate.toString().substr(0, 10));
  //console.log("mydate substr= ", convertedStartDate);
  //mm/dd/yyyy
  var mmddformat = convertedStartDate.toLocaleDateString();
  //convert to dd/mm/yyyy
  var datearray = mmddformat.split("/");
  var newdate = datearray[1] + "/" + datearray[0] + "/" + datearray[2];
  return newdate;
};

export function formatDate(dateObj, format) {
  var monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var currdate = dateObj.getDate();
  var currmonth = dateObj.getMonth();
  currmonth = currmonth + 1;
  var curryear = dateObj.getFullYear();
  var currmin = dateObj.getMinutes();
  var currhr = dateObj.getHours();
  var currsc = dateObj.getSeconds();
  if (currmonth.toString().length === 1) currmonth = "0" + currmonth;
  if (currdate.toString().length === 1) currdate = "0" + currdate;
  if (currhr.toString().length === 1) currhr = "0" + currhr;
  if (currmin.toString().length === 1) currmin = "0" + currmin;

  if (format === 1) {
    //dd-mm-yyyy
    return currdate + "-" + currmonth + "-" + curryear;
  } else if (format === 2) {
    //yyyy-mm-dd
    return curryear + "-" + currmonth + "-" + currdate;
  } else if (format === 3) {
    //dd/mm/yyyy
    return currdate + "/" + currmonth + "/" + curryear;
  } else if (format === 4) {
    // dd Month yyyy HH:mm:ss
    return (
      currdate +
      " " +
      monthNames[parseInt(currmonth - 1)] +
      " " +
      curryear +
      " " +
      currhr +
      ":" +
      currmin +
      ":" +
      currsc
    );
  } else if (format === 5) {
    // yyyy-mm-dd HH:mm:ss
    return (
      curryear +
      "-" +
      currmonth +
      "-" +
      currdate +
      " " +
      currhr +
      ":" +
      currmin +
      ":" +
      currsc
    );
  } else if (format === 6) {
    //yyyy
    return curryear;
  } else if (format === 7) {
    // dd/Month/yyyy
    return (
      currdate + "/" + monthNames[parseInt(currmonth - 1)] + "/" + curryear
    );
  } else if (format === 8) {
    //mm
    return currmonth;
  } else if (format === 9) {
    // Month yyyy
    return monthNames[parseInt(currmonth - 1)] + " " + curryear;
  } else if (format === 10) {
    // dd/mm/yyyy HH:mm:ss
    return (
      currdate +
      "/" +
      currmonth +
      "/" +
      curryear +
      " " +
      currhr +
      ":" +
      currmin +
      ":" +
      currsc
    );
  }
}

export function getWeight(obj, para1, para2, para3) {
  // console.log(" getweight = ", obj);
  // console.log(" para1 = ", para1);
  // console.log(" para2 = ", para2);
  // console.log(" para3 = ", para3);

  let dblWeight = 0;
  let dblVol = getVolume(obj, obj.Shape, para1, para2, para3);
  // console.log(" dblVol = ", dblVol);
  // dblWeight = dblVol * obj.SpecificWt;
  dblWeight = dblVol * getDensity(obj);
  // console.log(" dblweight = ", dblWeight);
  return dblWeight;
}

/*export function  getDensity(obj){
    if (obj && obj.Mtrl_Code){
      //check 
      if obj.MaterialGrade.Specific_Wt > 0 Then
      Return objMaterialGrade.Specific_Wt
  Else
      If objMaterial.SpecificWt > 0 Then
          Return objMaterial.SpecificWt
      Else
          Return 0
      End If
  End If

    }
    else
        return 0
}*/

export function getDensity(obj) {
  if (!obj) {
    return 0;
  }

  const specificWt = parseFloat(obj.SpecificWt);
  const specific_Wt = parseFloat(obj.Specific_Wt);

  if (!isNaN(specificWt) && specificWt > 0) {
    return specificWt;
  } else if (!isNaN(specific_Wt) && specific_Wt > 0) {
    return specific_Wt;
  } else {
    return 0;
  }
}

export function getVolume(obj, shape, para1, para2, para3) {
  let dblVol = 0;
  if (shape === "Sheet") {
    //console.log("sheet = ", obj.StaticPara1, "  1 = ", para1, " 2 = ", para2);
    dblVol = obj.StaticPara1 * para1 * para2;
  } else if (shape === "Tiles") {
    dblVol = obj.StaticPara1 * obj.StaticPara2 * obj.StaticPara3;
  } else if (shape === "Tube Rectangle") {
    // console.log("entering into tube rectangle..............");
    // debugger;
    dblVol =
      para1 *
      (obj.StaticPara1 * obj.StaticPara2 -
        (obj.StaticPara1 - 2 * obj.StaticPara3) *
          (obj.StaticPara2 - 2 * obj.StaticPara3));
  } else if (shape === "Tube Square") {
    dblVol =
      para1 *
      (obj.StaticPara1 * obj.StaticPara2 -
        (obj.StaticPara1 - 2 * obj.StaticPara3) *
          (obj.StaticPara2 - 2 * obj.StaticPara3));
  } else if (shape === "Tube Round") {
    dblVol =
      Math.PI *
      para1 *
      (Math.pow(obj.StaticPara1 / 2, 2) -
        Math.pow(obj.StaticPara1 / 2 - obj.StaticPara2, 2));
  } else if (shape === "Plate") {
    dblVol = obj.StaticPara1 * para1 * para2;
  } else if (shape === "Strip") {
    dblVol = obj.StaticPara1 * para1 * para2;
  } else if (shape === "Block") {
    // dblVol = obj.StaticPara1 * para1 * para2;
    dblVol = para1 * para2 * para3;
  } else if (shape === "Cylinder") {
    dblVol = 0;
  } else {
    dblVol = 0;
  }
  return dblVol;
}

export function get_Iv_DetailsEntry(
  Scrap,
  dblDP1,
  dblDP2,
  dblDP3,
  Material,
  Shape,
  objShape,
  objMaterialCode
) {
  let Details = "";
  if (Scrap) return "Scrap of " + Material;
  else {
    if (Shape === "Sheet") {
      Details =
        dblDP1 +
        " " +
        objShape.DynamicPara1Unit +
        " X " +
        dblDP2 +
        " " +
        objShape.DynamicPara2Unit +
        " X " +
        objMaterialCode.StaticPara1 +
        " " +
        objShape.StaticPara1Unit +
        " ";
      // Details =
      //   (dblDP1 + " " + objShape.DynamicPara1Unit + " X " + dblDP2) &
      //   (" " +
      //     objShape.DynamicPara2Unit +
      //     " X " +
      //     objMaterialCode.StaticPara1 +
      //     " " +
      //     objShape.StaticPara1Unit +
      //     " ");
    }
    if (Shape === "Plate") {
      Details =
        dblDP1 +
        " " +
        objShape.DynamicPara1Unit +
        " X " +
        dblDP2 +
        " " +
        objShape.DynamicPara2Unit +
        " X " +
        objMaterialCode.StaticPara1 +
        " " +
        objShape.StaticPara1Unit +
        " ";
    }

    if (Shape === "Tube Round") {
      Details =
        objMaterialCode.StaticPara1 +
        " " +
        objShape.StaticPara1Unit +
        " Dia " +
        objMaterialCode.StaticPara2 +
        " " +
        objShape.StaticPara2Unit +
        " X " +
        dblDP1 +
        " " +
        objShape.StaticPara1Unit;
    }

    if (Shape === "Tube Square") {
      Details =
        objMaterialCode.StaticPara1 +
        " " +
        objShape.StaticPara1Unit +
        " X " +
        objMaterialCode.StaticPara2 +
        " " +
        objShape.StaticPara2Unit +
        " X " +
        objMaterialCode.StaticPara3 +
        " " +
        objShape.StaticPara3Unit +
        " X " +
        dblDP1 +
        " " +
        objShape.StaticPara1Unit;
    }

    if (Shape === "Tube Rectangle") {
      Details =
        objMaterialCode.StaticPara1 +
        " " +
        objShape.StaticPara1Unit +
        " X " +
        objMaterialCode.StaticPara2 +
        " " +
        objShape.StaticPara2Unit +
        " X " +
        objMaterialCode.StaticPara3 +
        " " +
        objShape.StaticPara3Unit +
        " X " +
        dblDP1 +
        " " +
        objShape.DynamicPara1Unit;
    }

    if (Shape === "Strip") {
      Details =
        objMaterialCode.StaticPara1 +
        " " +
        objShape.StaticPara1Unit +
        " X " +
        dblDP1 +
        " " +
        objShape.DynamicPara1Unit;
    }

    if (Shape === "Tiles") {
      Details =
        objMaterialCode.StaticPara1 +
        " " +
        objShape.StaticPara1Unit +
        " X " +
        objMaterialCode.StaticPara2 +
        " " +
        objShape.StaticPara2Unit +
        " X " +
        objMaterialCode.StaticPara3 +
        " " +
        objShape.StaticPara3Unit;
    }

    if (Shape === "Block") {
      Details =
        dblDP1 +
        " " +
        objShape.DynamicPara1Unit +
        " X " +
        dblDP2 +
        " " +
        objShape.DynamicPara2Unit +
        " X " +
        dblDP3 +
        " " +
        objShape.DynamicPara3Unit;
    }
    if (Shape === "Units") {
      Details = "Quantity";
    }
  }

  return "Returning balance material " + Shape + " " + Material + " " + Details;
}

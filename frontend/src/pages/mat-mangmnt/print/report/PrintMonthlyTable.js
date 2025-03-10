import React from "react";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
// import MLLogo from "../../../../../../frontend/src/ML-LOGO.png";
import MLLogo from "../../../../../src/ML-LOGO.png";

import { formatDate } from "../../../../utils";

//function PrintMaterialDCTable() {

let headerFontSize = "13px";
let subheaderFontsize = "11px";
let fontSize = "9px";
const styles = StyleSheet.create({
  pageStyling: {
    padding: "2%",
    paddingTop: "0%",
    fontSize: fontSize,
    fontFamily: "Helvetica",
    marginTop: 30,
    marginBottom: 50,
    paddingBottom: 50,
  },
  globalPadding: { padding: "0.6%" },
  footerRowPadding: { padding: "3px" },
  // globalPadding: { padding: "0.6%" },
  fontBold: {
    //   fontWeight: "bold",
    fontSize: fontSize,
    fontFamily: "Helvetica-Bold",
  },

  insideBox: { borderBottom: "1px", padding: "0.6%" },

  material: {
    width: "30%",
    marginLeft: "50px",
    marginTop: "5px",
    // fontSize: 11,
    // fontWeight: "bold",
  },
  weightinkgs: {
    width: "30%",
    marginLeft: "5px",
    marginTop: "5px",
    // fontSize: 11,
    // fontWeight: "bold",
  },
  totqty: {
    width: "20%",
    marginLeft: "5px",
    marginTop: "5px",
    // fontSize: 11,
    // fontWeight: "bold",
  },
  para: {
    width: "10%",
    marginLeft: "5px",
    marginTop: "2px",
    // fontSize: 8,
    // fontWeight: "bold",
  },
  docu: {
    width: "50%",
    marginLeft: "5px",
    marginTop: "2px",
    // fontSize: 8,
    // fontWeight: "bold",
  },
});

//return <div>PrintMaterialDCTable</div>;
//}
const PrintMonthlyTable = (props) => (
  <Document>
    <Page size="A4" style={{ ...styles.pageStyling }}>
      <View>
        {/* Top */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Image src={MLLogo} style={{ width: "8.3%" }} />
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                borderBottom: "1px",
                ...styles.fontBold,
                fontSize: headerFontSize,
              }}
            >
              Material Summary For the Month of : {props.date}
            </Text>

            <Text style={{ ...styles.fontBold, fontSize: subheaderFontsize }}>
              {props.PDFData.RegisteredName}
            </Text>
            <Text style={{ ...styles.fontBold }}>
              GST: {props.PDFData.GST_No} CIN: {props.PDFData.CIN_No}
            </Text>
            <Text>{props.PDFData.RegistredOfficeAddress}</Text>
            <Text>
              {props.PDFData.PhonePrimary}, {props.PDFData.PhoneSecondary},{" "}
              {props.PDFData.Email}, {props.PDFData.URL}
            </Text>
          </View>
          <Text style={{ padding: "3%" }}></Text>
        </View>
        <Text style={{ padding: "1%" }}></Text>
        <View style={{ border: "1px" }}>
          <View
            style={{
              // display: "flex",
              // flexDirection: "column",
              // justifyContent: "center",
              padding: "1%",
            }}
          >
            {/* summary section */}
            {/* Material Purchase Summary */}
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={{ borderBottom: "1px", ...styles.fontBold }}>
                  Material Purchase Summary
                </Text>
              </View>
              <View
                style={{
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={{ ...styles.material, ...styles.fontBold }}>
                  Material
                </Text>
                <Text style={{ ...styles.weightinkgs, ...styles.fontBold }}>
                  Weight in Kgs
                </Text>
              </View>
              <View
                style={{
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "flex-start",
                }}
              >
                {props.fourthTab.map((item, index) => {
                  return (
                    <>
                      <View
                        style={{
                          // ...styles.insideBox,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Text style={styles.material}>{item.Material}</Text>
                        <Text style={styles.weightinkgs}>
                          {Math.round(parseFloat(item.TotalWeight))}
                        </Text>
                      </View>
                    </>
                  );
                })}
              </View>
            </View>
            {/* Material Sales Summary */}
            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={{ borderBottom: "1px", ...styles.fontBold }}>
                  Material Sales Summary
                </Text>
              </View>
              <View
                style={{
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={{ ...styles.material, ...styles.fontBold }}>
                  Material
                </Text>
                <Text style={{ ...styles.weightinkgs, ...styles.fontBold }}>
                  Weight in Kgs
                </Text>
              </View>
              <View
                style={{
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "flex-start",
                }}
              >
                {props.thirdTab.map((item, index) => {
                  return (
                    <>
                      <View
                        style={{
                          // ...styles.insideBox,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Text style={styles.material}>{item.Material}</Text>
                        <Text style={styles.weightinkgs}>
                          {Math.round(parseFloat(item.SrlWt))}
                        </Text>
                      </View>
                    </>
                  );
                })}
              </View>
            </View>
            {/* Monthly Material Handling Summary */}

            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={{ borderBottom: "1px", ...styles.fontBold }}>
                  Monthly Material Handling Summary
                </Text>
              </View>

              <View
                style={{
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "flex-start",
                }}
              >
                {props.totalobj.map((item, index) => {
                  return (
                    <>
                      <View
                        style={{
                          // ...styles.insideBox,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Text style={styles.material}>{item.type}</Text>
                        <Text style={styles.weightinkgs}>Material</Text>
                        <Text style={styles.totqty}>
                          Quantity : {item.total}
                        </Text>
                      </View>
                    </>
                  );
                })}
              </View>
            </View>

            {/* details sections */}
            {/*Material Purchase Details */}

            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={{ borderBottom: "1px", ...styles.fontBold }}>
                  Material Purchase Details
                </Text>
              </View>

              <View
                style={{
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "flex-start",
                  border: "none",
                }}
              >
                {props.purchaseDetails.map((item, index) => {
                  return (
                    <>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{ borderBottom: "1px", ...styles.fontBold }}
                        >
                          {item.material}
                        </Text>
                      </View>

                      <View
                        style={{
                          // ...styles.insideBox,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {item.data.map((item, index) => {
                          return (
                            <>
                              <View
                                style={{
                                  // ...styles.insideBox,
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text style={styles.para}>
                                  {formatDate(new Date(item.RV_Date), 3)}
                                </Text>
                                <Text style={styles.para}>{item.RV_No}</Text>
                                <Text style={styles.para}>
                                  {Math.round(parseInt(item.TotalWeight))}
                                </Text>
                                <Text style={styles.docu}>
                                  {item.CustDocuNo}
                                </Text>
                              </View>
                            </>
                          );
                        })}
                        <View
                          style={{
                            // ...styles.insideBox,
                            // border: "none",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderTop: "1px",
                            borderBottom: "1px",
                            marginTop: "0.6%",
                            padding: "0.6%",
                          }}
                        >
                          <Text style={styles.para}></Text>
                          <Text style={{ ...styles.para, ...styles.fontBold }}>
                            Total
                          </Text>
                          <Text style={styles.para}>{item.totwt}</Text>
                          <Text style={styles.docu}></Text>
                        </View>
                      </View>
                    </>
                  );
                })}
              </View>
            </View>

            {/* Material Sales Details */}

            <View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={{ borderBottom: "1px", ...styles.fontBold }}>
                  Material Sales Details
                </Text>
              </View>

              <View
                style={{
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "column",
                  // justifyContent: "flex-start",
                  border: "none",
                }}
              >
                {props.saleDetails.map((item, index) => {
                  return (
                    <>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{ borderBottom: "1px", ...styles.fontBold }}
                        >
                          {item.material}
                        </Text>
                      </View>

                      <View
                        style={{
                          // ...styles.insideBox,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {item.data.map((item, index) => {
                          return (
                            <>
                              <View
                                style={{
                                  // ...styles.insideBox,
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text style={styles.para}>
                                  {formatDate(new Date(item.Inv_Date), 3)}
                                </Text>
                                <Text style={styles.para}>{item.Inv_No}</Text>
                                <Text style={styles.para}>
                                  {Math.round(parseInt(item.SrlWt))}
                                </Text>
                                <Text style={styles.docu}>
                                  {item.Cust_Name}
                                </Text>
                              </View>
                            </>
                          );
                        })}
                        <View
                          style={{
                            // ...styles.insideBox,
                            // border: "none",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            borderTop: "1px",
                            borderBottom: "1px",
                            marginTop: "0.6%",
                            padding: "0.6%",
                          }}
                        >
                          <Text style={styles.para}></Text>
                          <Text style={{ ...styles.para, ...styles.fontBold }}>
                            Total
                          </Text>
                          <Text style={styles.para}>{item.totwt}</Text>
                          <Text style={styles.docu}></Text>
                        </View>
                      </View>
                    </>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default PrintMonthlyTable;

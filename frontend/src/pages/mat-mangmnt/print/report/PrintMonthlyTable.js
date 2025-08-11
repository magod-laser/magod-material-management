import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";

import MLLogo from "../../../../../src/ML-LOGO.png";
import { formatDate } from "../../../../utils";

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
  fontBold: {
    fontSize: fontSize,
    fontFamily: "Helvetica-Bold",
  },

  insideBox: { borderBottom: "1px", padding: "0.6%" },

  material: {
    width: "30%",
    marginLeft: "50px",
    marginTop: "5px",
  },
  weightinkgs: {
    width: "30%",
    marginLeft: "5px",
    marginTop: "5px",
  },
  totqty: {
    width: "20%",
    marginLeft: "5px",
    marginTop: "5px",
  },
  para: {
    width: "10%",
    marginLeft: "5px",
    marginTop: "2px",
  },
  docu: {
    width: "50%",
    marginLeft: "5px",
    marginTop: "2px",
  },
});

const PrintMonthlyTable = (props) => (
  <Document>
    <Page size="A4" style={{ ...styles.pageStyling }}>
      <View>
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
              padding: "1%",
            }}
          >
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
                }}
              >
                {props.fourthTab.map((item, index) => {
                  return (
                    <>
                      <View
                        style={{
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
                }}
              >
                {props.thirdTab.map((item, index) => {
                  return (
                    <>
                      <View
                        style={{
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
                }}
              >
                {props.totalobj.map((item, index) => {
                  return (
                    <>
                      <View
                        style={{
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
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {item.data.map((item, index) => {
                          return (
                            <>
                              <View
                                style={{
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
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        {item.data.map((item, index) => {
                          return (
                            <>
                              <View
                                style={{
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

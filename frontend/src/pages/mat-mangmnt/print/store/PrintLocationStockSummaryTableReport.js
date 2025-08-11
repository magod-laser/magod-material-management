import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";

import MLLogo from "../../../../../src/ML-LOGO.png";

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

  headercol1: {
    width: "22%",
    paddingLeft: "20px",
  },

  col1: {
    width: "35%",
    paddingLeft: "25px",
  },

  col2: {
    width: "12%",
  },
});

export default function PrintLocationStockSummaryTableReport(props) {
  return (
    <>
      <Document>
        <Page size="A4" style={{ ...styles.pageStyling }}>
          <View>
            {/* top */}
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
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      borderBottom: "1px",
                      ...styles.fontBold,
                      fontSize: headerFontSize,
                    }}
                  >
                    Location Material Stock Summary
                  </Text>
                </View>
                <Text
                  style={{
                    ...styles.fontBold,
                    fontSize: subheaderFontsize,
                  }}
                >
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
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.headercol1}>
                  <Text style={{ ...styles.fontBold }}>Location</Text>
                  <Text> : {props.formHeader.LocationNo}</Text>
                </Text>
                <Text style={styles.headercol1}>
                  <Text style={{ ...styles.fontBold }}>Type</Text>
                  <Text> : {props.formHeader.StorageType}</Text>
                </Text>
                <Text style={styles.headercol1}>
                  <Text style={{ ...styles.fontBold }}>Capacity</Text>
                  <Text> : {props.formHeader.Capacity}</Text>
                </Text>
                <Text style={styles.headercol1}>
                  <Text style={{ ...styles.fontBold }}>Current Usage</Text>
                  <Text> : {props.formHeader.CapacityUtilised}</Text>
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
                <Text style={{ ...styles.col1, ...styles.fontBold }}>
                  Material
                </Text>
                <Text style={{ ...styles.col2, ...styles.fontBold }}>
                  Para1
                </Text>
                <Text style={{ ...styles.col2, ...styles.fontBold }}>
                  Para2
                </Text>
                <Text style={{ ...styles.col2, ...styles.fontBold }}>
                  Quantity
                </Text>
                <Text style={{ ...styles.col2, ...styles.fontBold }}>
                  Weight
                </Text>
                <Text style={{ ...styles.col2, ...styles.fontBold }}>
                  Scrap Weight
                </Text>
              </View>

              {props.tableData.map((item, index) => (
                <>
                  <View
                    style={{
                      ...styles.insideBox,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <View
                      style={{
                        ...styles.insideBox,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        ...styles.fontBold,
                      }}
                    >
                      <Text>{item.customer}</Text>
                    </View>

                    {item.rawlength !== 0 ? (
                      <>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{ ...styles.insideBox, ...styles.fontBold }}
                          >
                            Raw Material
                          </Text>
                        </View>
                        <View
                          style={{
                            ...styles.insideBox,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {item.rawMaterial.map((item, index) => (
                            <>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <Text style={styles.col1}>
                                  {item.Mtrl_Code}
                                </Text>
                                <Text style={styles.col2}>
                                  {item.DynamicPara1}
                                </Text>
                                <Text style={styles.col2}>
                                  {item.DynamicPara2}
                                </Text>
                                <Text style={styles.col2}>{item.Quantity}</Text>
                                <Text style={styles.col2}>
                                  {parseFloat(item.Weight).toFixed(3)}
                                </Text>
                                <Text style={styles.col2}>
                                  {parseFloat(item.SWeight).toFixed(3)}
                                </Text>
                              </View>
                            </>
                          ))}
                        </View>

                        <View
                          style={{
                            ...styles.insideBox,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Text style={styles.col1}></Text>
                          <Text style={styles.col2}></Text>
                          <Text style={styles.col2}></Text>
                          <Text style={styles.col2}>{item.tot1qty}</Text>
                          <Text style={styles.col2}>
                            {parseFloat(item?.tot1wt).toFixed(3)}
                          </Text>
                          <Text style={styles.col2}>
                            {parseFloat(item.tot1swt).toFixed(3)}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <></>
                    )}

                    {item.scraplength !== 0 ? (
                      <>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{ ...styles.insideBox, ...styles.fontBold }}
                          >
                            Scrap Material
                          </Text>
                        </View>
                        <View
                          style={{
                            ...styles.insideBox,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {item.scrapMaterial.map((item, index) => (
                            <>
                              <View
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <Text style={styles.col1}>
                                  {item.Mtrl_Code}
                                </Text>
                                <Text style={styles.col2}>
                                  {item.DynamicPara1}
                                </Text>
                                <Text style={styles.col2}>
                                  {item.DynamicPara2}
                                </Text>
                                <Text style={styles.col2}>{item.Quantity}</Text>
                                <Text style={styles.col2}>
                                  {parseFloat(item.Weight).toFixed(3)}
                                </Text>
                                <Text style={styles.col2}>
                                  {parseFloat(item.SWeight).toFixed(3)}
                                </Text>
                              </View>
                            </>
                          ))}
                        </View>

                        <View
                          style={{
                            ...styles.insideBox,
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Text style={styles.col1}></Text>
                          <Text style={styles.col2}></Text>
                          <Text style={styles.col2}></Text>
                          <Text style={styles.col2}>{item.tot2qty}</Text>
                          <Text style={styles.col2}>
                            {parseFloat(item.tot2wt).toFixed(3)}
                          </Text>
                          <Text style={styles.col2}>
                            {parseFloat(item.tot2swt).toFixed(3)}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <></>
                    )}
                  </View>
                </>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
}

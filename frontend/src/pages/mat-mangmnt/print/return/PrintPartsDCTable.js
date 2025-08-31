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
  fontBold: {
    fontSize: "10px",
    fontFamily: "Helvetica-Bold",
  },

  topspace: {
    width: "100%",
    marginTop: "100px",
  },

  titleMiddle2: {
    padding: "5px",
  },

  tableCol1: {
    padding: "5px",
    width: "9%",
  },
  tableCol2: {
    padding: "5px",
    width: "60%",
  },
  tableCol3: {
    padding: "5px",
    width: "19%",
  },
  tableCol4: {
    padding: "5px",
    width: "10%",
  },
});

const copiesNames = [
  { copyName: "Original for Recipient" },
  { copyName: "Transporter Copy" },
  { copyName: "Extra Copy" },
];

export default function PrintPartsDCTable(props) {
  return (
    <>
      <Document>
        {copiesNames.map((copyVal, copyKey) => (
          <>
            <Page size="A4" style={{ ...styles.pageStyling }}>
              <View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Image src={MLLogo} style={{ width: "8.3%" }} />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",

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
                        Material / Scrap Sheets Return Challan
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
                      {props.PDFData.PhonePrimary},{" "}
                      {props.PDFData.PhoneSecondary}, {props.PDFData.Email},{" "}
                      {props.PDFData.URL}
                    </Text>
                  </View>
                  <Text style={{ width: "10%" }}>{copyVal.copyName}</Text>
                </View>

                <Text style={{ padding: "0.5%" }}></Text>
                <View style={{ border: "1px" }}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View
                      style={{
                        ...styles.insideBox,
                        width: "70%",
                        borderRight: "1px",
                      }}
                    >
                      <Text style={{ ...styles.fontBold }}>
                        {props.formHeader?.Customer} (
                        {props.formHeader?.Cust_code})
                      </Text>
                      <View style={{ padding: "0.6%" }}>
                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <Text style={{ ...styles.fontBold }}>GSTIN : </Text>
                          <Text>{props.custdata?.GSTNo}</Text>
                        </View>

                        <View style={{ display: "flex", flexDirection: "row" }}>
                          <Text style={{ ...styles.fontBold }}>Branch : </Text>

                          <Text>{props.custdata?.Branch}</Text>
                        </View>

                        <Text>{props.custdata?.Address}</Text>
                        <Text>
                          {props.custdata?.City}, {props.custdata?.State} -{" "}
                          {props.custdata?.Pin_Code}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        ...styles.insideBox,
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ ...styles.fontBold }}>
                          DC No{"    "}:{" "}
                        </Text>
                        <Text>{props.formHeader?.PkngDcNo}</Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ ...styles.fontBold }}>DC Date : </Text>
                        <Text>{props.formHeader?.PkngDCDate}</Text>
                      </View>
                      <View>
                        <Text style={{ padding: "1%" }}></Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ ...styles.fontBold }}>
                          IV No{"      "}:{" "}
                        </Text>
                        <Text>{props.formHeader?.IV_No}</Text>
                      </View>
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        <Text style={{ ...styles.fontBold }}>
                          IV Date{"   "}:{" "}
                        </Text>
                        <Text>{props.formHeader?.IV_Date}</Text>
                      </View>
                    </View>
                  </View>

                  <View
                    style={{
                      ...styles.insideBox,
                      ...styles.fontBold,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text style={styles.tableCol1}>SL No</Text>
                    <Text style={styles.tableCol2}>PartId / Part Name</Text>
                    <Text style={styles.tableCol3}>Remarks</Text>
                    <Text style={styles.tableCol4}>Quantity</Text>
                  </View>
                  <View
                    style={{
                      ...styles.insideBox,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {props.outData?.map((item, index) => {
                      return (
                        <>
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "flex-start",
                            }}
                          >
                            <Text style={styles.tableCol1}>{index + 1}</Text>
                            <Text style={styles.tableCol2}>{item.PartId}</Text>
                            <Text style={styles.tableCol3}>{item.Remarks}</Text>
                            <Text style={styles.tableCol4}>
                              {item.QtyReturned}
                            </Text>
                          </View>
                        </>
                      );
                    })}
                  </View>

                  <View style={{ padding: "1%" }}></View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "0.6%",
                    }}
                  >
                    <Text style={{ ...styles.fontBold }}>Remarks :</Text>
                    <View
                      style={{
                        ...styles.insideBox,
                        border: "1px",
                        minHeight: "48px",
                        display: "flex",
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text>{props.formHeader?.RV_Remarks}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.insideBox,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        ...styles.titleMiddle2,
                      }}
                    >
                      <Text style={{ ...styles.fontBold }}>Total Items : </Text>
                      <Text>{props.outData?.length}</Text>
                    </View>

                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        ...styles.titleMiddle2,
                      }}
                    >
                      <Text style={{ ...styles.fontBold }}>
                        Total Weight / Quantity:{" "}
                      </Text>
                      <Text>{props.formHeader.TotalWeight}</Text>
                    </View>
                  </View>
                  <View style={{ ...styles.insideBox }}>
                    <View>
                      <Text>{props.PDFData.DCterms}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      ...styles.insideBox,
                      ...styles.fontBold,
                      display: "flex",
                      flexDirection: "row",
                      border: "none",
                    }}
                  >
                    <View
                      style={{
                        width: "50%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          marginTop: "80px",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <Text> </Text>
                        <Text style={{ padding: "3%" }}></Text>
                        <Text>Customer Signature with Seal</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "50%",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Text>For, {props.PDFData.RegisteredName}</Text>
                        <Text style={{ padding: "5%" }}></Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            marginTop: "80px",
                          }}
                        >
                          <Text>Authorised Signatory</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Page>
          </>
        ))}
      </Document>
    </>
  );
}

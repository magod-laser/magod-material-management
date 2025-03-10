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

  line1: {
    width: "100%",
    paddingLeft: "15px",
  },
  invno: {
    width: "10%",
    marginLeft: "18px",
    // marginTop: "10px",
    // fontSize: 10,
    // fontWeight: "bold",
  },
  customer: {
    width: "40%",
    marginLeft: "25px",
    // marginTop: "10px",
    // fontSize: 10,
    // fontWeight: "bold",
  },
  material: {
    width: "20%",
    marginLeft: "5px",
    // marginTop: "10px",
    // fontSize: 10,
    // fontWeight: "bold",
  },
  weight: {
    width: "20%",
    marginLeft: "5px",
    // marginTop: "10px",
    // fontSize: 10,
    // fontWeight: "bold",
  },
});

//return <div>PrintMaterialDCTable</div>;
//}
const PrintDailyReportInvoiceTable = (props) => (
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
              Daily Invoice Material Dispatch List :
              {formatDate(new Date(props.date), 3)}
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
        <View style={{ border: "1px", borderBottom: "none" }}>
          {/* material stock */}
          <View style={styles.insideBox}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ ...styles.invno, ...styles.fontBold }}>
                Invoice No
              </Text>
              <Text style={{ ...styles.customer, ...styles.fontBold }}>
                Customer
              </Text>
              <Text style={{ ...styles.material, ...styles.fontBold }}>
                Material
              </Text>
              <Text style={{ ...styles.weight, ...styles.fontBold }}>
                Weight
              </Text>
            </View>
          </View>

          {props.tableData.map((item, index) => {
            return (
              <>
                <View
                  style={{
                    ...styles.insideBox,
                    ...styles.fontBold,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    // fontWeight: "bold",
                    padding: "1%",
                  }}
                >
                  <Text>{item.material}</Text>
                </View>
                {/* <Text style={styles.insideBox}></Text> */}
                <View
                  style={{
                    ...styles.insideBox,
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
                            marginTop: "3px",
                          }}
                        >
                          <Text style={styles.invno}>{item.Inv_No}</Text>
                          <Text style={styles.customer}>{item.Cust_Name}</Text>
                          <Text style={styles.material}>{item.Material}</Text>
                          <Text style={styles.weight}>{item.SrlWt}</Text>
                        </View>
                      </>
                    );
                  })}

                  {/* <Text style={styles.line1}>
                  _________________________________________________________________________________________
                </Text> */}
                  <View
                    style={{
                      ...styles.insideBox,
                      border: "none",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderTop: "1px solid black",
                      marginTop: "0.6%",
                    }}
                  >
                    <Text style={styles.invno}></Text>
                    <Text style={styles.customer}></Text>
                    <Text style={{ ...styles.material, ...styles.fontBold }}>
                      Total
                    </Text>
                    <Text style={styles.weight}>{item.totwt.toFixed(3)}</Text>
                  </View>

                  {/* <Text style={styles.line1}>
                  _________________________________________________________________________________________
                </Text> */}
                </View>
              </>
            );
          })}
        </View>
      </View>
    </Page>
  </Document>
);

export default PrintDailyReportInvoiceTable;

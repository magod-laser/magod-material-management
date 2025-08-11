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

  rvno: {
    width: "8%",
    fontSize: fontSize,
  },
  customer: {
    width: "38%",
    fontSize: fontSize,
  },
  material: {
    width: "13%",
    fontSize: fontSize,
  },
  shape: {
    width: "20%",
    fontSize: fontSize,
  },
  totalweight: {
    width: "12%",
    fontSize: fontSize,
  },

  quantity: {
    width: "9%",
    fontSize: fontSize,
  },

  summaryFinal: {
    width: "13%",
    fontSize: fontSize,
  },

  totalWeightFinal: {
    width: "12%",
    fontSize: fontSize,
  },

  quantityFinal: {
    width: "9%",
    fontSize: fontSize,
  },

  MaterialReceiptIncharge: {
    width: "45%",
    marginLeft: "30px",
    marginTop: "10px",
    fontSize: subheaderFontsize,
  },

  MaterialDeptIncharge: {
    width: "45%",
    alignContent: "right",
    marginLeft: "25px",
    marginTop: "10px",
    fontSize: subheaderFontsize,
  },
});

const PrintDailyReportReceiptTable = (props) => (
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
              Daily Material Arrival Report :{" "}
              {formatDate(new Date(props.date), 3)}{" "}
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
          <View style={styles.insideBox}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ ...styles.rvno, ...styles.fontBold }}>Rv No</Text>
              <Text style={{ ...styles.customer, ...styles.fontBold }}>
                Customer
              </Text>
              <Text style={{ ...styles.material, ...styles.fontBold }}>
                Material
              </Text>
              <Text style={{ ...styles.shape, ...styles.fontBold }}>Shape</Text>
              <Text style={{ ...styles.totalweight, ...styles.fontBold }}>
                Total Weight
              </Text>
              <Text style={{ ...styles.quantity, ...styles.fontBold }}>
                Quantity
              </Text>
            </View>
          </View>
          <View style={styles.insideBox}>
            <View style={{ display: "flex", flexDirection: "column" }}>
              {props.tableData.map((item, index) => {
                return (
                  <>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={{ padding: "2px", ...styles.rvno }}>
                        {item.RV_No}
                      </Text>
                      <Text style={{ padding: "2px", ...styles.customer }}>
                        {item.Customer}
                      </Text>
                      <Text style={{ padding: "2px", ...styles.material }}>
                        {item.material}
                      </Text>
                      <Text style={{ padding: "2px", ...styles.shape }}>
                        {item.mtrl_code}{" "}
                      </Text>
                      <Text style={{ padding: "2px", ...styles.totalweight }}>
                        {parseFloat(item.totalWeight || 0).toFixed(3)}
                      </Text>
                      <Text style={{ padding: "2px", ...styles.quantity }}>
                        {parseInt(item.qty || 0)}
                      </Text>
                    </View>
                  </>
                );
              })}
            </View>
          </View>

          <View
            style={{
              ...styles.insideBox,
              border: "none",
              marginTop: "9px",
              marginBottom: "9px",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Text style={{ ...styles.summaryFinal, ...styles.fontBold }}>
                Summary
              </Text>
              <Text style={styles.totalWeightFinal}>
                {props.totalweight.toFixed(3)}
              </Text>
              <Text style={styles.quantityFinal}>{parseInt(props.totqty)}</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: "3%",
            ...styles.fontBold,
          }}
        >
          <Text>Material Receipt Incharge</Text>
          <Text>Material Dept Incharge</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PrintDailyReportReceiptTable;

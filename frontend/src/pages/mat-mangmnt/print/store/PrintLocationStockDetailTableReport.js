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

  leftBlock: {
    width: "30%",

    paddingLeft: "25px",
  },
  rightBlock: {
    width: "60%",
  },
  col1: {
    width: "30%",

    paddingLeft: "25px",
  },
  col2: {
    width: "30%",
  },
  col3: {
    width: "30%",
  },
});

export default function PrintLocationStockDetailTableReport(props) {
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
                    Location Material Details List
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
              <View style={{ ...styles.insideBox }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ ...styles.leftBlock, ...styles.fontBold }}>
                    Location
                  </Text>
                  <Text style={styles.rightBlock}>
                    {props.formHeader.LocationNo}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ ...styles.leftBlock, ...styles.fontBold }}>
                    Customer
                  </Text>
                  <Text style={styles.rightBlock}>
                    {props.formHeader.Customer}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ ...styles.leftBlock, ...styles.fontBold }}>
                    Material
                  </Text>
                  <Text style={styles.rightBlock}>
                    {props.formHeader.Mtrl_Code}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ ...styles.leftBlock, ...styles.fontBold }}>
                    Dimension
                  </Text>
                  <Text style={styles.rightBlock}>
                    {Math.round(props.formHeader.DynamicPara1)} X{" "}
                    {Math.round(props.formHeader.DynamicPara2)}
                  </Text>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ ...styles.leftBlock, ...styles.fontBold }}>
                    Scrap
                  </Text>
                  <Text style={styles.rightBlock}>
                    {props.formHeader.Scrap === 0 ? "False" : "True"}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text style={{ ...styles.col1, ...styles.fontBold }}>
                  MtrlStockID
                </Text>
                <Text style={{ ...styles.col2, ...styles.fontBold }}>
                  Weight
                </Text>
                <Text style={{ ...styles.col2, ...styles.fontBold }}>
                  Scrap Weight
                </Text>
              </View>

              <View
                style={{
                  ...styles.insideBox,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {props.tableData.map((item, index) => (
                  <>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text style={styles.col1}>{item.MtrlStockID}</Text>
                      <Text style={styles.col2}>
                        {parseFloat(item.Weight).toFixed(3)}
                      </Text>
                      <Text style={styles.col3}>
                        {parseFloat(item.ScrapWeight).toFixed(3)}
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
                }}
              >
                <Text style={styles.col1}>
                  <Text style={{ ...styles.fontBold }}>Total Sheets</Text>
                  <Text>: {props.tabletotal.qty}</Text>
                </Text>
                <Text style={styles.col2}>
                  {parseFloat(props.tabletotal.tot1).toFixed(3)}
                </Text>
                <Text style={styles.col3}>
                  {parseFloat(props.tabletotal.tot2).toFixed(3)}
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
}

/** @format */

import React from "react";
import {
  Page,
  Document,
  StyleSheet,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import { formatDate } from "../../../../utils";
// import MLLogo from "../../../../../../frontend/src/ML-LOGO.png";
import MLLogo from "../../../../../src/ML-LOGO.png";

const styles = StyleSheet.create({
  page: {
    fontSize: "9px",
    flexDirection: "column",
    //  margin: "30px"
    marginTop: 30,
    marginBottom: 50,
    paddingBottom: 50,
  },

  tableContainer: {
    //   flexDirection: "row",
    //   flexWrap: "wrap",
    //   border: "1px solid black",
    //   padding: "4px",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
    border: "1px solid black",
    paddingTop: "10px",
    paddingBottom: "50px",
  },

  title1: {
    width: "100%",
    marginTop: "6px",
    marginLeft: "160px",
    fontSize: "13px",
    fontWeight: "bolder",
    textDecoration: "underline",
    fontFamily: "Helvetica-Bold",
    // alignSelf: "center",
  },

  title2: {
    width: "100%",
    marginLeft: "140px",
    fontSize: "11px",
    fontWeight: "bold",
    // textDecoration: "underline",
    fontFamily: "Helvetica-Bold",
    // alignSelf: "center",
  },

  Heading: {
    textAlign: "center",
    flexDirection: "row",
    width: "500px",
    padding: "1px",
  },

  line1: {
    marginTop: "10px",
    fontWeight: "bold",
    width: "100%",
  },
  line2: {
    width: "100%",
  },
  line3: {
    width: "100%",
    marginTop: "-7px",
  },

  blockRightAlign: {
    width: "8%",
    textAlign: "left",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  blockLeftAlign: {
    width: "30%",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
    // fontFamily: "Helvetica-Bold",
  },

  blockRightAlign2: {
    width: "10%",
    textAlign: "left",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  blockLeftAlign2: {
    width: "18%",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
  },

  emptyBlock: {
    width: "35%",
  },
  blockWhole: {
    width: "100%",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
    // fontFamily: "Helvetica-Bold",
  },

  linegap: {
    marginTop: "5px",
  },

  mtrlID: {
    width: "30%",
    marginLeft: "10px",
    marginTop: "5px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  para1: {
    width: "10%",
    marginLeft: "10px",
    marginTop: "5px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  para2: {
    width: "10%",
    marginLeft: "5px",
    marginTop: "5px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  used: {
    width: "10%",
    marginLeft: "5px",
    marginTop: "5px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  reject: {
    width: "10%",
    marginLeft: "5px",
    marginTop: "5px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },

  mtrlVal: {
    width: "30%",
    marginLeft: "10px",
    fontSize: "9px",
    fontWeight: "bold",
    marginTop: "5px",
  },
  linegap2: {
    width: "15%",
  },

  para1Val: {
    width: "10%",
    marginLeft: "5px",
    fontSize: "9px",
    marginTop: "5px",
  },
  para2Val: {
    width: "10%",
    marginLeft: "5px",
    fontSize: "9px",
    marginTop: "5px",
  },
  usedVal: {
    width: "10%",
    marginLeft: "15px",
    fontSize: "9px",
    marginTop: "5px",
  },
  rejectVal: {
    width: "10%",
    marginLeft: "15px",
    fontSize: "9px",
    marginTop: "5px",
  },
  issuedByReceivedBy: {
    width: "45%",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
    // textDecoration: "underline",
  },
  lastText: {
    width: "45%",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: 11,
  },
  emptyWholeBlock: {
    width: "100%",
  },
  logoImage: {
    width: "50px",
    marginLeft: "10px",
  },
  companyInfo: {
    marginTop: "5px",
    marginLeft: "20%",
    width: "60%",
    fontSize: "9px",
    alignSelf: "center",
  },

  issueTime: {
    width: "10%",
    marginLeft: "15px",
    fontSize: "9px",
    marginTop: "5px",
  },
});

const PrintIVListProfileCuttingTable1 = ({
  formHeader,
  tableData,
  PDFData,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.tableContainer}>
        {/* <Text style={styles.title1}>
          Magod Laser Machining Pvt Ltd : Jigani
        </Text>
        <Text style={styles.title2}>Material : Floor Issue</Text> */}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image src={MLLogo} style={styles.logoImage} />

          <View>
            <View style={{ justifyContent: "center" }}>
              <Text style={[styles.title1, { textDecoration: "underline" }]}>
                Material : Floor Issue
              </Text>
            </View>

            <View style={{ justifyContent: "center" }}>
              <Text style={styles.title2}>{PDFData.RegisteredName}</Text>
            </View>
            <View style={{ justifyContent: "center" }}>
              <Text style={{ ...styles.companyInfo, marginLeft: "100px" }}>
                GSTIN: {PDFData.GST_No}, CIN: {PDFData.CIN_No}
              </Text>
            </View>

            <View style={{ justifyContent: "center" }}>
              <Text style={{ ...styles.companyInfo, marginLeft: "70px" }}>
                {PDFData.RegistredOfficeAddress}
              </Text>
            </View>

            <View style={{ justifyContent: "center" }}>
              <Text style={{ ...styles.companyInfo }}>
                {PDFData.PhonePrimary} {PDFData.PhoneSecondary}
                {PDFData.Email}
                {PDFData.URL}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.line1}>
          ___________________________________________________________________________________________________________________
        </Text>
        {/* Issue By & Received By */}

        <View style={styles.blockRightAlign}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>IV No</Text>
          <Text style={styles.linegap}>Task No</Text>
          <Text style={styles.linegap}>Customer</Text>
        </View>

        <View style={styles.blockLeftAlign}>
          <Text>{formHeader.IV_No}</Text>
          <Text style={styles.linegap}>{formHeader.TaskNo}</Text>
          <Text style={styles.linegap}>{formHeader.Cust_name}</Text>
        </View>

        <View style={styles.blockRightAlign}>
          <Text>Date</Text>
          <Text style={styles.linegap}>Program No</Text>
        </View>

        <View style={styles.blockLeftAlign}>
          {/* <Text>{formHeader.Isssue_date}</Text> */}
          <Text>
            {formHeader.Isssue_date
              ? new Date(formHeader.Isssue_date).toLocaleDateString("en-GB")
              : ""}
          </Text>
          <Text style={styles.linegap}>{formHeader.NC_ProgramNo}</Text>
        </View>

        {/* <Text style={styles.blockWhole}>IV No : {formHeader.IV_No}</Text>
        <Text style={styles.blockLeftAlign}></Text>
        <Text style={styles.blockRightAlign}>
          Date: {formHeader.Issue_date}{" "}
        </Text>
        <Text style={styles.emptyBlock}></Text>
        <Text style={styles.blockLeftAlign}>Task No: {formHeader.TaskNo}</Text>
        <Text style={styles.blockRightAlign}>
          Program No: {formHeader.NC_ProgramNo}
        </Text>
        <Text style={styles.emptyBlock}></Text>
        <Text style={styles.blockWhole}>Customer: {formHeader.Cust_name} </Text> */}
        <Text style={styles.line1}>
          ___________________________________________________________________________________________________________________
        </Text>

        <View style={styles.blockRightAlign2}>
          <Text>Material</Text>
          <Text style={styles.linegap}>Para 3</Text>
          <Text style={styles.linegap}>Qty Issued</Text>
          {/* <Text style={styles.linegap}>Qty Received</Text> */}

          {/* <Text style={styles.linegap}>Source</Text> */}
        </View>
        <View style={styles.blockLeftAlign2}>
          <Text>{formHeader.Mtrl_Code}</Text>
          <Text style={styles.linegap}>{formHeader.Para3}</Text>
          {/* <Text style={styles.linegap}>{formHeader.Qty}</Text> */}
          <Text style={styles.linegap}>{formHeader.QtyIssued}</Text>
          {/* <Text style={styles.linegap}>{formHeader.CustMtrl}</Text> */}
        </View>

        <View style={styles.blockRightAlign2}>
          <Text>Para 1</Text>
          <Text style={styles.linegap}>Machine</Text>
          <Text style={styles.linegap}>Qty Received</Text>
        </View>
        <View style={styles.blockLeftAlign2}>
          <Text>{formHeader.Para1}</Text>
          <Text style={styles.linegap}>{formHeader.Machine}</Text>
          <Text style={styles.linegap}>{formHeader.Qty}</Text>
        </View>

        <View style={styles.blockRightAlign2}>
          <Text>Para 2</Text>
          <Text style={styles.linegap}>Process</Text>
          <Text style={styles.linegap}>Source</Text>
        </View>
        <View style={styles.blockLeftAlign2}>
          <Text>{formHeader.Para2}</Text>
          <Text style={styles.linegap}>{formHeader.MProcess}</Text>
          <Text style={styles.linegap}>{formHeader.CustMtrl}</Text>
        </View>

        {/* <Text style={styles.blockWhole}>Material : {formHeader.Mtrl_Code}</Text>
        <Text style={styles.blockLeftAlign}>Length: {formHeader.Para1}</Text>
        <Text style={styles.blockLeftAlign}>Width: {formHeader.Para2}</Text>
        <Text style={styles.blockLeftAlign}>Height: {formHeader.Para3}</Text>
        <Text style={styles.blockLeftAlign}>Qty: {formHeader.Qty}</Text>
        <Text style={styles.blockLeftAlign}>Machine: {formHeader.Machine}</Text>
        <Text style={styles.blockLeftAlign}>
          Process: {formHeader.MProcess}
        </Text>
        <Text style={styles.blockWhole}>Source : Custom</Text> */}
        <Text style={styles.line1}>
          ___________________________________________________________________________________________________________________
        </Text>
        <Text style={styles.mtrlID}>Mtrl ID </Text>
        <Text style={styles.para1}>Para 1</Text>
        <Text style={styles.para2}>Para 2</Text>
        <Text style={styles.used}>Used </Text>
        <Text style={styles.reject}>Reject </Text>

        <Text style={styles.line2}>
          ___________________________________________________________________________________________________________________
        </Text>
        {/* Table Row */}
        {tableData.map((item, index) => {
          return (
            <>
              <Text style={styles.mtrlVal}>{item.ShapeMtrlID}</Text>
              <Text style={styles.para1Val}>{item.Para1}</Text>
              <Text style={styles.para2Val}>{item.Para2}</Text>
              {/* <Text style={styles.usedVal}>{item.Used}</Text> */}
              <Text style={styles.usedVal}></Text>

              {/* <Text style={styles.rejectVal}>{item.Rejected}</Text> */}
              <Text style={styles.rejectVal}></Text>

              {/* <Text style={styles.emptyBlock}></Text> */}
            </>
          );
        })}
        <Text style={styles.line1}>
          ___________________________________________________________________________________________________________________
        </Text>

        {/* Issue By & Received By */}
        <Text style={styles.issuedByReceivedBy}>
          Issued By and Time {formHeader.Issue_time}
        </Text>
        <Text style={styles.issuedByReceivedBy}>Received By and Time</Text>

        <Text style={styles.emptyWholeBlock}> </Text>
        <Text style={styles.emptyWholeBlock}> </Text>
        <Text style={styles.emptyWholeBlock}> </Text>
        <Text style={styles.emptyWholeBlock}> </Text>
        <Text style={styles.issuedByReceivedBy}>Returned By and Time</Text>
        <Text style={styles.issuedByReceivedBy}>Received By and Time</Text>
      </View>
    </Page>
  </Document>
);

export default PrintIVListProfileCuttingTable1;

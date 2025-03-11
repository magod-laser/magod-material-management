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
    // margin: "30px",
    marginTop: 30,
    marginBottom: 50,
    paddingBottom: 50,
  },

  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
    border: "1px solid black",
    paddingTop: "10px",
    paddingBottom: "10px",
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

  line1: {
    marginTop: "8px",
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
    width: "10%",
    textAlign: "left",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  blockLeftAlign: {
    width: "20%",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
  },
  blockLeftAlignBigger: {
    width: "50%",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
  },
  linegap: {
    marginTop: "5px",
  },

  assemblyPartList: {
    width: "100%",
    marginTop: "15px",
    marginLeft: "10px",
    fontSize: "9px",
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  partQuantity: {
    width: "100%",
    marginTop: "5px",
    marginLeft: "470px",
    fontSize: "9px",
    fontWeight: "bold",
    textDecoration: "underline",
    fontFamily: "Helvetica-Bold",
  },
  // tableHeader: {
  //   width: "100%",
  //   marginTop: "5px",
  //   fontSize: 10,
  // },
  partID: {
    width: "30%",
    marginLeft: "10px",
    marginTop: "5px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  rvNO: {
    width: "40%",
    marginTop: "5px",
    marginLeft:'5px',
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  issued: {
    width: "7%",
    marginLeft: "20px",
    marginTop: "5px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  used: {
    width: "7%",
    marginLeft: "10px",
    marginTop: "5px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },
  returned: {
    width: "7%",
    marginLeft: "0px",
    marginTop: "5px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
  },

  partIDVal: {
    width: "30%",
    marginLeft: "10px",
    fontSize: "9px",
    fontWeight: "bold",
    marginTop: "10px",
    textDecoration: "underline",
  },
  linegap2: {
    width: "15%",
  },

  rvNOVal: {
    width: "40%",
    marginLeft: "5px",
    fontSize: "9px",
    marginTop: "10px",
  },
  issuedVal: {
    width: "7%",
    marginLeft: "5px",
    fontSize: "9px",
    marginTop: "10px",
    textAlign:'right',
  },
  usedVal: {
    width: "7%",
    marginLeft: "5px",
    fontSize: "9px",
    marginTop: "10px",
  },
  returnedVal: {
    width: "7%",
    marginLeft: "5px",
    fontSize: "9px",
    marginTop: "10px",
  },
  issuedByReceivedBy: {
    width: "45%",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
    textDecoration: "underline",
    fontFamily: "Helvetica-Bold",
  },
  lastText: {
    width: "45%",
    marginLeft: "10px",
    marginTop: "10px",
    fontSize: "9px",
    fontFamily: "Helvetica-Bold",
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
});

const PrintIVListServicePartTable = ({ formHeader, tableData, PDFData }) => {
  // let previousPartId = null;

  const groupedTableData = tableData.reduce((acc, item) => {
    if (!acc[item.PartId]) {
      acc[item.PartId] = [];
    }
    acc[item.PartId].push(item);
    return acc;
  }, {});

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.tableContainer}>
          {/* <Image src={MLLogo} style={styles.logoImage} />
        
         
        <Text style={styles.title1}>Magod Laser Machining Pvt Ltd : Jigni</Text>

        <Text style={styles.title2}>
          Production : Assembly Parts Issue Voucher
        </Text> */}
          {/* marginLeft: "127px" */}

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image src={MLLogo} style={styles.logoImage} />
            {/* {logoBase64 && <Image src={logoBase64} style={styles.logoImage} />} */}

            <View>
              <View style={{ justifyContent: "center" }}>
                <Text style={[styles.title1, { textDecoration: "underline" }]}>
                Material : Shop Floor Issue
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

          <View style={styles.blockRightAlign}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>IV No</Text>
            <Text style={styles.linegap}>Date</Text>
            <Text style={styles.linegap}>Task No</Text>
            <Text style={styles.linegap}>Program No</Text>
            <Text style={styles.linegap}>Set Issued</Text>
            <Text style={styles.linegap}>Set Returned</Text>
          </View>
          <View style={styles.blockLeftAlign}>
            <Text>{formHeader?.IV_No}</Text>
            <Text style={styles.linegap}>{formHeader.Issue_date}</Text>
            <Text style={styles.linegap}>{formHeader.TaskNo}</Text>
            <Text style={styles.linegap}>{formHeader.NCProgramNo}</Text>
            <Text style={styles.linegap}>{formHeader.QtyIssued}</Text>
          </View>

          <View style={styles.blockRightAlign}>
            <Text>Customer</Text>
            <Text style={styles.linegap}>Assy Name</Text>
            <Text style={styles.linegap}>Operation</Text>
            <Text style={styles.linegap}>Mtrl Code</Text>
            <Text style={styles.linegap}>Machine</Text>
            <Text style={styles.linegap}>Remarks</Text>
          </View>

          <View style={styles.blockLeftAlignBigger}>
            <Text>{formHeader.Cust_name}</Text>
            <Text style={styles.linegap}>{formHeader.AssyName}</Text>
            <Text style={styles.linegap}>{formHeader.Operation}</Text>
            <Text style={styles.linegap}>{formHeader.Mtrl_Code}</Text>
            <Text style={styles.linegap}>{formHeader.Machine}</Text>
            <Text style={styles.linegap}>{formHeader.Remarks}</Text>
          </View>
          <Text style={styles.line1}>
            ___________________________________________________________________________________________________________________
          </Text>
          <Text style={styles.assemblyPartList}>Assembly Parts List</Text>
          <Text style={styles.partQuantity}>Part Quantity</Text>
          {/* Table Header */}
          <View></View>
          <Text style={styles.partID}>Part ID</Text>
          <Text style={styles.rvNO}>RV No</Text>
          <Text style={styles.issued}>Issued</Text>
          <Text style={styles.used}>Used</Text>
          <Text style={styles.returned}>Returned</Text>
          <Text style={styles.line2}>
            ___________________________________________________________________________________________________________________
          </Text>
          {/* Table Row */}
          {/* {tableData.map((item, index) => {
            const renderPartId = item.PartId !== previousPartId;
            previousPartId = item.PartId;
            return (
              <>
                
                <Text style={styles.partIDVal}>
                  {renderPartId && item.PartId}
                </Text>

                <Text style={styles.rvNOVal}>
                  {item.RV_No}({item.CustDocuNo})
                </Text>
                <Text style={styles.issuedVal}>{item.QtyIssued}</Text>
                <Text style={styles.usedVal}></Text>
                <Text style={styles.returnedVal}></Text>
                
                {tableData[index + 1]?.PartId !== item.PartId && (
                  <Text style={styles.line2}>
                    ______________________________________________________________________________________________
                  </Text>
                )}
              </>
            );
          })} */}
          {Object.values(groupedTableData).map((group, groupIndex) => {
            return (
              <React.Fragment key={groupIndex}>
                {group.map((item, itemIndex) => {
                  const renderPartId = itemIndex === 0;
                  return (
                    <React.Fragment key={itemIndex}>
                      <Text style={styles.partIDVal}>
                        {renderPartId && item.PartId}
                      </Text>
                      <Text style={styles.rvNOVal}>
                        {item.RV_No}({item.CustDocuNo})
                      </Text>
                      <Text style={styles.issuedVal}>{item.QtyIssued}</Text>
                      <Text style={styles.usedVal}></Text>
                      <Text style={styles.returnedVal}></Text>
                    </React.Fragment>
                  );
                })}

                {groupIndex < Object.values(groupedTableData).length - 1 && (
                  <Text style={styles.line2}>
                    ___________________________________________________________________________________________________________________
                  </Text>
                )}
              </React.Fragment>
            );
          })}

          <Text style={styles.line2}>
            ___________________________________________________________________________________________________________________
          </Text>

          {/* Issue By & Received By */}
          <Text style={styles.issuedByReceivedBy}>Issued By</Text>
          <Text style={styles.issuedByReceivedBy}>Received By</Text>
          <Text style={styles.lastText}>Name</Text>
          <Text style={styles.lastText}>Name</Text>
          <Text style={styles.lastText}>Signature</Text>
          <Text style={styles.lastText}>Signature</Text>
          <Text style={styles.lastText}>Date</Text>
          <Text style={styles.lastText}>Date</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PrintIVListServicePartTable;

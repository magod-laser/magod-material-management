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
// import MLLogo from "../../../../../../frontend/src/ML-LOGO.png"
import MLLogo from "../../../../../src/ML-LOGO.png";

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
  fontBold: {
    //   fontWeight: "bold",
    fontSize: "10px",
    fontFamily: "Helvetica-Bold",
  },

  topspace: {
    width: "100%",
    marginTop: "100px",
  },
  titleFull: {
    //border: "1px",
    padding: "5px",
    width: "100%",
    // fontWeight: "bold",
    //fontSize: "11px",
  },

  titleMiddle2: {
    padding: "5px",
    // width: "30%",
    //fontSize: "12px",
  },

  tableCol1: {
    padding: "5px",
    width: "9%",
  },
  tableCol2: {
    padding: "5px",
    width: "60%",
    // fontWeight: "bold",
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

//return <div>PrintMaterialDCTable</div>;
//}

const copiesNames = [
  { copyName: "Original for Recipient" },
  { copyName: "Transporter Copy" },
  // { copyName: "Accounts Copy" },
  { copyName: "Extra Copy" },
];

export default function PrintMaterialDCTable(props) {
  return (
    <>
      <Document>
        {copiesNames.map((copyVal, copyKey) => (
          <>
            <Page size="A4" style={{ ...styles.pageStyling }}>
              <View>
                {/* Top */}
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
                      //   justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <Text>{"   "}</Text> */}
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
                {/* <View
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
            <Text style={{ fontWeight: "700" }}>
              Magod Laser Machining Pvt. Ltd.
            </Text>
            <Text style={{ fontWeight: "700" }}>
              GSTIN: 29AABCM1970H1ZE, CIN: U28900KA1995PTC018437
            </Text>
            <Text>
              #71 & 72, Phase II, KIADB Indl Area, Jigani, Anekal Taluk,
              Bengaluru - 560105
            </Text>
            <Text>
              +91-80-42291005, +91-8110-414313, info@magodlaser.in,
              https://www.magodlaser.in/
            </Text>
          </View>
          <Text style={{ padding: "3%" }}></Text>
        </View> */}
                <Text style={{ padding: "0.5%" }}></Text>
                <View style={{ border: "1px" }}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <View
                      style={{
                        ...styles.insideBox,
                        width: "70%",
                        // borderBottom: "1px",
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

                        {/* <View style={{ display: "flex", flexDirection: "row" }}> */}
                        <Text>{props.custdata?.Address}</Text>
                        <Text>
                          {props.custdata?.City}, {props.custdata?.State} -{" "}
                          {props.custdata?.Pin_Code}
                        </Text>
                        {/* <Text>
                  {props.custdata?.City} 
                </Text> */}
                        {/* <Text></Text> */}
                        {/* </View> */}
                      </View>
                    </View>

                    <View
                      style={{
                        ...styles.insideBox,
                        width: "30%",
                        display: "flex",
                        flexDirection: "column",
                        // justifyContent: "center",
                        // borderBottom: "1px",
                        // borderRight: "1px",
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
                  {/* <View style={{ ...styles.titleRight1 }}></View> */}
                  {/* <Text style={styles.titleFull1}> */}
                  {/* <View style={{ ...styles.insideBox }}>
                <View style={{ display: "flex", flexDirection: "row" }}>
                  <Text style={{ ...styles.fontBold }}>Authority : </Text>
                  <Text>{props.dcRegister?.AuhtorisingDocu}</Text>
                </View>
              </View> */}
                  {/* <Text style={styles.topspace}></Text> */}
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
                    <Text style={styles.tableCol2}>Description</Text>
                    <Text style={styles.tableCol3}>Material</Text>
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
                            <Text style={styles.tableCol2}>
                              {item.MtrlDescription}
                              {/* {
                            item.MtrlDescription?.split("/**")[0]
                              ?.split(".00")[0]
                              ?.replace(/[0-9]/g, "")
                              ?.split("Quantity")[0]
                          } */}
                            </Text>
                            <Text style={styles.tableCol3}>
                              {item.Material}
                            </Text>
                            <Text style={styles.tableCol4}>{item.Qty}</Text>
                          </View>
                        </>
                      );
                    })}
                  </View>
                  {/* <Text style={styles.topspace}></Text>
          <Text style={styles.topspace}></Text>
          <Text style={styles.topspace}></Text>
          <Text style={styles.topspace}></Text> */}
                  {/* <Text style={styles.titleLeft1}></Text> */}
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
                      // borderBottom:'1px',
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
                      {/* <Text style={{ ...styles.fontBold }}>
                        Total Quantity :{" "}
                      </Text>
                      <Text>{props.totalQTYVar}</Text> */}
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
                        Total Weight / Quantity :{" "}
                      </Text>
                      <Text>{props.formHeader.TotalWeight}</Text>
                    </View>
                  </View>
                  <View style={{ ...styles.insideBox }}>
                    <View>
                      <Text>{props.PDFData.DCterms}</Text>
                    </View>
                    {/* <View>
                      <Text style={{ ...styles.fontBold }}>
                        SUBJECT TO BANGALORE JURISDICTION
                      </Text>
                    </View> */}
                  </View>
                  <View
                    style={{
                      ...styles.insideBox,
                      ...styles.fontBold,
                      display: "flex",
                      flexDirection: "row",
                      // height: "42px",
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
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        {/* <Text style={{ padding: "6%" }}></Text> */}

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
                          // alignItems: "space-between",
                          // justifyContent: "center",
                        }}
                      >
                        <Text>For, {props.PDFData.RegisteredName}</Text>
                        <Text style={{ padding: "5%" }}></Text>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
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

// const PrintMaterialDCTable = ({
//   props.formHeader,
//   props.outData,
//   props.custdata,
//   props.dcRegister,
//   props.totalQTYVar,
// }) => (

//   <Document>
//     {copiesNames.map((copyVal, copyKey) => (
//       <>
//         <Page size="A4" style={{ ...styles.pageStyling }}>
//           <View>
//             {/* Top */}
//             <View
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Image src={MLLogo} style={{ width: "8.3%" }} />
//               <View
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   //   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 {/* <Text>{"   "}</Text> */}
//                 <View style={{ borderBottom: "1px" }}>
//                   <Text style={{ ...styles.fontBold }}>
//                     Material / Scrap Sheets Return Challan
//                   </Text>
//                 </View>
//                 <Text style={{ ...styles.fontBold }}>
//                   Magod Laser Machining Private Limited
//                 </Text>
//                 <Text style={{ ...styles.fontBold }}>
//                   GST: 29AABCM1970H1ZE CIN: U28900KA1995PTC018437
//                 </Text>
//                 <Text>
//                   Plot No 72, 2nd Phase, KIADB Indl Area Jigani, Anekal Taluk
//                   Bengaluru - 560105
//                 </Text>
//                 <Text>
//                   Ph : 08110 414313, 9513393352, sales@magodlaser.in,
//                   www.magodlaser.in
//                 </Text>
//               </View>
//               <Text style={{ width: "10%" }}>{copyVal.copyName}</Text>
//             </View>
//             {/* <View
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//           }}
//         >
//           <Image src={MLLogo} style={{ width: "8.3%" }} />
//           <View
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontWeight: "700" }}>
//               Magod Laser Machining Pvt. Ltd.
//             </Text>
//             <Text style={{ fontWeight: "700" }}>
//               GSTIN: 29AABCM1970H1ZE, CIN: U28900KA1995PTC018437
//             </Text>
//             <Text>
//               #71 & 72, Phase II, KIADB Indl Area, Jigani, Anekal Taluk,
//               Bengaluru - 560105
//             </Text>
//             <Text>
//               +91-80-42291005, +91-8110-414313, info@magodlaser.in,
//               https://www.magodlaser.in/
//             </Text>
//           </View>
//           <Text style={{ padding: "3%" }}></Text>
//         </View> */}
//             <Text style={{ padding: "0.5%" }}></Text>
//             <View style={{ border: "1px" }}>
//               <View style={{ display: "flex", flexDirection: "row" }}>
//                 <View
//                   style={{
//                     ...styles.insideBox,
//                     width: "70%",
//                     // borderBottom: "1px",
//                     borderRight: "1px",
//                   }}
//                 >
//                   <Text style={{ ...styles.fontBold }}>
//                     {props.formHeader?.Customer} ({props.formHeader?.Cust_code})
//                   </Text>
//                   <View style={{ padding: "0.6%" }}>
//                     <View style={{ display: "flex", flexDirection: "row" }}>
//                       <Text style={{ ...styles.fontBold }}>GSTIN : </Text>
//                       <Text>{props.custdata?.GSTNo}</Text>
//                     </View>

//                     <View style={{ display: "flex", flexDirection: "row" }}>
//                       <Text style={{ ...styles.fontBold }}>Branch:</Text>

//                       <Text>{props.custdata?.Branch}</Text>
//                     </View>

//                     {/* <View style={{ display: "flex", flexDirection: "row" }}> */}
//                     <Text>{props.custdata?.Address}</Text>
//                     <Text>
//                       {props.custdata?.City}, {props.custdata?.State} - {props.custdata?.Pin_Code}
//                     </Text>
//                     {/* <Text>
//                   {props.custdata?.City}
//                 </Text> */}
//                     {/* <Text></Text> */}
//                     {/* </View> */}
//                   </View>
//                 </View>

//                 <View
//                   style={{
//                     ...styles.insideBox,
//                     width: "30%",
//                     display: "flex",
//                     flexDirection: "column",
//                     // justifyContent: "center",
//                     // borderBottom: "1px",
//                     // borderRight: "1px",
//                   }}
//                 >
//                   <View style={{ display: "flex", flexDirection: "row" }}>
//                     <Text style={{ ...styles.fontBold }}>DC No : </Text>
//                     <Text>{props.formHeader?.PkngDcNo}</Text>
//                   </View>{" "}
//                   <View style={{ display: "flex", flexDirection: "row" }}>
//                     <Text style={{ ...styles.fontBold }}>IV No : </Text>
//                     <Text>{props.formHeader?.IV_No}</Text>
//                   </View>
//                   <View style={{ display: "flex", flexDirection: "row" }}>
//                     <Text style={{ ...styles.fontBold }}>IV Date : </Text>
//                     <Text>{props.formHeader?.IV_Date}</Text>
//                   </View>
//                 </View>
//               </View>
//               {/* <View style={{ ...styles.titleRight1 }}></View> */}
//               {/* <Text style={styles.titleFull1}> */}
//               {/* <View style={{ ...styles.insideBox }}>
//                 <View style={{ display: "flex", flexDirection: "row" }}>
//                   <Text style={{ ...styles.fontBold }}>Authority : </Text>
//                   <Text>{props.dcRegister?.AuhtorisingDocu}</Text>
//                 </View>
//               </View> */}
//               {/* <Text style={styles.topspace}></Text> */}
//               <View
//                 style={{
//                   ...styles.insideBox,
//                   ...styles.fontBold,
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "flex-start",
//                 }}
//               >
//                 <Text style={styles.tableCol1}>SL No</Text>
//                 <Text style={styles.tableCol2}>Description</Text>
//                 <Text style={styles.tableCol3}>Material</Text>
//                 <Text style={styles.tableCol4}>Quantity</Text>
//               </View>
//               <View
//                 style={{
//                   ...styles.insideBox,
//                   display: "flex",
//                   flexDirection: "column",
//                 }}
//               >
//                 {props.outData?.map((item, index) => {
//                   return (
//                     <>
//                       <View
//                         style={{
//                           display: "flex",
//                           flexDirection: "row",
//                           justifyContent: "flex-start",
//                         }}
//                       >
//                         <Text style={styles.tableCol1}>{index + 1}</Text>
//                         <Text style={styles.tableCol2}>
//                           {item.MtrlDescription}
//                           {/* {
//                             item.MtrlDescription?.split("/**")[0]
//                               ?.split(".00")[0]
//                               ?.replace(/[0-9]/g, "")
//                               ?.split("Quantity")[0]
//                           } */}
//                         </Text>
//                         <Text style={styles.tableCol3}>{item.Material}</Text>
//                         <Text style={styles.tableCol4}>{item.Qty}</Text>
//                       </View>
//                     </>
//                   );
//                 })}
//               </View>
//               {/* <Text style={styles.topspace}></Text>
//           <Text style={styles.topspace}></Text>
//           <Text style={styles.topspace}></Text>
//           <Text style={styles.topspace}></Text> */}
//               {/* <Text style={styles.titleLeft1}></Text> */}
//               <View style={{ padding: "1%" }}></View>
//               <View
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   padding: "0.6%",
//                 }}
//               >
//                 <Text style={{ ...styles.fontBold }}>Remarks :</Text>
//                 <View
//                   style={{
//                     ...styles.insideBox,
//                     border: "1px",
//                     minHeight: "48px",
//                     display: "flex",
//                     alignContent: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Text>{props.formHeader?.RV_Remarks}</Text>
//                 </View>
//               </View>
//               <View
//                 style={{
//                   ...styles.insideBox,
//                   // borderBottom:'1px',
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "space-around",
//                 }}
//               >
//                 <View
//                   style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     ...styles.titleMiddle2,
//                   }}
//                 >
//                   {/* <Text style={{ ...styles.fontBold }}>Total Quantity : </Text>
//                   <Text>{props.totalQTYVar}</Text> */}
//                   <Text style={{ ...styles.fontBold }}>Total Items : </Text>
//                   <Text>{props.outData?.length}</Text>
//                 </View>

//                 <View
//                   style={{
//                     display: "flex",
//                     flexDirection: "row",
//                     ...styles.titleMiddle2,
//                   }}
//                 >
//                   <Text style={{ ...styles.fontBold }}>Total Weight : </Text>
//                   <Text>{props.formHeader.TotalWeight}</Text>
//                 </View>
//               </View>
//               <View style={{ ...styles.insideBox }}>
//                 <View>
//                   <Text>
//                     Please receive the above goods return to us the duplicate
//                     copy of the "Delivery Challan" duly stamped and receipted in
//                     acknowledgement of having received the material in good
//                     condition. Any issues on this transactions, kindly initmate
//                     to us in writing within 3 days from the date of receipt.
//                   </Text>
//                 </View>
//                 <View>
//                   <Text style={{ ...styles.fontBold }}>
//                     SUBJECT TO BANGALORE JURISDICTION
//                   </Text>
//                 </View>
//               </View>
//               <View
//                 style={{
//                   ...styles.insideBox,
//                   ...styles.fontBold,
//                   display: "flex",
//                   flexDirection: "row",
//                   // height: "42px",
//                   border: "none",
//                 }}
//               >
//                 <View
//                   style={{
//                     width: "50%",
//                     display: "flex",
//                     flexDirection: "row",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <View
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       alignItems: "flex-end",
//                     }}
//                   >
//                     {/* <Text style={{ padding: "6%" }}></Text> */}

//                     <Text> </Text>
//                     <Text style={{ padding: "3%" }}></Text>
//                     <Text>Customer Signature with Seal</Text>
//                   </View>
//                 </View>
//                 <View
//                   style={{
//                     width: "50%",
//                     display: "flex",
//                     flexDirection: "row",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <View
//                     style={{
//                       display: "flex",
//                       flexDirection: "column",
//                       // alignItems: "space-between",
//                       // justifyContent: "center",
//                     }}
//                   >
//                     <Text>For MAGOD LASER MACHINING PVT. LTD.</Text>
//                     <Text style={{ padding: "5%" }}></Text>
//                     <View
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <Text>Authorised Signatory</Text>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </Page>
//       </>
//     ))}
//   </Document>
// );

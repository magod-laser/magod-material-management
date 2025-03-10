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

  headercol1: {
    width: "22%",
    // fontWeight: "bold",
    // fontSize: "12px",
    paddingLeft: "20px",
    // marginTop: "5px",
  },

  col1: {
    width: "35%",
    // fontWeight: "bold",
    // fontSize: "10px",
    paddingLeft: "25px",
    // marginTop: "5px",
  },

  col2: {
    width: "12%",
    // fontWeight: "bold",
    // fontSize: "10px",
    // marginTop: "5px",
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
                {/* <Text>{"   "}</Text> */}
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

              {/* <View
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
            <Text>Location Material Stock Summary</Text>
          </View> */}
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
              {/* <Text style={styles.line1}>
            _________________________________________________________________________________________
          </Text> */}
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
              {/* <Text style={styles.line1}>
            _________________________________________________________________________________________
          </Text> */}
              {props.tableData.map((item, index) => (
                <>
                  <View
                    style={{
                      ...styles.insideBox,
                      display: "flex",
                      flexDirection: "column",
                      // justifyContent: "space-between",
                    }}
                  >
                    {/* <Text style={styles.title1}>{item.customer}</Text> */}
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
                    {/* </View> */}
                    {/* <Text style={styles.line1}>
                  _________________________________________________________________________________________
                </Text> */}
                    {item.rawlength !== 0 ? (
                      <>
                        <View
                          style={{
                            // ...styles.insideBox,
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
                          {/* <Text style={styles.title2}>Raw Material</Text> */}
                        </View>
                        <View
                          style={{
                            ...styles.insideBox,
                            display: "flex",
                            flexDirection: "column",
                            // justifyContent: "space-between",
                          }}
                        >
                          {item.rawMaterial.map((item, index) => (
                            <>
                              <View
                                style={{
                                  // ...styles.insideBox,
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
                        {/* <Text style={styles.line1}>
                      _________________________________________________________________________________________
                    </Text> */}

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
                        {/* <Text style={styles.line1}>
                     
                        _________________________________________________________________________________________
                      </Text> */}
                      </>
                    ) : (
                      <></>
                    )}

                    {item.scraplength !== 0 ? (
                      <>
                        <View
                          style={{
                            // ...styles.insideBox,
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
                          {/* <Text style={styles.title2}>Raw Material</Text> */}
                        </View>
                        <View
                          style={{
                            ...styles.insideBox,
                            display: "flex",
                            flexDirection: "column",
                            // justifyContent: "space-between",
                          }}
                        >
                          {item.scrapMaterial.map((item, index) => (
                            <>
                              <View
                                style={{
                                  // ...styles.insideBox,
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
                        {/* <Text style={styles.line1}>
                      _________________________________________________________________________________________
                    </Text> */}

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
                        {/* <Text style={styles.line1}>
                     
                        _________________________________________________________________________________________
                      </Text> */}
                      </>
                    ) : (
                      <></>
                    )}

                    {/* for scrap */}
                    {/* {item.scraplength !== 0 ? (
                    <>
                      <Text style={styles.title2}>Scrap Material</Text>

                      {item.scrapMaterial.map((item, index) => {
                        return (
                          <>
                            <Text style={styles.col1}>{item.Mtrl_Code}</Text>
                            <Text style={styles.col2}>{item.DynamicPara1}</Text>
                            <Text style={styles.col2}>{item.DynamicPara2}</Text>
                            <Text style={styles.col2}>{item.Quantity}</Text>
                            <Text style={styles.col2}>{item.Weight}</Text>
                            <Text style={styles.col2}>{item.SWeight}</Text>
                          </>
                        );
                      })}
                      <Text style={styles.line1}>
                        _________________________________________________________________________________________
                      </Text>
                      <Text style={styles.col1}></Text>
                      <Text style={styles.col2}></Text>
                      <Text style={styles.col2}></Text>
                      <Text style={styles.col2}>{item.tot2wt}</Text>
                      <Text style={styles.col2}>{item.tot2swt}</Text>
                      <Text style={styles.col2}>{item.tot2qty}</Text>
                      <Text style={styles.line1}>
                        _________________________________________________________________________________________
                      </Text>
                    </>
                  ) : (
                    <></>
                  )} */}
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

// //return <div>PrintMaterialDCTable</div>;
// //}
// const PrintLocationStockSummaryTableReport = (props) => (
//   <Document>
//     <Page size="A4" style={{ padding: "3%", fontSize: "11" }}>
//       <View>
//         {/* top */}
//         <View
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
//             <Text>Location Material Stock Summary</Text>
//           </View>
//           <Text style={{ padding: "3%" }}></Text>
//         </View>
//         <Text style={{ padding: "1%" }}></Text>
//         <View style={{ border: "1px" }}>
//           <View
//             style={{
//               ...styles.insideBox,
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//             }}
//           >
//             <Text style={styles.headercol1}>
//               Location : {props.formHeader.LocationNo}
//             </Text>
//             <Text style={styles.headercol1}>
//               Type : {props.formHeader.StorageType}
//             </Text>
//             <Text style={styles.headercol1}>
//               Capacity : {props.formHeader.Capacity}
//             </Text>
//             <Text style={styles.headercol1}>
//               Current Usage : {props.formHeader.CapacityUtilised}
//             </Text>
//           </View>
//           {/* <Text style={styles.line1}>
//             _________________________________________________________________________________________
//           </Text> */}
//           <View
//             style={{
//               ...styles.insideBox,
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "flex-start",
//             }}
//           >
//             <Text style={styles.col1}>Material</Text>
//             <Text style={styles.col2}>Length</Text>
//             <Text style={styles.col2}>Width</Text>
//             <Text style={styles.col2}>Quantity</Text>
//             <Text style={styles.col2}>Weight</Text>
//             <Text style={styles.col2}>Scrap Weight</Text>
//           </View>
//           {/* <Text style={styles.line1}>
//             _________________________________________________________________________________________
//           </Text> */}
//           {props.tableData.map((item, index) => {
//             return (
//               <>
//                 <View
//                   style={{
//                     ...styles.insideBox,
//                     display: "flex",
//                     flexDirection: "column",
//                     // justifyContent: "space-between",
//                   }}
//                 >
//                   {/* <Text style={styles.title1}>{item.customer}</Text> */}
//                   <View
//                     style={{
//                       ...styles.insideBox,
//                       display: "flex",
//                       flexDirection: "row",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <Text>{item.customer}</Text>
//                   </View>
//                   {/* </View> */}
//                   {/* <Text style={styles.line1}>
//                   _________________________________________________________________________________________
//                 </Text> */}
//                   {item.rawlength !== 0 ? (
//                     <>
//                       <View
//                         style={{
//                           // ...styles.insideBox,
//                           display: "flex",
//                           flexDirection: "row",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <Text style={styles.insideBox}>Raw Material</Text>
//                         {/* <Text style={styles.title2}>Raw Material</Text> */}
//                       </View>
//                       <View
//                         style={{
//                           ...styles.insideBox,
//                           display: "flex",
//                           flexDirection: "column",
//                           // justifyContent: "space-between",
//                         }}
//                       >
//                         {item.rawMaterial.map((item, index) => {
//                           return (
//                             <>
//                               <View
//                                 style={{
//                                   // ...styles.insideBox,
//                                   display: "flex",
//                                   flexDirection: "row",
//                                   justifyContent: "flex-start",
//                                 }}
//                               >
//                                 <Text style={styles.col1}>
//                                   {item.Mtrl_Code}
//                                 </Text>
//                                 <Text style={styles.col2}>
//                                   {item.DynamicPara1}
//                                 </Text>
//                                 <Text style={styles.col2}>
//                                   {item.DynamicPara2}
//                                 </Text>
//                                 <Text style={styles.col2}>{item.Quantity}</Text>
//                                 <Text style={styles.col2}>
//                                   {parseFloat(item.Weight).toFixed(2)}
//                                 </Text>
//                                 <Text style={styles.col2}>
//                                   {parseFloat(item.SWeight).toFixed(2)}
//                                 </Text>
//                               </View>
//                             </>
//                           );
//                         })}
//                       </View>
//                       {/* <Text style={styles.line1}>
//                       _________________________________________________________________________________________
//                     </Text> */}

//                       <View
//                         style={{
//                           ...styles.insideBox,
//                           display: "flex",
//                           flexDirection: "row",
//                           justifyContent: "flex-start",
//                         }}
//                       >
//                         <Text style={styles.col1}></Text>
//                         <Text style={styles.col2}></Text>
//                         <Text style={styles.col2}></Text>
//                         <Text style={styles.col2}>{item.tot1qty}</Text>
//                         <Text style={styles.col2}>
//                           {parseFloat(item?.tot1wt).toFixed(2)}
//                         </Text>
//                         <Text style={styles.col2}>
//                           {parseFloat(item.tot1swt).toFixed(2)}
//                         </Text>
//                       </View>
//                       {/* <Text style={styles.line1}>

//                         _________________________________________________________________________________________
//                       </Text> */}
//                     </>
//                   ) : (
//                     <></>
//                   )}

//                   {item.scraplength !== 0 ? (
//                     <>
//                       <View
//                         style={{
//                           // ...styles.insideBox,
//                           display: "flex",
//                           flexDirection: "row",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <Text style={styles.insideBox}>Scrap Material</Text>
//                         {/* <Text style={styles.title2}>Raw Material</Text> */}
//                       </View>
//                       <View
//                         style={{
//                           ...styles.insideBox,
//                           display: "flex",
//                           flexDirection: "column",
//                           // justifyContent: "space-between",
//                         }}
//                       >
//                         {item.scrapMaterial.map((item, index) => {
//                           return (
//                             <>
//                               <View
//                                 style={{
//                                   // ...styles.insideBox,
//                                   display: "flex",
//                                   flexDirection: "row",
//                                   justifyContent: "flex-start",
//                                 }}
//                               >
//                                 <Text style={styles.col1}>
//                                   {item.Mtrl_Code}
//                                 </Text>
//                                 <Text style={styles.col2}>
//                                   {item.DynamicPara1}
//                                 </Text>
//                                 <Text style={styles.col2}>
//                                   {item.DynamicPara2}
//                                 </Text>
//                                 <Text style={styles.col2}>{item.Quantity}</Text>
//                                 <Text style={styles.col2}>
//                                   {parseFloat(item.Weight).toFixed(2)}
//                                 </Text>
//                                 <Text style={styles.col2}>
//                                   {parseFloat(item.SWeight).toFixed(2)}
//                                 </Text>
//                               </View>
//                             </>
//                           );
//                         })}
//                       </View>
//                       {/* <Text style={styles.line1}>
//                       _________________________________________________________________________________________
//                     </Text> */}

//                       <View
//                         style={{
//                           ...styles.insideBox,
//                           display: "flex",
//                           flexDirection: "row",
//                           justifyContent: "flex-start",
//                         }}
//                       >
//                         <Text style={styles.col1}></Text>
//                         <Text style={styles.col2}></Text>
//                         <Text style={styles.col2}></Text>
//                         <Text style={styles.col2}>{item.tot2qty}</Text>
//                         <Text style={styles.col2}>
//                           {parseFloat(item.tot2wt).toFixed(2)}
//                         </Text>
//                         <Text style={styles.col2}>
//                           {parseFloat(item.tot2swt).toFixed(2)}
//                         </Text>
//                       </View>
//                       {/* <Text style={styles.line1}>

//                         _________________________________________________________________________________________
//                       </Text> */}
//                     </>
//                   ) : (
//                     <></>
//                   )}

//                   {/* for scrap */}
//                   {/* {item.scraplength !== 0 ? (
//                     <>
//                       <Text style={styles.title2}>Scrap Material</Text>

//                       {item.scrapMaterial.map((item, index) => {
//                         return (
//                           <>
//                             <Text style={styles.col1}>{item.Mtrl_Code}</Text>
//                             <Text style={styles.col2}>{item.DynamicPara1}</Text>
//                             <Text style={styles.col2}>{item.DynamicPara2}</Text>
//                             <Text style={styles.col2}>{item.Quantity}</Text>
//                             <Text style={styles.col2}>{item.Weight}</Text>
//                             <Text style={styles.col2}>{item.SWeight}</Text>
//                           </>
//                         );
//                       })}
//                       <Text style={styles.line1}>
//                         _________________________________________________________________________________________
//                       </Text>
//                       <Text style={styles.col1}></Text>
//                       <Text style={styles.col2}></Text>
//                       <Text style={styles.col2}></Text>
//                       <Text style={styles.col2}>{item.tot2wt}</Text>
//                       <Text style={styles.col2}>{item.tot2swt}</Text>
//                       <Text style={styles.col2}>{item.tot2qty}</Text>
//                       <Text style={styles.line1}>
//                         _________________________________________________________________________________________
//                       </Text>
//                     </>
//                   ) : (
//                     <></>
//                   )} */}
//                 </View>
//               </>
//             );
//           })}
//         </View>
//       </View>
//     </Page>
//   </Document>
// );

// export default PrintLocationStockSummaryTableReport;

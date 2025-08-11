let API = process.env.REACT_APP_API_KEY;

export const endpoints = {
  //customers
  MenuUrlsAPI: `${API}/user/fetchMenuUrls`,
  getCustomers: `${API}/customers/allcustomers`,
  getCustomerByCustCode: `${API}/customers/getCustomerByCustCode`,

  //bom list
  getCustBomList: `${API}/custbomlist/allCustBomList`,
  getCustBomId: `${API}/custbomlist/getCustBomId`,

  //locations
  getMaterialLocationList: `${API}/materiallocationlist/allMaterialLocationList`,
  deleteMaterialLocationList: `${API}/materiallocationlist/deleteMaterialLocationList`,
  updateMaterialLocationList: `${API}/materiallocationlist/updateMaterialLocationList`,
  insertMaterialLocationList: `${API}/materiallocationlist/insertMaterialLocationList`,

  //mtrl data
  getMtrlData: `${API}/mtrlData/allmtrldata`,
  getRowByMtrlCode: `${API}/mtrlData/getRowByMtrlCode`,
  getSpecific_Wt: `${API}/mtrlData/getSpecific_Wt`,
  getGradeID: `${API}/mtrlData/getGradeID`,

  //shape data
  getAllShapes: `${API}/shapes/getAllShapes`,
  getRowByShape: `${API}/shapes/getRowByShape`,
  getAllShapeNames: `${API}/shapes/getAllShapeNames`,

  getPartsCreatedMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Created&type2=Parts`,
  getPartsOpenedMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Received&type2=Parts`,
  getPartsClosedMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Closed&type2=Parts`,
  getPartsCreatedPurchaseMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Created&type2=Parts&type3=Purchase`,
  getPartsOpenedPurchaseMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Received&type2=Parts&type3=Purchase`,
  getPartsClosedPurchaseMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Closed&type2=Parts&type3=Purchase`,

  getUnitsCreatedMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Created&type2=Units`,
  getUnitsOpenedMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Received&type2=Units`,
  getUnitsClosedMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Closed&type2=Units`,
  getUnitsCreatedPurchaseMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Created&type2=Units&type3=Purchase`,
  getUnitsOpenedPurchaseMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Received&type2=Units&type3=Purchase`,
  getUnitsClosedPurchaseMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Closed&type2=Units&type3=Purchase`,

  getSheetsCreatedMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Created&type2=Sheets`,
  getSheetsOpenedMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Received&type2=Sheets`,
  getSheetsClosedMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Closed&type2=Sheets`,
  getSheetsOpenedPurchaseMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Received&type2=Sheets&type3=Purchase`,
  getSheetsCreatedPurchaseMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Created&type2=Sheets&type3=Purchase`,
  getSheetsClosedPurchaseMaterial: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegister?type1=Closed&type2=Sheets&type3=Purchase`,

  //Material Receipt Register
  getByTypeMaterialReceiptRegisterByRvID: `${API}/materialReceiptRegister/getByTypeMaterialReceiptRegisterByRvID`,
  insertHeaderMaterialReceiptRegister: `${API}/materialReceiptRegister/insertHeaderMaterialReceiptRegister`,
  updateHeaderMaterialReceiptRegister: `${API}/materialReceiptRegister/updateHeaderMaterialReceiptRegister`,
  deleteHeaderMaterialReceiptRegisterAndDetails: `${API}/materialReceiptRegister/deleteHeaderMaterialReceiptRegisterAndDetails`,

  //Material Part Receipt Details
  getPartReceiptDetailsByRvID: `${API}/mtrlPartReceiptDetails/getPartReceiptDetailsByRvID`,
  insertPartReceiptDetails: `${API}/mtrlPartReceiptDetails/insertPartReceiptDetails`,
  updatePartReceiptDetails: `${API}/mtrlPartReceiptDetails/updatePartReceiptDetails`,
  deletePartReceiptDetails: `${API}/mtrlPartReceiptDetails/deletePartReceiptDetails`,
  updateQtyReturnedPartReceiptDetails: `${API}/mtrlPartReceiptDetails/updateQtyReturnedPartReceiptDetails`,
  updateQtyReturnedPartReceiptDetails1: `${API}/mtrlPartReceiptDetails/updateQtyReturnedPartReceiptDetails1`,
  updateQtyIssuedPartReceiptDetails: `${API}/mtrlPartReceiptDetails/updateQtyIssuedPartReceiptDetails`,
  updateQtyIssuedPartReceiptDetails1: `${API}/mtrlPartReceiptDetails/updateQtyIssuedPartReceiptDetails1`,
  updateQtyIssuedPartReceiptDetails2: `${API}/mtrlPartReceiptDetails/updateQtyIssuedPartReceiptDetails2`,

  //Material Receipt Details
  getMtrlReceiptDetailsByRvID: `${API}/mtrlReceiptDetails/getMtrlReceiptDetailsByRvID`,
  getMtrlReceiptDetailsByID: `${API}/mtrlReceiptDetails/getMtrlReceiptDetailsByID`,
  insertMtrlReceiptDetails: `${API}/mtrlReceiptDetails/insertMtrlReceiptDetails`,
  updateMtrlReceiptDetails: `${API}/mtrlReceiptDetails/updateMtrlReceiptDetails`,
  updateMtrlReceiptDetailsAfter: `${API}/mtrlReceiptDetails/updateMtrlReceiptDetailsAfter`,
  deleteMtrlReceiptDetails: `${API}/mtrlReceiptDetails/deleteMtrlReceiptDetails`,
  updateMtrlReceiptDetailsUpdated: `${API}/mtrlReceiptDetails/updateMtrlReceiptDetailsUpdated`,
  updateSelectedRowMtrlReceiptDetails: `${API}/mtrlReceiptDetails/updateSelectedRowMtrlReceiptDetails`,

  //running no
  getRunningNo: `${API}/runningNo/getRunningNoBySrlType`,
  updateRunningNo: `${API}/runningNo/updateRunningNoBySrlType`,
  insertRunningNo: `${API}/runningNo/insertRunningNo`,
  getAndInsertRunningNo: `${API}/runningNo/getAndInsertRunningNo`,
  insertRunNoRow: `${API}/runningNo/insertRunNoRow`,
  insertAndGetRunningNo: `${API}/runningNo/insertAndGetRunningNo`,
  getAndUpdateRunningNo: `${API}/runningNo/getAndUpdateRunningNo`,

  //Material stock List
  //getMtrlReceiptDetailsByRvID: `${API}/mtrlReceiptDetails/getMtrlReceiptDetailsByRvID`,
  insertMtrlStockList: `${API}/mtrlStockList/insertMtrlStockList`,
  checkStockAvailable: `${API}/mtrlStockList/checkStockAvailable`,
  deleteMtrlStockByRVNo: `${API}/mtrlStockList/deleteMtrlStockByRVNo`,
  updateAfterRemoveStock: `${API}/mtrlStockList/updateAfterRemoveStock`,
  deleteMtrlStockByIVNo: `${API}/mtrlStockList/deleteMtrlStockByIVNo`,
  updateIssueIVNo: `${API}/mtrlStockList/updateIssueIVNo`,
  updateIVNoNULL: `${API}/mtrlStockList/updateIVNoNULL`,
  updateMtrlStockLock: `${API}/mtrlStockList/updateMtrlStockLock`,
  updateMtrlStockLock1: `${API}/mtrlStockList/updateMtrlStockLock1`,
  updateMtrlStockLock2: `${API}/mtrlStockList/updateMtrlStockLock2`,
  updateMtrlStockLock3: `${API}/mtrlStockList/updateMtrlStockLock3`,
  insertByReturnDetails: `${API}/mtrlStockList/insertByReturnDetails`,
  insertByMtrlStockID: `${API}/mtrlStockList/insertByMtrlStockID`,
  insertByMtrlStockIDResize: `${API}/mtrlStockList/insertByMtrlStockIDResize`,
  getDataByMtrlStockIdResize: `${API}/mtrlStockList/getDataByMtrlStockIdResize`,
  // New Running No for ShopFloor
  getNewRunningNo: `${API}/runningNo/getNewRunningNo`,
  updateRunNo: `${API}/runningNo/updateRunNo`,

  //material Return Details
  insertmaterialReturnDetails: `${API}/materialReturnDetails/insert`,
  deleteByIVNOMaterialReturnDetails: `${API}/materialReturnDetails/deleteByIVNO`,

  //return
  profileMaterialFirst: `${API}/return/profileMaterialFirst`,
  profileMaterialSecond: `${API}/return/profileMaterialSecond`,
  profileMaterialThird: `${API}/return/profileMaterialThird`,
  partFirst: `${API}/return/partFirst`,
  partSecond: `${API}/return/partSecond`,

  //material issue register
  insertMaterialIssueRegister: `${API}/materialIssueRegister/insert`,
  updateDCWeight: `${API}/materialIssueRegister/updateDCWeight`,
  updateStatusCancel: `${API}/materialIssueRegister/updateStatusCancel`,
  updateStatusDCNoDCID: `${API}/materialIssueRegister/updateStatusDCNoDCID`,
  getMaterialIssueRegisterRouterByIVID: `${API}/materialIssueRegister/getMaterialIssueRegisterRouterByIVID`,
  postCancleIV: `${API}/materialIssueRegister/postCancleIV`,
  //getAllReturnListing: `${API}/materialIssueRegister/getAllReturnListing?type=''`,
  getReturnPendingList: `${API}/materialIssueRegister/getAllReturnListing?type=pending`,
  getCustomerIVList: `${API}/materialIssueRegister/getAllReturnListing?type=customer`,
  getSalesIVList: `${API}/materialIssueRegister/getAllReturnListing?type=sales`,
  getCancelledList: `${API}/materialIssueRegister/getAllReturnListing?type=cancelled`,
  //getCheckReturnPendingList: `${API}/materialIssueRegister/checkPendingDispatchRouter`,

  insertMtrlIssueDetails: `${API}/mtrlIssueDetails/insert`,
  getmtrlIssueDetailsByIVID: `${API}/mtrlIssueDetails/getmtrlIssueDetailsByIVID`,

  //Reports
  //Material Management StockList
  getCustomerDetailsByMtrlStock: `${API}/mtrlStockList/getCustomerDetails`,
  getMaterialStockList1: `${API}/customstocklist/materialStockList1?`,
  getMaterialStockList2: `${API}/customstocklist/materialStockList2?`,
  getMaterialStockList3: `${API}/customstocklist/materialStockList3?`,

  //dc register
  insertDCRegister: `${API}/dcregister/insert`,
  getDCRegisterByID: `${API}/dcregister/getDCRegisterByID`,

  //dc details
  getLastInsertIDDCDetails: `${API}/dcdetails/getLastInsertID`,
  insertDCDetails: `${API}/dcdetails/insert`,

  //mtrl part issue details
  getmtrlPartIssueDetailsByIVID: `${API}/mtrlPartIssueDetails/getmtrlPartIssueDetailsByIVID`,
  insertPartIssueDetails: `${API}/mtrlPartIssueDetails/insert`,

  //shop floor issue
  getPartIssueVoucherList: `${API}/shopFloorIssue/getPartIssueVoucherList`,
  getMaterialIssueVoucherList: `${API}/shopFloorIssue/getMaterialIssueVoucherList`,
  getProductionMaterialIssueParts: `${API}/shopFloorIssue/getProductionMaterialIssueParts`,
  getProductionMaterialIssuePartsTable: `${API}/shopFloorIssue/getProductionMaterialIssuePartsTable`,
  getShopMaterialIssueVoucher: `${API}/shopFloorIssue/getShopMaterialIssueVoucher`,
  getShopMaterialIssueVoucherTable: `${API}/shopFloorIssue/getShopMaterialIssueVoucherTable`,
  getShopFloorServicePartTable: `${API}/shopFloorIssue/getShopFloorServicePartTable`,

  //for treeview
  getShopFloorServiceTreeViewMachine: `${API}/shopFloorIssue/getShopFloorServiceTreeViewMachine`,
  getShopFloorServiceTreeViewProcess: `${API}/shopFloorIssue/getShopFloorServiceTreeViewProcess`,
  getShopFloorServiceTreeViewMtrlCode: `${API}/shopFloorIssue/getShopFloorServiceTreeViewMtrlCode`,
  getShopFloorServiceTreeViewMtrlCodeClick: `${API}/shopFloorIssue/getShopFloorServiceTreeViewMtrlCodeClick`,

  //for pdf save to server
  pdfServer: `${API}/PDF/set-adjustment-name`,
  savePdf: `${API}/PDF/save-pdf`,

  //shopFloorReturn
  getFirstTableShopFloorReturn: `${API}/shopFloorReturn/getFirstMainTable`,
  getSecondTableShopFloorReturn: `${API}/shopFloorReturn/getSecondMainTable`,

  //shopfloorAllotment
  getShopFloorAllotmentPartFirstTable: `${API}/shopfloorAllotment/getShopFloorAllotmentPartFirstTable`,
  getShopFloorAllotmentPartFirstTableQtyAvl: `${API}/shopfloorAllotment/getShopFloorAllotmentPartFirstTableQtyAvl`,
  getShopFloorAllotmentPartSecondTableIds: `${API}/shopfloorAllotment/getShopFloorAllotmentPartSecondTableIds`,

  //shopfloorBOMIssueDetails
  insertShopfloorBOMIssueDetails: `${API}/shopfloorBOMIssueDetails/insertShopfloorBOMIssueDetails`,
  updateQtyReturnedShopfloorBOMIssueDetails: `${API}/shopfloorBOMIssueDetails/updateQtyReturnedShopfloorBOMIssueDetails`,

  //ncprograms
  updateQtyAllotedncprograms: `${API}/ncprograms/updateQtyAllotedncprograms`,
  updateQtyAllotedncprograms1: `${API}/ncprograms/updateQtyAllotedncprograms1`,
  updateQtyAllotedncprograms2: `${API}/ncprograms/updateQtyAllotedncprograms2`,
  getRowByNCID: `${API}/ncprograms/getRowByNCID`,

  //ncprogrammtrlallotmentlist
  insertncprogrammtrlallotmentlist: `${API}/ncprogrammtrlallotmentlist/insertncprogrammtrlallotmentlist`,
  updatencprogrammtrlallotmentlistReturnStock: `${API}/ncprogrammtrlallotmentlist/updatencprogrammtrlallotmentlistReturnStock`,

  //shopfloorPartIssueRegister
  updateStatusShopfloorPartIssueRegister: `${API}/shopfloorPartIssueRegister/updateStatusShopfloorPartIssueRegister`,
  insertShopfloorPartIssueRegister: `${API}/shopfloorPartIssueRegister/insertShopfloorPartIssueRegister`,

  //shopfloorUnitIssueRegister
  getMaterialAllotmentTable1: `${API}/shopfloorUnitIssueRegister/getMaterialAllotmentTable1`,

  //shopfloorMaterialIssueRegister
  insertShopfloorMaterialIssueRegister: `${API}/shopfloorMaterialIssueRegister/insertShopfloorMaterialIssueRegister`,
  updateShopfloorMaterialIssueRegisterQtyReturnedAddOne: `${API}/shopfloorMaterialIssueRegister/updateShopfloorMaterialIssueRegisterQtyReturnedAddOne`,

  //store
  getResizeMtrlStockList: `${API}/storeMng/getResizeMtrlStockList`,
  getMoveStoreMtrlStockByCustomer: `${API}/storeMng/getMoveStoreMtrlStockByCustomer`,
  getMoveStoreMtrlStockByLocation: `${API}/storeMng/getMoveStoreMtrlStockByLocation`,
  getMoveStoreCustomerMtrlStockByLocation: `${API}/storeMng/getMoveStoreCustomerMtrlStockByLocation`,
  getMoveStoreMtrlStockByAll: `${API}/storeMng/getMoveStoreMtrlStockByAll`,
  updateMtrlstockLocationByMtrlStockId: `${API}/storeMng/updateMtrlstockLocationByMtrlStockId`,
  getLocationListMtrlStockCount: `${API}/storeMng/getLocationListMtrlStockCount`,
  getStockListByCustCodeFirst: `${API}/storeMng/getStockListByCustCodeFirst`,
  getStockListByCustCodeSecond: `${API}/storeMng/getStockListByCustCodeSecond`,
  getStockListByCustCodeThird: `${API}/storeMng/getStockListByCustCodeThird`,
  getStockArrivalFirstTable: `${API}/storeMng/getStockArrivalFirstTable`,
  getStockArrivalSecondTable: `${API}/storeMng/getStockArrivalSecondTable`,
  getStockArrivalThirdTable: `${API}/storeMng/getStockArrivalThirdTable`,
  insertStockArrivalMtrlReceiptList: `${API}/storeMng/insertStockArrivalMtrlReceiptList`,
  getStockDispatchFirstTable: `${API}/storeMng/getStockDispatchFirstTable`,
  getStockDispatchSecondTable: `${API}/storeMng/getStockDispatchSecondTable`,
  getStockDispatchThirdTable: `${API}/storeMng/getStockDispatchThirdTable`,
  insertStockDispatchMtrlSales: `${API}/storeMng/insertStockDispatchMtrlSales`,
  getLocationStockSecond: `${API}/storeMng/getLocationStockSecond`,
  getLocationStockThird: `${API}/storeMng/getLocationStockThird`,

  //report
  getDailyReportMaterialReceipt1: `${API}/report/getDailyReportMaterialReceipt1`,
  getDailyReportMaterialReceipt2: `${API}/report/getDailyReportMaterialReceipt2`,
  getDailyReportMaterialDispatch: `${API}/report/getDailyReportMaterialDispatch`,
  updateSrlWghtMaterialDispatch: `${API}/report/updateSrlWghtMaterialDispatch`,
  getDailyReportMaterialSales: `${API}/report/getDailyReportMaterialSales`,
  getDailyReportMaterialPurchase: `${API}/report/getDailyReportMaterialPurchase`,

  getMonthlyReportMaterialPurchaseDetails: `${API}/report/getMonthlyReportMaterialPurchaseDetails`,
  getMonthlyReportMaterialSalesSummary: `${API}/report/getMonthlyReportMaterialSalesSummary`,
  getMonthlyReportMaterialPurchaseSummary: `${API}/report/getMonthlyReportMaterialPurchaseSummary`,
  getMonthlyReportMaterialSalesDetails: `${API}/report/getMonthlyReportMaterialSalesDetails`,
  getMonthlyReportMaterialHandlingSummary: `${API}/report/getMonthlyReportMaterialHandlingSummary`,

  getPartListInStockAndProcess: `${API}/report/getPartListInStockAndProcess`,
  getPartListReceiptAndUsageFirst: `${API}/report/getPartListReceiptAndUsageFirst`,
  getPartListReceiptAndUsageSecond: `${API}/report/getPartListReceiptAndUsageSecond`,
  getPartListReceiptAndUsageThird: `${API}/report/getPartListReceiptAndUsageThird`,
  getPartListReceiptAndUsageFourth: `${API}/report/getPartListReceiptAndUsageFourth`,

  getPDFData: `${API}/pdf/getPDFData`,
};

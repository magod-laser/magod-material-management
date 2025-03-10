/** @format */

import React, { useEffect, useState } from "react";
import NavComp from "../Components/NavComp";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import TreeView from "react-treeview";
import "react-treeview/react-treeview.css";
import { toast } from "react-toastify";
import axios from "axios";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function ShopFloorMaterialAllotment(props) {
	const nav = useNavigate();
	const [tableData, setTableData] = useState([]);
	const [treeData, setTreeData] = useState([]);
	const [ncid, setncid] = useState("");
	const [custCode, setCustCode] = useState("");
	const [CustMtrl, setCustMtrl] = useState("");

	const delay = (ms) => new Promise((res) => setTimeout(res, ms));
	const fetchData = async () => {
		//get table data
		let url1 =
			endpoints.getShopFloorServicePartTable +
			"?type=" +
			props.type +
			"&hasbom=" +
			props.hasbom;
		await getRequest(url1, async (data) => {
			//delay(5000);
			// data = data.filter((obj) => {
			// 	return obj["PStatus"] !== "Completed";
			// });
			//await delay(3000);
			console.log("data--", data);
			setTableData(data);
		});
		let url2 =
			endpoints.getShopFloorServiceTreeViewMachine +
			"?type=" +
			props.type +
			"&hasbom=" +
			props.hasbom;
		await getRequest(url2, async (data) => {
			data.forEach(async (item) => {
				let url3 =
					endpoints.getShopFloorServiceTreeViewProcess +
					"?type=" +
					props.type +
					"&hasbom=" +
					props.hasbom +
					"&machine=" +
					item.machine +
					"&tree=1";
				await getRequest(url3, async (data1) => {
					item["process"] = data1;
					data1.forEach(async (item1) => {
						let url4 =
							endpoints.getShopFloorServiceTreeViewMtrlCode +
							"?type=" +
							props.type +
							"&hasbom=" +
							props.hasbom +
							"&machine=" +
							item.machine +
							"&process=" +
							item1.MProcess +
							"&tree=1";
						await getRequest(url4, async (data2) => {
							item1["material"] = data2;
						});
					});
				});
			});
			if (props.formtype === "Parts") {
				await delay(800);
			} else {
				await delay(800);
			}
			setTreeData(data);
		});
	};

	console.log("table data", tableData);
	useEffect(() => {
		fetchData();
	}, []);

	const columns = [
		{
			text: "Id",
			dataField: "Ncid",
			hidden: true,
		},
		{
			text: "Task No",
			dataField: "TaskNo",
			headerStyle: { whiteSpace: "nowrap" },
			sort: true,
		},
		{
			text: "PStatus",
			dataField: "PStatus",
			sort: true,
		},
		{
			text: "Cust Name",
			dataField: "Cust_Name",
			headerStyle: { whiteSpace: "nowrap" },
			sort: true,
		},
		{
			text: "NCProgram No",
			dataField: "NCProgramNo",
			headerStyle: { whiteSpace: "nowrap" },
			sort: true,
		},
		{
			text: "Machine",
			dataField: "Machine",
			sort: true,
		},
		{
			text: "Operation",
			dataField: "Operation",
			sort: true,
		},
		{
			text: "Mtrl Code",
			dataField: "Mtrl_Code",
			headerStyle: { whiteSpace: "nowrap" },
			sort: true,
		},
		{
			text: "Source",
			dataField: "CustMtrl",
			sort: true,
		},
		{
			text: "Qty",
			dataField: "Qty",
			sort: true,
		},
		{
			text: "QtyAllotted",
			dataField: "QtyAllotted",
			sort: true,
		},
	];

	const treeViewclickMachine = (machine) => {
		let url =
			endpoints.getShopFloorServiceTreeViewProcess +
			"?type=" +
			props.type +
			"&hasbom=" +
			props.hasbom +
			"&machine=" +
			machine +
			"&tree=0";
		getRequest(url, async (data) => {
			// data = data.filter((obj) => obj["PStatus"] !== "Completed");

			setTableData(data);
		});
	};

	const treeViewclickProcess = (machine, process) => {
		let url =
			endpoints.getShopFloorServiceTreeViewMtrlCode +
			"?type=" +
			props.type +
			"&hasbom=" +
			props.hasbom +
			"&machine=" +
			machine +
			"&process=" +
			process +
			"&tree=0";
		getRequest(url, async (data) => {
			// data = data.filter((obj) => obj["PStatus"] !== "Completed");

			setTableData(data);
		});
	};

	const treeViewclickMaterial = (machine, process, material) => {
		let url =
			endpoints.getShopFloorServiceTreeViewMtrlCodeClick +
			"?type=" +
			props.type +
			"&hasbom=" +
			props.hasbom +
			"&machine=" +
			machine +
			"&process=" +
			process +
			"&material=" +
			material;
		getRequest(url, async (data) => {
			// data = data.filter((obj) => obj["PStatus"] !== "Completed");

			setTableData(data);
		});
	};

	const selectRow = {
		mode: "radio",
		clickToSelect: true,
		bgColor: "#98A8F8",
		onSelect: (row, isSelect, rowIndex, e) => {
			//VEERANNA 1142024
			// console.log("selected source", row.CustMtrl);
			// if (row.CustMtrl === "Magod") {
			// 	// toast.error("Selected source is Magod you can't proceed");
			// 	toast.error("Can't allot material for sales(Magod) orders");
			// } else {
			setncid(row.Ncid);
			setCustCode(row.Cust_Code);
			setCustMtrl(row.CustMtrl);
			// }
		},
	};

	const allotMaterial = () => {
		if (ncid === "") {
			toast.error("Please select table row");
		} else {
			if (props.formtype == "Parts") {
				//VEERANNA11042024
				props.formtype === "Parts" &&
				(CustMtrl === "Magod" || CustMtrl !== "Customer")
					? toast.error("Can't allot material for sales(Magod) orders")
					: nav(
							"/MaterialManagement/ShopFloorIssue/Service/Parts/ShopFloorAllotmentForm", //MaterialAllotmentMain

							{
								state: { ncid, custCode },
							}
					  );

				// nav(
				// 	"/MaterialManagement/ShopFloorIssue/Service/Parts/ShopFloorAllotmentForm", //MaterialAllotmentMain

				// 	{
				// 		state: { ncid, custCode },
				// 	}
				// );
			} else if (props.formtype == "Units" || props.formtype == "Others") {
				nav(
					"/MaterialManagement/ShopFloorIssue/Service/Units/MaterialAllotmentForm", //UnitsMatAllotmentForm
					{
						state: { ncid, custCode },
					}
				);
			}
		}
	};
	return (
		<div>
			<h4 className="title">Shop Floor Material Allotment</h4>
			<div className="row col-md-8 ">
				{/* <h4 style={{ marginLeft: "30px" }}>{props.formtype}</h4> */}
				<label className="col-md-2 ms-2">{props.formtype}</label>
				<button
					className=" col-md-3 button-style "
					style={{ width: "100px" }}
					onClick={allotMaterial}
					// disabled={boolVal1 | boolVal4}
				>
					Allot Material
				</button>
				<button
					className="button-style  col-md-2"
					style={{ width: "50px" }}
					id="btnclose"
					type="submit"
					onClick={() => nav("/MaterialManagement")}>
					Close
				</button>
			</div>
			<div className="row mt-4">
				<div className="col-md-2">
					{/* <NavComp /> */}
					{treeData?.map((node, i) => {
						const machine = node.machine;
						const label = (
							<span
								className="node"
								style={{ fontSize: "12px" }}>
								{machine}
							</span>
						);
						return (
							<TreeView
								key={machine + "|" + i}
								nodeLabel={label}
								defaultCollapsed={true}
								onClick={() => treeViewclickMachine(machine)}>
								{node.process?.map((pro) => {
									const label2 = (
										<span
											className="node"
											style={{ fontSize: "12px" }}>
											{pro.MProcess}
										</span>
									);
									return (
										<TreeView
											nodeLabel={label2}
											key={pro.MProcess}
											defaultCollapsed={true}
											onClick={() =>
												treeViewclickProcess(machine, pro.MProcess)
											}>
											{pro.material?.map((mat) => {
												const label3 = (
													<span
														className="node"
														style={{ fontSize: "12px" }}>
														{mat.Mtrl_Code}
													</span>
												);
												return (
													<TreeView
														nodeLabel={label3}
														key={mat.Mtrl_Code}
														defaultCollapsed={true}
														onClick={() =>
															treeViewclickMaterial(
																machine,
																pro.MProcess,
																mat.Mtrl_Code
															)
														}></TreeView>
												);
											})}
										</TreeView>
									);
								})}
							</TreeView>
						);
					})}
				</div>
				<div className="col-md-10">
					{/* <div style={{ height: "375px", overflow: "scroll" }}> */}
					{/* veeranna 03062025 tbl hight  */}
					<div style={{ height: "520px", overflow: "scroll" }}>
						<BootstrapTable
							keyField="Ncid"
							columns={columns}
							data={tableData}
							striped
							hover
							condensed
							//pagination={paginationFactory()}
							selectRow={selectRow}
							headerClasses="header-class tableHeaderBGColor"></BootstrapTable>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ShopFloorMaterialAllotment;

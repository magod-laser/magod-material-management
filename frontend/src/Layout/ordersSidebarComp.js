/** @format */

// import React, { useState } from "react";
// import styled from "styled-components";
// import { Link, useLocation } from "react-router-dom";
// import * as FaIcons from "react-icons/fa";
// import * as AiIcons from "react-icons/ai";
// // import SubMenuComp from "./SubNavComp";
// import { IconContext } from "react-icons/lib";

// import {
//   customerSidebar,
//   adminSidebar,
//   PakingInvSidebar,
//   // quotationSidebar,
// } from "../components/SidebarData";

// import { FaAngleRight, FaAngleLeft, FaAngleDown } from "react-icons/fa";
// import SubNavComp from "./SubNavComp";

// const NavIcon = styled.div`
//   margin-left: 2rem;
//   font-size: 2rem;
//   height: 80px;
//   display: flex;
//   justify-content: flex-start;
//   align-items: center;
// `;

// const SidebarWrap = styled.div`
//   width: 100%;
//   background-color: #263159;
// `;

// const SidebarComp = () => {
//   const location = useLocation();
//   let [lazerUser, setLazerUser] = useState(
//     JSON.parse(localStorage.getItem("LazerUser"))
//   );

//   const [sidebar, setSidebar] = useState(true);

//   function showSidebar() {
//     setSidebar(!sidebar);
//   }

//   return (
//     <>
//       <nav className={sidebar ? "side-nav" : '"side-nav '}>
//         <SidebarWrap>
//           <div className="admin-title ">
//             {/* {sidebar && 'M A G O D'} */}
//             {/* <img className="logo" src={require("../ML-LOGO1.png")} /> */}
//             <img
//               className="logo"
//               src={require("../Magod-Laser-Logo - White.png")}
//             />
//             {sidebar ? (
//               <FaAngleRight
//                 className="toggle-icon"
//                 onClick={() => showSidebar()}
//               />
//             ) : (
//               <FaAngleLeft
//                 className="toggle-icon"
//                 onClick={() => showSidebar()}
//               />
//             )}
//           </div>

//           {/* {(location.pathname.startsWith("/admin")
//             ? adminSidebar
//             : customerSidebar
//           ).map((item, index) => {
//             return <SubNavComp item={item} key={index} sidebar={sidebar} />;
//           })} */}
//           {/* ---------------------------------- */}
//           {(location.pathname.startsWith("/admin")
//             ? adminSidebar
//             : location.pathname.startsWith("/PackingAndInvoices")
//             ? PakingInvSidebar
//             : // : location.pathname.startsWith("/quotation")
//               // ? quotationSidebar
//               null
//           ).map((item, index) => {
//             return <SubNavComp item={item} key={index} sidebar={sidebar} />;
//           })}

//           {/* {(location.pathname.startsWith("/PackingAndInvoices")? adminSidebar :null)} */}
//           {/* //--------------------- */}

//           {/* {(lazerUser.data.access.includes("/admin") ? adminSidebar : null).map(
//             (item, index) => {
//               return <SubNavComp item={item} key={index} sidebar={sidebar} />;
//             }
//           )}
//           {(lazerUser.data.access.includes("/customer")
//             ? adminSidebar
//             : adminSidebar
//           ).map((item, index) => {
//             return <SubNavComp item={item} key={index} sidebar={sidebar} />;
//           })} */}
//         </SidebarWrap>
//       </nav>
//     </>
//   );
// };

// export default SidebarComp;

import React, { useState, useEffect } from "react";

import styled from "styled-components";

import { Link, useLocation } from "react-router-dom";

import * as FaIcons from "react-icons/fa";

import * as AiIcons from "react-icons/ai";

import SubMenuComp from "./SubNavComp";

import { IconContext } from "react-icons/lib";

import { customerSidebar, adminSidebar } from "../components/SidebarData";

import { FaAngleRight, FaAngleLeft, FaAngleDown } from "react-icons/fa";

const NavIcon = styled.div`
	margin-left: 2rem;

	font-size: 2rem;

	height: 80px;

	display: flex;

	justify-content: flex-start;

	align-items: center;
`;

const SidebarWrap = styled.div`
	width: 100%;

	background-color: #263159;
`;

const SidebarComp = () => {
	const location = useLocation();

	const [sidebar, setSidebar] = useState(true);
	const [newSideBarData, setNewSideBarData] = useState(customerSidebar);
	const [accessSideBarData, setAccessSideBarData] = useState([]);

	function showSidebar() {
		setSidebar(!sidebar);
	}
	// //console.log(lazerUser.data.access);
	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("LazerUser"));
		//console.log("LazerUser:", user); // Check if this logs the expected data
		setLazerUser(user);
	}, []);

	let [lazerUser, setLazerUser] = useState(
		JSON.parse(localStorage.getItem("LazerUser"))
	);

	// useEffect(() => {
	// 	function filterSidebarData(data, accessPaths) {
	// 		// //console.log("first", data);
	// 		// //console.log("second", accessPaths);
	// 		const filterSidebar = [];
	// 		let previousMenu = null;

	// 		data.forEach((element) => {
	// 			if (element.subNav) {
	// 				const subNavFiltered = filterSidebarData(element.subNav, accessPaths);
	// 				element.subNav = subNavFiltered;
	// 				if (
	// 					subNavFiltered.length > 0 ||
	// 					accessPaths?.includes(element.path)
	// 				) {
	// 					// if(element.path)
	// 					//   element.path = element.path.toLowerCase();
	// 					filterSidebar.push(element);
	// 				}
	// 			} else {
	// 				if (element.title === "Previous Menu") {
	// 					//console.log(element.path);
	// 					previousMenu = element;
	// 					// element.onClick = () => {
	// 					// 	window.location.href = "http://172.16.20.61:3000/salesHome";
	// 					// };
	// 				} else if (accessPaths?.includes(element.path)) {
	// 					// if(element.path)
	// 					//   element.path = element.path.toLowerCase();
	// 					filterSidebar.push(element);
	// 				}
	// 			}
	// 		});
	// 		if (previousMenu) {
	// 			filterSidebar.push(previousMenu);
	// 		}
	// 		return filterSidebar;
	// 	}

	// 	const filterSidebar = filterSidebarData(
	// 		newSideBarData,
	// 		lazerUser?.data?.access
	// 	);
	// 	// //console.log(filterSidebar);
	// 	setAccessSideBarData(filterSidebar);
	// 	// setAccessSideBarData(quotationSidebar)
	// }, []);

	useEffect(() => {
		function filterSidebarData(data, accessPaths) {
			const filterSidebar = [];

			data.forEach((element) => {
				if (element.subNav) {
					const subNavFiltered = filterSidebarData(element.subNav, accessPaths);
					element.subNav = subNavFiltered;
					if (
						subNavFiltered.length > 0 ||
						accessPaths?.includes(element.path)
					) {
						filterSidebar.push(element);
					}
				} else {
					// Directly check for the "Previous Menu"
					if (element.title === "Previous Menu") {
						console.log("entering into privious menus click");
						console.log("element", element);
						console.log("element.path", element.path);
						// window.location.href = "http://172.16.20.61:3000/salesHome";
						// element.path = "http://172.16.20.61:3000/salesHome"; // Set the desired URL here
						console.log("filterSidebar-before", filterSidebar);
						filterSidebar.push(element);
						console.log("filterSidebar-after", filterSidebar);
					} else if (accessPaths?.includes(element.path)) {
						filterSidebar.push(element);
					}
				}
			});
			return filterSidebar;
		}

		const filterSidebar = filterSidebarData(
			newSideBarData,
			lazerUser?.data?.access
		);
		setAccessSideBarData(filterSidebar);
	}, []);

	return (
		<>
			<nav className={sidebar ? "side-nav" : '"side-nav '}>
				<SidebarWrap>
					<div className="admin-title ">
						{/* {sidebar && 'M A G O D'} */}

						<img
							className="logo"
							src={require("../ML-LOGO1.png")}
						/>

						{sidebar ? (
							<FaAngleRight
								className="toggle-icon"
								onClick={() => showSidebar()}
							/>
						) : (
							<FaAngleLeft
								className="toggle-icon"
								onClick={() => showSidebar()}
							/>
						)}
					</div>

					{(location.pathname.startsWith("/admin")
						? adminSidebar
						: accessSideBarData
					).map((item, index) => {
						return (
							<SubMenuComp
								item={item}
								key={index}
								sidebar={sidebar}
							/>
						);
					})}
				</SidebarWrap>
			</nav>
		</>
	);
};

export default SidebarComp;

import { useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import SubMenuComp from "./SubNavComp";
import { customerSidebar, adminSidebar } from "../components/SidebarData";
import { FaAngleRight, FaAngleLeft, FaAngleDown } from "react-icons/fa";

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
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("LazerUser"));
    setLazerUser(user);
  }, []);

  let [lazerUser, setLazerUser] = useState(
    JSON.parse(localStorage.getItem("LazerUser"))
  );

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
          if (element.title === "Previous Menu") {
            filterSidebar.push(element);
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
            <img className="logo" src={require("../ML-LOGO1.png")} />

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
            return <SubMenuComp item={item} key={index} sidebar={sidebar} />;
          })}
        </SidebarWrap>
      </nav>
    </>
  );
};

export default SidebarComp;

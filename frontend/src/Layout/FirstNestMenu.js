import { useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import NestMenu from "./NestMenu";

function FirstNestMenu({ subNav1, subnav }) {
  const SidebarLabel = styled.span`
    margin-left: 8px;
  `;

  const DropdownLink = styled.div`
    height: 35px;
    /* padding: 0px 0px 0px 20px; */
    display: flex;
    align-items: center;
    text-decoration: none;
    font-size: 13px;
    // background-color: #707075;

    &:hover {
      /* background-color: #707075; */
      background-color: #5956f3;
      cursor: pointer;
      color: #ffffff;
    }
  `;

  const [nest, setNest] = useState(false);
  const showSubnav1 = () => setNest(!nest);
  return (
    <>
      <NavLink
        to={subNav1.path}
        className={({ isActive }) =>
          isActive && subNav1.path && subnav
            ? "active-link-url  side-nav-sub-menu"
            : "link-default side-nav-sub-menu"
        }
      >
        <DropdownLink
          onClick={() => {
            subNav1.subNav && showSubnav1();
          }}
        >
          <div className="sub-menu-icon"> {subNav1.icon}</div>
          <SidebarLabel className="sub-menu-label">
            {subNav1.title}
          </SidebarLabel>
        </DropdownLink>
      </NavLink>
      {nest &&
        subNav1.subNav !== undefined &&
        subNav1?.subNav.length > 0 &&
        subNav1.subNav.map((nestnav, i) => {
          return <NestMenu key={i} nestnav={nestnav} />;
        })}
    </>
  );
}

export default FirstNestMenu;

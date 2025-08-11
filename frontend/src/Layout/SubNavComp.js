import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import FirstNestMenu from "./FirstNestMenu";

const SidebarLink = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  height: 35px;
  text-decoration: none;
  font-size: 13px;

  &:hover {
    /* background: #707075; */
    // border-left: 4px solid #707075;
    border-left: 4px solid #263159;
    cursor: pointer;
    color: #ffffff;
  }
`;

const SidebarLabel = styled.span`
  margin-left: 8px;
`;

const SubMenuComp = ({ item, sidebar }) => {
  const [subnav, setSubnav] = useState(false);

  const showSubnav = () => setSubnav(!subnav);
  useEffect(() => {
    if (!sidebar) {
      setSubnav(false);
    }
  }, [sidebar]);

  return (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive && item.path && !subnav ? "active-link-url" : "link-default"
        }
        to={item.path}
      >
        {
          <SidebarLink onClick={item.subNav && showSubnav}>
            <div className="side-nav-main-container">
              <div className="side-nav-main-icon">{item.icon} </div>
              <SidebarLabel className="side-nav-main-title">
                {item.title}
              </SidebarLabel>
            </div>
            <div>
              {item.subNav && subnav
                ? item.iconOpened
                : item.subNav
                ? item.iconClosed
                : null}
            </div>
          </SidebarLink>
        }
      </NavLink>

      {subnav &&
        item?.subNav.map((subNav1, index) => {
          return (
            <>
              <FirstNestMenu key={index} subNav1={subNav1} subnav={subnav} />
            </>
          );
        })}
    </>
  );
};
export default SubMenuComp;

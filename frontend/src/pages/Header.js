import Cookies from "js-cookie";

function Header() {
  // Function to get user data from cookies

  const userData = JSON.parse(Cookies.get("userData"));
  const versionUrl = process.env.REACT_APP_VERSION;
  const logoutUrl = process.env.REACT_APP_LOGOUT_URL;
  const logout = () => {
    Cookies.remove("userData");
    window.location.replace(logoutUrl);
  };

  return (
    <>
      <nav className="header">
        <div style={{ marginLeft: "10px" }}>
          <h4 style={{ fontSize: "16px", fontWeight: "600" }}>Magod ERP</h4>
        </div>

        <div
          style={{ marginRight: "30px", fontSize: "12px", fontWeight: "600" }}
        >
          {versionUrl} {"  "}
          {userData.Name} - {userData.UnitName} | {""}
          <button
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "black",
              fontSize: "12px",
              fontWeight: "600",
            }}
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ height: "10px" }}>&nbsp;</div>
    </>
  );
}

export default Header;

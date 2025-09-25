import { useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const { postRequest } = require("../api/apiinstance");
const { endpoints } = require("../api/constants");

function Login() {
  const nav = useNavigate();

  // Retrieve userData from cookies
  const userData = JSON.parse(Cookies.get("userData") || "{}");

  // Set userData into localStorage
  localStorage.setItem("userData", JSON.stringify(userData));

  // Fetch menu URLs and module IDs for a user based on role and username
  useEffect(() => {
    if (userData) {
      const fetchMenuUrls = async () => {
        try {
          const role = userData.Role;
          const username = userData.UserName;
          if (!role || !username) {
            console.error(
              "Role, username, or access token is missing in local storage"
            );
            return;
          }

          const response = await fetch(endpoints.MenuUrlsAPI, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ role, username }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseData = await response.json();
          localStorage.setItem("LazerUser", JSON.stringify(responseData));
        } catch (error) {
          console.error("Error fetching menu URLs:", error);
        }
      };

      fetchMenuUrls();
      nav("MaterialManagement/");
    }
  }, [userData]);

  return <></>;
}

export default Login;

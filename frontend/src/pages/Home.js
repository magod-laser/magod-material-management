import { Link } from "react-router-dom";
import Header from "./Header";
import { AiTwotoneContainer } from "react-icons/ai";

function Home() {
  return (
    <>
      <Header user={false} />
      <div className="card-container">
        <Link
          to="/MaterialManagement"
          style={{ textDecoration: "none", color: "black" }}
        >
          <div className="dashboard-card">
            <div className="card-item">
              <AiTwotoneContainer size={60} color="#283E81" />
              <span className="dashboard-link" style={{ textAlign: "center" }}>
                Material Management
              </span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Home;

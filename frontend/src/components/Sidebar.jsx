import { Link } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  return (
    <div
      className={`sidebar ${isOpen ? "open" : "closed"} position-fixed bg-dark`} style={{ zIndex: 1500 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="d-flex justify-content-between align-items-center flex-column">
        {/* <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "➖" : "➕"}
        </button> */}
        <nav>
          <ul>
            <li style={{ width: "max-content" }}><Link to="/dash">🏠 {isOpen && "Dashboard"}</Link></li>
            <li style={{ width: "max-content" }}><Link to="/profile">👤 {isOpen && "Profile"}</Link></li>
            <li style={{ width: "max-content" }}><Link to="/paymentspage">📝 {isOpen && "Payments Page"}</Link></li>
            <li style={{ width: "max-content" }}><Link to="/withdraw">💸 {isOpen && "Withdraw"}</Link></li>
          </ul>
        </nav>
      </div>

    </div>
  );
};

export default Sidebar;

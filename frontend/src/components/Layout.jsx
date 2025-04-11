import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    const location = useLocation();
    const hideLayout = "/" == (location.pathname);

    return (
        // <div className="layout">
        //     {!hideLayout && <Sidebar />}
        //     <div className="main-content">
        //         {!hideLayout && <Navbar />}
        //         <div className="content">
        //             <Outlet />
        //         </div>
        //     </div>
        // </div>
        <div className="d-flex flex-column">
            {/* Sidebar */}


            {!hideLayout && <Navbar />}
            {/* Main Content */}
            <div className="admin-main d-flex flex-fill overflow-auto" style={hideLayout ? {} : { marginTop: "56px" }}>
                {!hideLayout && <Sidebar />}
                {/* Render children inside */}
                <div
                    className="w-100"
                    style={!hideLayout ? { marginLeft: "50px", minHeight: "calc(100vh)" } : { minHeight: "100vh  - 56px" }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;

import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import PostDetails from "../pages/PostDetails";
import LoginResgister from "../pages/LoginResgister";
import Profile from "../pages/Profile";
import CreatePost from "../pages/CreatePost";
import Layout from "./Layout";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import CreatePaymentPage from "../pages/PaymentPage/CreatePaymentPage";
import PaymentViewPage from "../pages/PaymentPage/PaymentViewPage";
import InitiateWithdraw from "../pages/Withdraw/InitiateWithdraw";

function Router() {
  const location = useLocation();

  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    console.log("location", location.pathname=='/');
    location.pathname == "/" ? setIsAuthPage(true) : setIsAuthPage(false);
  }, [location.pathname]);

  return (
    // <>
    //   {!isAuthPage && <Navbar />}
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/auth" element={<LoginResgister />} />
    //     <Route path="/post/:id" element={<PostDetails />} />
    //     <Route path="/profile" element={<Profile/>} />
    //     <Route path="/create" element={<CreatePost/>} />
    //   </Routes>
    // </>

    <>
      <Layout>
        <Routes>
          <Route path="/dash" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/paymentspage">
            <Route index element={<PaymentPage />} />
            <Route path=":id" element={<PaymentViewPage />} />
          </Route>
          <Route path="/createpayment" element={<CreatePaymentPage />} />
          <Route path="/withdraw" element={<InitiateWithdraw />} />


          <Route path="/" element={<LoginResgister />} />
        </Routes>
      </Layout>
    </>
  );
}

export default Router;

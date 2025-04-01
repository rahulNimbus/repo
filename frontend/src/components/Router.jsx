import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "../pages/Home/Home";
import PostDetails from "../pages/PostDetails";
import LoginResgister from "../pages/LoginResgister";
import axios from "axios";
import Profile from "../pages/Profile";
import CreatePost from "../pages/CreatePost";

function Router() {
  const location = useLocation();

  const [isAuthPage, setIsAuthPage] = useState(false);

  useEffect(() => {
    location.pathname.includes("/auth")
      ? setIsAuthPage(true)
      : setIsAuthPage(false);
  }, [location.pathname]);


  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoginResgister />} />
        <Route path="/post/:id" element={<PostDetails />} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/create" element={<CreatePost/>} />
      </Routes>
    </>
  );
}

export default Router;

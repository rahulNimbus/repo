import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "@mdi/react";
import { mdiInformationSlabCircleOutline } from "@mdi/js";
import { Link } from "react-router-dom";
import axios from "axios";
import PublishedTable from "./PublishedTable";
import UnpublishedTable from "./UnpublishedTable";
import DraftTable from "./DraftTable";

function PaymentPage() {
  const [activeTab, setActiveTab] = useState("published");
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8180/api/payment/get`,
        { withCredentials: true }
      );
      console.log("res", response);
      if (response.status === 200) {
        setPaymentData(response.data);
      }
    } catch (err) {
      //   setError("Failed to fetch profile data.");
      console.error(err);
      setPaymentData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, []);

  return (
    <>
      <motion.div
        // className="row"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-dark text-white min-vh-100 p-4 pb-0">
          <div className="row">
            <div className="col-md-12 text-end">
              <Link to="/createpayment">
                <button className="btn btn-secondary px-4 rounded-pill ">
                  + Create Payment Page
                </button>
              </Link>
            </div>
          </div>
          <h1 className="text-center m-5 mt-3">Payment Page</h1>
          <div className="row d-flex justify-content-around mb-3">
            <div className="col-md-3 border border-light rounded p-3 mb-3">
              <p>
                Total Sale{" "}
                <Icon path={mdiInformationSlabCircleOutline} size={0.8} />
              </p>
              <div className="d-inline-flex align-items-center">
                <h3 className="mb-0">₹ {loading ? "--" : paymentData.totalSales || 0}</h3>
                <small className="text-small ms-2">same as last week</small>
              </div>
            </div>
            <div className="col-md-3 border border-light rounded p-3 mb-3">
              <p>
                Total Revenue{" "}
                <Icon path={mdiInformationSlabCircleOutline} size={0.8} />
              </p>
              <div className="d-inline-flex align-items-center">
                <h3 className="mb-0">{loading ? "--" : paymentData.totalRevenue || 0}</h3>
                <small className="text-small ms-2">same as last week</small>
              </div>
            </div>
            <div className="col-md-3 border border-light rounded p-3 mb-3">
              <p>
                Conversion{" "}
                <Icon path={mdiInformationSlabCircleOutline} size={0.8} />
              </p>
              <div className="d-inline-flex align-items-center">
                <h3 className="mb-0">{loading ? "--" : (paymentData.totalSales / (paymentData.notPaidCustomers + paymentData.totalSales)) * 100 || 0}%</h3>
                <small className="text-small ms-2">same as last week</small>
              </div>
            </div>
          </div>

          <div className="row d-flex mb-3 ps-5">
            <button
              className={`col-md-2 mb-3 btn btn${
                activeTab === "published" ? "" : "-outline"
              }-secondary px-4 rounded-pill text-white`}
              onClick={() => setActiveTab("published")}
            >
              Published ({paymentData.count})
            </button>
            {/* <div className="col-md-2 p-3 mb-3">
                            <button className={`btn btn${activeTab === "unpublished" ? "" : "-outline"}-secondary px-4 rounded-pill text-white`} onClick={() => setActiveTab("unpublished")}>Unpublished (12)</button>
                        </div>
                        <div className="col-md-2 p-3 mb-3">
                            <button className={`btn btn${activeTab === "draft" ? "" : "-outline"}-secondary px-4 rounded-pill text-white`} onClick={() => setActiveTab("draft")}>Draft (12)</button>
                        </div> */}
          </div>
          {
            activeTab === "published" && <PublishedTable data = {paymentData} loading = {loading} /> 
            // activeTab === "unpublished" && <UnpublishedTable /> ||
            // activeTab === "draft" && <DraftTable />
          }
        </div>
      </motion.div>
    </>
  );
}

export default PaymentPage;

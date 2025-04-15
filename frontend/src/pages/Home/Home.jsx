import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PublishedTable from "../PaymentPage/PublishedTable";

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8180/api/auth/getData`,
          { withCredentials: true }
        );
        setUserData(response.data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const [paymentData, setPaymentData] = useState([]);
  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8180/api/payment/get`,
        { withCredentials: true }
      );
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

  const [withdrawData, setWithdrawData] = useState([]);
  const [withdrawDataLoading, setWithdrawDataLoading] = useState(false);

  const fetchWithdrawdata = async () => {
    setWithdrawDataLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8180/api/wallet/withdrawal/get`,
        { withCredentials: true }
      );
      console.log("res", response);
      if (response.status === 200) {
        setWithdrawData(
          response.data.withdrawals
        );
      }
    } catch (err) {
      //   setError("Failed to fetch profile data.");
      console.error(err);
      setWithdrawData([]);
    } finally {
      setWithdrawDataLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8180/api/wallet/withdrawal/approveWithdrawal/${id}`,
        {
          status: "success",
        },
        {
          withCredentials: true,
        }
      );

      alert("Approved successfully");
      fetchWithdrawdata();
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  useEffect(() => {
    fetchPaymentData();
    fetchWithdrawdata();
  }, []);

  const formatRawDate = (rawDate) => {
    const date = new Date(rawDate);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formatted = date.toLocaleDateString("en-US", options);

    // Add "st", "nd", "rd", or "th" to the day
    function addOrdinalSuffix(day) {
      if (day > 3 && day < 21) return day + "th";
      switch (day % 10) {
        case 1:
          return day + "st";
        case 2:
          return day + "nd";
        case 3:
          return day + "rd";
        default:
          return day + "th";
      }
    }

    const month = date.toLocaleString("en-US", { month: "long" });
    const day = addOrdinalSuffix(date.getDate());
    const year = date.getFullYear();

    const finalFormat = `${month} ${day}, ${year}`;
    return finalFormat;
  };

  return (
    <motion.div
      // className="row"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-dark text-white min-vh-100 p-4">
        <div className="row border-top border-secondary ">
          {/* Table Section */}
          <div className="col-md-7 border-end border-secondary ps-5 pt-3">
            {/* Stats */}
            <div className="row d-flex justify-content-start gap-5 text-center mb-4">
              <div className="col-sm-3">
                <p className="text-start">Total Revenue</p>
                <h4 className="text-start">
                  ₹ {loading ? "--" : paymentData.totalRevenue || 0}
                </h4>
              </div>
              <div className="col-sm-3">
                <p className="text-start">Total Withdrawal</p>
                <h4 className="text-start">- 2.25%</h4>
              </div>
              <div className="col-sm-3">
                <p className="text-start">Balance Amount</p>
                <h4 className="text-start">
                  ₹ {loading ? "--" : userData?.headers?.balance || 0}
                </h4>
              </div>
            </div>
            <PublishedTable data={paymentData} loading={loading} />
          </div>

          {/* Withdraw / Refund Section */}
          <div className="col-md-5 pt-3">
            <div className="d-flex mb-3 gap-3">
              <button
                // onClick={() => navigate("/withdraw")}
                className="btn btn-primary w-50"
              >
                Withdraw
              </button>
              <button
                className="btn btn-primary w-50"
                style={{ backgroundColor: "#a259ff", border: "none" }}
              >
                Refund
              </button>
            </div>

            {/* Cards */}
            {withdrawDataLoading ? (
              <>
                <div className="text-center mt-5 mb-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              </>
            ) : (
              withdrawData.map((data, index) => (
                <div
                  key={index}
                  className="border border-secondary text-white p-3 rounded mb-3 d-flex justify-content-between align-items-center mx-4"
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      style={{
                        backgroundColor: "#a259ff",
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                      }}
                    >
                      💰
                    </div>
                    <div>
                      <h6 className="mb-1">₹ {data.amount}</h6>
                      <small>{data.description}</small>
                    </div>
                  </div>
                  <span className="d-flex flex-column">
                    <small
                      className={`text-${
                        data.status == "success" ? "success" : "warning"
                      }`}
                    >
                      {data.status == "success" ? (
                        "Successfull"
                      ) : data.status == "failure" ? (
                        <span className="text-danger">Failed</span>
                      ) : (
                        <span>
                          <small>Pending </small>
                          <small
                            onClick={() => handleApprove(data._id)}
                            className="text-primary"
                          >
                            Approve
                          </small>
                        </span>
                      )}
                    </small>
                    <small className="text-white">
                      {/* May 4th, 2020 */}
                      {formatRawDate(data.created)}
                    </small>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;

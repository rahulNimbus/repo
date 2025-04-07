import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log("local", localStorage.getItem("user"))

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8180/api/auth/getData`,
          { withCredentials: true }
        );
        console.log("res",response)
        setUserData(response.data.user);
      } catch (err) {
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // if (loading) return <p>Loading user data...</p>;
  // if (error) return <p className="text-danger text-center ">{error}</p>;

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
            <div className="row d-flex justify-content-start gap-5 text-center mb-4" >
              <div className="col-sm-3">
                <p className="text-start">Total Revenue</p>
                <h4 className="text-start">$ 5.122,50</h4>
              </div>
              <div className="col-sm-3">
                <p className="text-start">Total Withdrawal</p>
                <h4 className="text-start">- 2.25%</h4>
              </div>
              <div className="col-sm-3">
                <p className="text-start">Balance Amount</p>
                <h4 className="text-start">= $ 122,50</h4>
              </div>
            </div>
            <table className="table table-dark table-bordered text-center" >
              <thead>
                <tr >
                  <th style={{ width: '140px' }}>Date</th>
                  <th>Customer Detail</th>
                  <th style={{ width: '170px' }}>Product</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((item, index) => (
                  <tr key={index}>
                    <td style={{ width: '140px' }}>23 March 2025, 12:00</td>
                    <td>
                      Name
                      <br />
                      Mobile Number
                    </td>
                    <td style={{ width: '170px' }}>
                      {index === 0
                        ? 'Payment Page\nName Of Page'
                        : index === 1
                          ? 'Telegram Subscription'
                          : 'Locked Content'}
                    </td>
                    <td>
                      1000
                      <br />
                      Successful / Failed
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Withdraw / Refund Section */}
          <div className="col-md-5 pt-3">
            <div className="d-flex mb-3 gap-3">
              <button className="btn btn-primary w-50">Withdraw</button>
              <button className="btn btn-primary w-50" style={{ backgroundColor: '#a259ff', border: 'none' }}>
                Refund
              </button>
            </div>

            {/* Cards */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="border border-secondary text-white p-3 rounded mb-3 d-flex justify-content-between align-items-center mx-4">
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      backgroundColor: '#a259ff',
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    💰
                  </div>
                  <div>
                    <h6 className="mb-1">$ 1.250,00</h6>
                    <small>
                      {index % 2 === 0 ? 'Saving Funds #A' : 'Emergency Fund #B'}
                    </small>
                  </div>
                </div>
                <span className="text-success">
                  Successful <br />
                  <small className="text-white">
                    May 4th, 2020
                  </small>
                </span>

              </div>
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
}

export default Home;

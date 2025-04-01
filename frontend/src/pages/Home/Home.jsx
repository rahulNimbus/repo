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
          `http://localhost:8180/api/auth/getData/${localStorage.getItem("user")}`,
          { withCredentials: true }
        );
        setUserData(response.data.user);
      } catch (err) {
        setError("Failed to fetch user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p className="text-danger text-center ">{error}</p>;

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="row justify-content-center">
        <div className="col-md-8">
          {/* User Info Card */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">About Me</h5>
              <p className="card-text">
                Hi, I'm <strong style={{cursor: "pointer"}} onClick={()=> navigate("/profile")}>{userData.username}</strong>!<br />
                {userData.bio} <br />
                <strong style={{cursor: "pointer"}} onClick={()=> navigate("/create")}>Create Post</strong>
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Categories</h5>
              <ul className="list-unstyled">
                <li><a href="#">Breakfast</a></li>
                <li><a href="#">Lunch</a></li>
                <li><a href="#">Dinner</a></li>
                <li><a href="#">Desserts</a></li>
                <li><a href="#">Vegan</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;

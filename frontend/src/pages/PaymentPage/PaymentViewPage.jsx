import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PaymentViewPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const fetchPaymentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8180/api/payment/get?id=${id}`,
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

  useEffect(() => {
    fetchPaymentData();
  }, []);


  return (
    <div className="bg-dark text-white p-5  min-vh-100">
      <div className="row h-100">
      </div>
    </div>
  );
}

export default PaymentViewPage;

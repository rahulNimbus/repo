import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultAvatar from "../../assets/panda.png";

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
        setPaymentData(response.data.payment[0]);
        console.log(response.data);
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
        {paymentData?.media?.length > 0 && (
          <div className="mb-4 text-center">
            <img
            //   src={`http://localhost:8180/${paymentData.media[0].replace(/\\/g, "/")}` || defaultAvatar}
              src={defaultAvatar}
              alt="Media"
              className="img-fluid rounded-3"
              style={{ maxHeight: "360px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Title */}
        <h2 className="mb-3">{paymentData.title}</h2>

        {/* Description */}
        <p className="text-muted">{paymentData.description}</p>

        {/* Amount */}
        <h4 className="mt-4">
          Amount: ₹ {paymentData?.amount?.toLocaleString()}
        </h4>

        {/* Status */}
        <div className="mt-2">
          Status:{" "}
          {paymentData.enabled ? (
            <span className="text-success fw-bold">Enabled</span>
          ) : (
            <span className="text-danger fw-bold">Disabled</span>
          )}
        </div>

        {/* Date */}
        <div className="text-secondary mt-3" style={{ fontSize: "0.9rem" }}>
          Created at: {new Date(paymentData?.createdAt)?.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default PaymentViewPage;

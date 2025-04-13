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
        {/* {paymentData?.media?.length > 0 && (
          <div className="mb-4 text-center">
            <img
              src={
                paymentData?.media?.[0]
                  ? paymentData.media[0]
                  : defaultAvatar
              }
              alt="Media"
              className="img-fluid rounded-3"
              style={{ maxHeight: "250px", objectFit: "cover" }}
            />
          </div>
        )}
        <h2 className="mb-3">{paymentData.title}</h2>

        <p>{paymentData.description}</p>

        <h4 className="mt-4">
          Amount: ₹ {paymentData?.amount?.toLocaleString()}
        </h4>

        <div className="mt-2">
          Status:{" "}
          {paymentData.enabled ? (
            <span className="text-success fw-bold">Enabled</span>
          ) : (
            <span className="text-danger fw-bold">Disabled</span>
          )}
        </div>
        <div className="text-secondary mt-3" style={{ fontSize: "0.9rem" }}>
          Created at: {new Date(paymentData?.createdAt)?.toLocaleString()}
        </div> */}

        <div className="col-md-6 border-end border-secondary">
          {/* <form
            onSubmit={handleSubmit}
            className="p-0"
            style={{ alignItems: "normal" }}
          >
            <div className="mb-3 position-relative">
              <label className="form-label" style={{ color: "#bbbbbb" }}>
                Payment Page Title
              </label>
              <input
                type="text"
                className="form-control pe-5"
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#ffffff",
                  borderColor: "#333333",
                }}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="Enter page title"
                maxLength={25}
              />
              <small
                className="position-absolute"
                style={{
                  top: "74%",
                  right: "10px",
                  transform: "translateY(-50%)",
                  color: "#888888",
                }}
              >
                {title.length}/25
              </small>
              {errors.title && (
                <div className="invalid-feedback d-block">{errors.title}</div>
              )}
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label" style={{ color: "#bbbbbb" }}>
                Amount
              </label>
              <input
                type="text"
                className="form-control pe-5 text-white"
                style={{ backgroundColor: "#1e1e1e", borderColor: "#333333" }}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((prev) => ({ ...prev, amount: "" }));
                }}
                placeholder="Enter amount"
              />
              {errors.amount && (
                <div className="invalid-feedback d-block">{errors.amount}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" style={{ color: "#bbbbbb" }}>
                Description
              </label>
              <textarea
                className="form-control"
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#ffffff",
                  borderColor: "#333333",
                }}
                rows="3"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
                placeholder="Enter description"
              />
              {errors.description && (
                <div className="invalid-feedback d-block">
                  {errors.description}
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-md-12 text-end">
                <button
                  type="submit"
                  className="btn btn-secondary px-4 rounded-pill "
                >
                  Save and Continue
                </button>
              </div>
            </div>
          </form> */}
        </div>

        <div className="col-md-6">
          <div
            className="border border-secondary p-3 rounded"
            style={{ backgroundColor: "#1e1e1e", color: "#e0e0e0" }}
          >
            <div className="d-flex justify-content-between">
              <h5>{paymentData.title}</h5>
            </div>

            <small style={{ color: "#bbbbbb" }}>ABOUT THE PAGE</small>
            <p>Amount: {paymentData?.amount?.toLocaleString()}</p>
            <p>Description: {paymentData.description}</p>
            <div className="mt-2">
              Status:{" "}
              {paymentData.enabled ? (
                <span className="text-success fw-bold">Enabled</span>
              ) : (
                <span className="text-danger fw-bold">Disabled</span>
              )}
            </div>
            <div className="text-secondary mt-3" style={{ fontSize: "0.9rem" }}>
              Created at: {new Date(paymentData?.createdAt)?.toLocaleString()}
            </div>

            {/* {paymentData?.media?.length && (
              <div className="mb-3">
                {paymentData?.media?.map((preview, index) => (
                  <div key={index} className="mb-2">
                    {media[index]?.type.startsWith("image/") ? (
                      <img
                        src={preview}
                        alt="Media Preview"
                        className="img-fluid rounded mb-2"
                      />
                    ) : (
                      <video controls className="w-100 rounded mb-2">
                        <source src={preview} type={media[index]?.type} />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ))}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentViewPage;

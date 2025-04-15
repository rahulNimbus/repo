import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultAvatar from "../../assets/panda.png";

function PaymentViewPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  



  const handleChangeStatus = async (e) => {
    e.preventDefault();

    const payload = {
      "id": id,
      "enabled": paymentData?.enabled ? false : true,
    };

    try {
      const response = await axios.put(
        `http://localhost:8180/api/payment/pay`,
        payload,
        {
          withCredentials: true,
        }
      );

      console.log("response", response);
      alert("Status changed successfully!");
      fetchPaymentData();
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  

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
      <div className="row h-100 p-5">
        {/* <div className="col-md-6 border-end border-secondary">
          <h3 className="text-white mb-4">Payment Information</h3>

          <form
            onSubmit={handleSubmit}
            className="p-0"
            style={{ alignItems: "normal" }}
          >
            <div className="mb-3 position-relative">
              <label className="form-label" style={{ color: "#bbbbbb" }}>
                Name
              </label>
              <input
                type="text"
                name="name"
                className="form-control pe-5"
                disabled={!paymentData?.enabled}
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#ffffff",
                  borderColor: "#333333",
                }}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                maxLength={25}
              />
              {errors.name && (
                <div className="invalid-feedback d-block">{errors.name}</div>
              )}
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label" style={{ color: "#bbbbbb" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                disabled={!paymentData?.enabled}
                className="form-control pe-5"
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#ffffff",
                  borderColor: "#333333",
                }}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && (
                <div className="invalid-feedback d-block">{errors.email}</div>
              )}
            </div>

            <div className="mb-3 position-relative">
              <label className="form-label" style={{ color: "#bbbbbb" }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                disabled={!paymentData?.enabled}
                className="form-control pe-5"
                style={{
                  backgroundColor: "#1e1e1e",
                  color: "#ffffff",
                  borderColor: "#333333",
                }}
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone"
              />
              {errors.phone && (
                <div className="invalid-feedback d-block">{errors.phone}</div>
              )}
            </div>

            <div className="row">
              <div className="col-md-12 text-end">
                <button
                  type="submit"
                  className="btn btn-secondary px-4 rounded-pill"
                  disabled={!paymentData?.enabled}
                >
                  Save and Continue
                </button>
              </div>
            </div>
          </form>
          {!paymentData?.enabled && (
            <div className="text-center mt-4 text-danger">
              We're no longer accepting payments.
            </div>
          )}
        </div> */}

        <h3 className="text-white mb-4">Payment Information</h3>
        {loading ? (
          <>
            <div className="text-center mt-5 mb-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <h5>Title : {paymentData?.title}</h5>
              </div>

              <small style={{ color: "#bbbbbb" }}>ABOUT THE PAGE</small>
              <p>Amount: {paymentData?.amount?.toLocaleString()}</p>
              <p>Description: {paymentData?.description}</p>
              <div className="mt-2">
                Status:{" "}
                {paymentData?.enabled ? (
                  <>
                    <span className="text-success fw-bold">Enabled</span>
                    <button onClick={handleChangeStatus} className="btn btn-sm btn-secondary ms-4">
                      Change Status
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-danger fw-bold">Disabled</span>
                    <button onClick={handleChangeStatus} className="btn btn-sm btn-secondary ms-4">
                      Change Status
                    </button>
                  </>
                )}
              </div>
              <div
                className="text-secondary my-3"
                style={{ fontSize: "0.9rem" }}
              >
                Created at: {new Date(paymentData?.createdAt)?.toLocaleString()}
              </div>
            </div>

            <div className="col-md-6 border-start border-secondary">
              {paymentData?.media?.length > 0 ? (
                <div className="mb-4 text-center d-flex flex-wrap justify-content-center gap-3">
                  {paymentData.media.map((url, index) => {
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(url);

                    return isVideo ? (
                      <video
                        key={index}
                        controls
                        className="rounded-3 border border-secondary"
                        style={{
                          maxHeight: "200px",
                          maxWidth: "100%",
                          width: "350px",
                        }}
                      >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        key={index}
                        src={url}
                        alt={`media-${index}`}
                        className="img-fluid rounded-3 border border-secondary"
                        style={{
                          maxHeight: "200px",
                          objectFit: "cover",
                          width: "350px",
                        }}
                        onError={(e) => {
                          e.target.src = defaultAvatar; // fallback
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="mb-4 text-center">
                  <img
                    src={defaultAvatar}
                    alt="Default media"
                    className="img-fluid rounded-3"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentViewPage;

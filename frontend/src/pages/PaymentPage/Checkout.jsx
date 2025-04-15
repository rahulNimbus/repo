import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import defaultAvatar from "../../assets/panda.png";

function Checkout() {

    const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errs = {};

    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Invalid email format.";
    }

    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errs.phone = "Enter a valid 10-digit phone number.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      id: id,
      customer: { ...formData, status: "0" },
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
      alert("Checkout info submitted!");
      setFormData({ name: "", email: "", phone: "" });
    } catch (error) {
      alert(error.response.data.error);
      // console.log(error.response.data.error)
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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
    <>
      <div className="bg-dark text-white p-5  min-vh-100">
        <div className="row h-100">
          <div className="col-md-6 border-end border-secondary">
            <h3 className="text-white mb-4">Checkout</h3>

            <form
              onSubmit={handleSubmit}
              className="p-0"
              style={{ alignItems: "normal" }}
            >
              {/* Name */}
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

              {/* Email */}
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

              {/* Phone */}
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

              {/* Submit */}
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
          </div>

          <div className="col-md-6">
            <div
              className="border border-secondary p-3 rounded"
              style={{ backgroundColor: "#1e1e1e", color: "#e0e0e0" }}
            >
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
                  <div className="d-flex justify-content-between">
                    <h5>{paymentData?.title}</h5>
                  </div>

                  <small style={{ color: "#bbbbbb" }}>ABOUT THE PAGE</small>
                  <p>Amount: {paymentData?.amount?.toLocaleString()}</p>
                  <p>Description: {paymentData?.description}</p>
                  <div className="mt-2">
                    Status:{" "}
                    {paymentData?.enabled ? (
                      <span className="text-success fw-bold">Enabled</span>
                    ) : (
                      <span className="text-danger fw-bold">Disabled</span>
                    )}
                  </div>
                  <div
                    className="text-secondary my-3"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Created at:{" "}
                    {new Date(paymentData?.createdAt)?.toLocaleString()}
                  </div>

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
                              maxHeight: "150px",
                              maxWidth: "100%",
                              width: "260px",
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
                              maxHeight: "150px",
                              objectFit: "cover",
                              width: "260px",
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;

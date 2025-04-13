import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function InitiateWithdraw() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount.";
    }

    if (!description || description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost:8180/api/wallet/withdrawal/initiate",
        {
          amount: Number(amount),
          description: description.trim(),
        },
        {
          withCredentials: true, 
        }
      );

      alert("Withdrawal request submitted!");
      navigate("/dash");
      setAmount("");
      setDescription("");
      setErrors({});
    } catch (error) {
      console.error("Withdraw request failed:", error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="bg-dark text-white p-5 min-vh-100">
      <div className="row h-100">
        <div className="col-md-8">
          <h3 className="text-white mb-4">Withdraw</h3>
          <form
            onSubmit={handleSubmit}
            className="p-0"
            style={{ alignItems: "normal" }}
          >
            {/* Amount */}
            <div className="mb-3 position-relative">
              <label className="form-label" style={{ color: "#bbbbbb" }}>
                Amount
              </label>
              <input
                type="text"
                className={`form-control pe-5 text-white ${
                  errors.amount ? "is-invalid" : ""
                }`}
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

            {/* Description */}
            <div className="mb-3">
              <label className="form-label" style={{ color: "#bbbbbb" }}>
                Description
              </label>
              <textarea
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
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

            {/* Submit */}
            <div className="text-end">
              <button
                type="submit"
                className="btn btn-secondary px-4 rounded-pill"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InitiateWithdraw;

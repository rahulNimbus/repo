import React, { useState } from "react";
import logSvg from "../assets/log.svg";
import registerSvg from "../assets/register.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function LoginRegister() {
  const navigate = useNavigate();
  const [signUpMode, setSignUpMode] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateField = (name, value, values) => {
    let error = "";

    switch (name) {
      case "username":
        if (signUpMode && (!value || value.length < 3)) {
          error = "Username must be at least 3 characters";
        }
        break;
      case "email":
        if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value || value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (value !== values.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value, { ...formValues, [name]: value }),
    }));
  };

  const handleFormSubmit = async (e, type) => {
    e.preventDefault();
    const fieldsToValidate = signUpMode
      ? ["username", "email", "password", "confirmPassword"]
      : ["email", "password"];

    const newErrors = {};
    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formValues[field], formValues);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const url =
        type === "Sign Up"
          ? "http://localhost:8180/api/auth/register"
          : "http://localhost:8180/api/auth/login";

      const payload =
        type === "Sign Up"
          ? {
              username: formValues.username,
              email: formValues.email,
              password: formValues.password,
              confirmPassword: formValues.confirmPassword,
            }
          : { email: formValues.email, password: formValues.password };

      const response = await axios.post(url, payload, {
        withCredentials: true,
      });

      console.log(response)

      if (response.status === 200) {
        localStorage.setItem("user",response.data.user.id)
        setSuccessMessage(response.data.message || `${type} successful!`);
        navigate("/");
        setFormValues({});
        setErrors({});
        e.target.reset();
      }
    } catch (error) {
      setSuccessMessage("");
      setErrors({
        api:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      
      <div className={`containerS ${signUpMode ? "sign-up-mode" : ""}`}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign In Form */}
            <form
              onSubmit={(e) => handleFormSubmit(e, "Sign In")}
              className="sign-in-form"
              noValidate
            >
              <h2 className="title">Sign In</h2>

              <div className="input-field d-flex flex-column mb-3">
                <div
                  className="d-flex align-items-center"
                  style={{ paddingLeft: "10px" }}
                >
                  <i className="fas fa-envelope me-2"></i>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={formValues.email || ""}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>

              <div className="input-field d-flex flex-column mb-3">
                <div
                  className="d-flex align-items-center"
                  style={{ paddingLeft: "10px" }}
                >
                  <i className="fas fa-lock me-2"></i>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={formValues.password || ""}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              <button className="btn custom-button mt-2" type="submit">
                Sign In
              </button>
              {errors.api && (
                <small className="text-danger d-block mt-2">{errors.api}</small>
              )}
              {successMessage && (
                <small className="text-success d-block mt-2">
                  {successMessage}
                </small>
              )}
            </form>

            {/* Sign Up Form */}
            <form
              onSubmit={(e) => handleFormSubmit(e, "Sign Up")}
              className="sign-up-form"
              noValidate
            >
              <h2 className="title">Sign Up</h2>

              <div className="input-field d-flex flex-column mb-3">
                <div
                  className="d-flex align-items-center"
                  style={{ paddingLeft: "10px" }}
                >
                  <i className="fas fa-user me-2"></i>
                  <input
                    name="username"
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={formValues.username || ""}
                    onChange={handleChange}
                  />
                </div>
                {errors.username && (
                  <small className="text-danger">{errors.username}</small>
                )}
              </div>

              <div className="input-field d-flex flex-column mb-3">
                <div
                  className="d-flex align-items-center"
                  style={{ paddingLeft: "10px" }}
                >
                  <i className="fas fa-envelope me-2"></i>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={formValues.email || ""}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>

              <div className="input-field d-flex flex-column mb-3">
                <div
                  className="d-flex align-items-center"
                  style={{ paddingLeft: "10px" }}
                >
                  <i className="fas fa-lock me-2"></i>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={formValues.password || ""}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password}</small>
                )}
              </div>

              <div className="input-field d-flex flex-column mb-3">
                <div
                  className="d-flex align-items-center"
                  style={{ paddingLeft: "10px" }}
                >
                  <i className="fas fa-lock me-2"></i>
                  <input
                    name="confirmPassword"
                    type="password"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={formValues.confirmPassword || ""}
                    onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>

              <button className="btn custom-button mt-2" type="submit">
                Sign Up
              </button>
              {errors.api && (
                <small className="text-danger d-block mt-2">{errors.api}</small>
              )}
              {successMessage && (
                <small className="text-success d-block mt-2">
                  {successMessage}
                </small>
              )}
            </form>
          </div>
        </div>

        {/* Panels */}
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here?</h3>
              <p>Let’s change that! Create your free account now.</p>
              <button
                className="btn transparent"
                onClick={() => {
                  setSignUpMode(true);
                  setErrors({});
                  setSuccessMessage("");
                }}
              >
                Sign up
              </button>
            </div>
            <img src={logSvg} className="image" alt="log" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us?</h3>
              <p>We missed you! Log in to pick up where you left off.</p>
              <button
                className="btn transparent"
                onClick={() => {
                  setSignUpMode(false);
                  setErrors({});
                  setSuccessMessage("");
                }}
              >
                Sign in
              </button>
            </div>
            <img src={registerSvg} className="image" alt="register" />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginRegister;

import { useState, useRef } from "react";
import Icon from "@mdi/react";
import { mdiFolderArrowUpOutline } from "@mdi/js";
import axios from "axios";

const CreatePaymentPage = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleClearPreview = () => {
    setAmount("");
    setTitle("");
    setDescription("");
    setMedia([]);
    setMediaPreview([])
    
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      alert("Some files were too large and were skipped (Max 5MB each).");
    }

    setMedia((prev) => [...prev, ...validFiles]);
    setMediaPreview((prev) => [
      ...prev,
      ...validFiles.map((file) => URL.createObjectURL(file)),
    ]);

    // Reset the input to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleRemoveMedia = (index) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setMediaPreview((prev) => prev.filter((_, i) => i !== index));
  };

  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (title.length > 25)
      newErrors.title = "Title cannot exceed 25 characters.";
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      newErrors.amount = "Enter a valid positive number.";
    }
    if (!description.trim()) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Form submitted", {
      title,
      amount,
      description,
      media,
    });

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("amount", amount);
      formData.append("description", description);
      //   formData.append("media", media);
      Array.from(media).forEach((file) => {
        formData.append("media", file);
      });
      await axios.post("http://localhost:8180/api/payment/create", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Payment page created successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to create Payment page");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      alert("Some files were too big (max 5MB).");
    }

    setMedia(validFiles);
    setMediaPreview(validFiles.map((file) => URL.createObjectURL(file)));
  };

  return (
    <div className="bg-dark text-white p-5  min-vh-100">
      <div className="row h-100">
        {/* Form Side */}
        <div className="col-md-6 border-end border-secondary">
          <h3 className="text-white mb-4">Tell Us About Your Payment Page</h3>
          <form
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

            {/* Upload Box */}
            <div className="mb-3">
              <label className="form-label" style={{ color: "#bbbbbb" }}>
                Cover Image/Video (Max 5MB)
              </label>
              <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{
                  border: isDragActive
                    ? "2px solid #4dabf7"
                    : "2px dashed #555",
                  borderRadius: "8px",
                  padding: "40px",
                  backgroundColor: "#1e1e1e",
                  color: "#bbbbbb",
                  cursor: "pointer",
                  textAlign: "center",
                  position: "relative",
                  transition: "border 0.3s ease, background-color 0.3s ease",
                }}
                onClick={() => fileInputRef.current.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Icon path={mdiFolderArrowUpOutline} size={1} />
                <div>
                  <span
                    style={{ color: "#4dabf7", textDecoration: "underline" }}
                  >
                    Upload
                  </span>{" "}
                  or drag & drop
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    marginTop: "8px",
                    color: "#888888",
                  }}
                >
                  1280 x 720 (16:9) recommended; Up to 5MB each
                </div>
                <input
                  type="file"
                  accept="image/*,video/*"
                  // ref={fileInputRef}
                  onChange={handleMediaChange}
                  multiple
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                  }}
                />
              </div>
            </div>

            {/* <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#6200ea', borderColor: '#6200ea' }}>
                            Create Payment Page
                        </button> */}
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
          </form>
        </div>

        {/* Preview Side */}
        <div className="col-md-6">
          <h4 className="mb-3" style={{ color: "#ffffff" }}>
            Preview
          </h4>
          <div
            className="border border-secondary p-3 rounded"
            style={{ backgroundColor: "#1e1e1e", color: "#e0e0e0" }}
          >
            <div className="d-flex justify-content-between">
              <h5>{title || "Your Payment Page Title Here"}</h5>
              {
                (title || description || media.length || amount ) && <button
                onClick={handleClearPreview}
                className="btn btn-outline-danger"
              >
                Clear Preview
              </button>
              }
              
            </div>

            <small style={{ color: "#bbbbbb" }}>ABOUT THE PAGE</small>
            <p>Amount: {amount || "--"}</p>
            <p>{description || "Description Preview will appear here."}</p>

            {mediaPreview.length > 0 && (
              <div className="mb-3">
                {mediaPreview.map((preview, index) => (
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
                    <br />
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveMedia(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePaymentPage;

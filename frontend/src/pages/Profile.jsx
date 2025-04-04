import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Profile() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
       `http://localhost:8180/api/auth/getData/${localStorage.getItem("user")}`,
        { withCredentials: true }
      );
      setUserData(response.data.user);
      setFormValues(response.data.user);
      setAvatarPreview(response.data.user.avatar);
    } catch (err) {
      setError("Failed to fetch profile data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formValues.username || formValues.username.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }
    if (formValues.bio && formValues.bio.length > 150) {
      errors.bio = "Bio cannot exceed 150 characters.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("username", formValues.username);
      formData.append("bio", formValues.bio || "");
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response = await axios.put(
        "http://localhost:8180/api/auth/update",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //   setUserData(response.data.updatedUser);
      await fetchProfile();
      setEditing(false);
      setAvatarFile(null);
      setFormErrors({});
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="card shadow-lg border-0 rounded-4 p-4">
        {/* Avatar */}
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            <img
              src={avatarPreview || "https://via.placeholder.com/150"}
              alt="avatar"
              className="rounded-circle border"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
              }}
            />
            {editing && (
              <label
                className="btn btn-sm btn-dark position-absolute bottom-0 end-0 rounded-circle"
                style={{ padding: "8px 10px", cursor: "pointer" }}
              >
                <i className="fas fa-camera"></i>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  hidden
                />
              </label>
            )}
          </div>
          <h3 className="mt-3">{userData.username || "My Profile"}</h3>
          <p className="text-muted">{userData.email}</p>
        </div>

        {/* Form */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Username</label>
            {editing ? (
              <>
                <input
                  type="text"
                  name="username"
                  value={formValues.username || ""}
                  onChange={handleChange}
                  className="form-control shadow-sm"
                />
                {formErrors.username && (
                  <small className="text-danger">{formErrors.username}</small>
                )}
              </>
            ) : (
              <div className="fw-bold">{userData.username}</div>
            )}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <div className="fw-bold">{userData.email}</div>
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Bio</label>
            {editing ? (
              <>
                <textarea
                  name="bio"
                  value={formValues.bio || ""}
                  onChange={handleChange}
                  className="form-control shadow-sm"
                  rows="3"
                />
                {formErrors.bio && (
                  <small className="text-danger">{formErrors.bio}</small>
                )}
              </>
            ) : (
              <p className="text-muted">{userData.bio || "No bio provided."}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="text-end">
          {editing ? (
            <>
              <button
                className="btn btn-success me-2 px-4"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-outline-secondary px-4"
                onClick={() => {
                  setEditing(false);
                  setFormValues(userData);
                  setAvatarFile(null);
                  setFormErrors({});
                  setAvatarPreview(userData.avatar);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary px-4"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;

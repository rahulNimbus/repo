import { useState, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    ingredients: "",
    nutrition: "",
    recipe: "",
    duration: "",
    difficulty: "",
    media: null,
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const fileInputRef = useRef();

  const categories = ["Breakfast", "Lunch", "Dinner", "Desserts", "Vegan"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, media: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setMediaPreview(null);
    setForm((prev) => ({ ...prev, media: null }));
    fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      formData.append(key, form[key]);
    }

    try {
      await axios.post("http://localhost:8180/api/posts/create", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post created successfully!");
      // Optional: reset form after success
      setForm({
        title: "",
        content: "",
        category: "",
        ingredients: "",
        nutrition: "",
        recipe: "",
        duration: "",
        difficulty: "",
        media: null,
      });
      setMediaPreview(null);
      fileInputRef.current.value = "";
    } catch (err) {
      alert("Error creating post.");
    }
  };

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5">
        <h2 className="mb-4 text-center fw-bold">🍳 Create a New Food Post</h2>
        <form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="row w-100 mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-semibold">Title</label>
              <input
                type="text"
                name="title"
                className="form-control shadow-sm"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter title"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <select
                name="category"
                className="form-select shadow-sm"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="row w-100 mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-semibold">Difficulty</label>
              <select
                name="difficulty"
                className="form-select shadow-sm"
                value={form.difficulty}
                onChange={handleChange}
                required
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Duration (mins)</label>
              <input
                type="number"
                name="duration"
                className="form-control shadow-sm"
                value={form.duration}
                onChange={handleChange}
                placeholder="e.g., 45"
                required
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="row w-100 mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label fw-semibold">Ingredients</label>
              <textarea
                name="ingredients"
                className="form-control shadow-sm"
                rows="3"
                value={form.ingredients}
                onChange={handleChange}
                placeholder="List ingredients"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Nutrition Info</label>
              <textarea
                name="nutrition"
                className="form-control shadow-sm"
                rows="3"
                value={form.nutrition}
                onChange={handleChange}
                placeholder="Calories, Protein, etc."
              />
            </div>
          </div>

          {/* Description */}
          <div className="row w-100 mb-4">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="content"
              className="form-control shadow-sm"
              rows="3"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your post description"
              required
            />
          </div>

          {/* Recipe */}
          <div className="row w-100 mb-4">
            <label className="form-label fw-semibold">Recipe Instructions</label>
            <textarea
              name="recipe"
              className="form-control shadow-sm"
              rows="4"
              value={form.recipe}
              onChange={handleChange}
              placeholder="Step-by-step recipe"
              required
            />
          </div>

          {/* Media upload with preview */}
          <div className="row w-100 mb-4">
            <label className="form-label fw-semibold">Upload Image</label>
            <input
              ref={fileInputRef}
              type="file"
              name="media"
              className="form-control shadow-sm mb-3"
              accept="image/*"
              onChange={handleFileChange}
              required={!mediaPreview}
            />
            <div className="text-center">
              {mediaPreview ? (
                <div className="d-inline-block position-relative">
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                    onClick={removeImage}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="text-muted small">No image selected</div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill fw-bold">
              Publish Post 🚀
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default CreatePost;

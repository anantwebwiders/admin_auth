import React, { useState } from "react";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ApiUrls } from "../constants/api_urls";
import toast from "react-hot-toast";

const CreateCategory = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Basic validation (as per categoryRequest)
    let tempErrors = {};
    if (!form.name.trim()) tempErrors.name = "Name is required";

    if (Object.keys(tempErrors).length) {
      setErrors(tempErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("Authentication required. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.post(ApiUrls.CREATE_CATEGORY, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 1) {
        toast.success(response.data.message || "Category created successfully!");
        setForm({ name: "", description: "" });
        // Optionally navigate to categories list
        // navigate("/categories");
      } else {
        toast.error(response.data.message || "Failed to create category");
      }
    } catch (err) {
      // Handle backend validation errors
      if (err.response?.data?.error && Array.isArray(err.response.data.error)) {
        const errorMap = {};
        err.response.data.error.forEach((e) => {
          if (e.field) errorMap[e.field] = e.message;
        });
        setErrors(errorMap);
        toast.error("Please fix the validation errors");
      } else {
        const errorMsg = err.response?.data?.message || "Something went wrong!";
        setErrors({ general: errorMsg });
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68">
        <div className="relative w-full mx-auto mt-20">
          <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
              <div className="flex items-center">
                <p className="mb-0 dark:text-white/80">Create Category</p>
              </div>
            </div>
            <form role="form text-left" onSubmit={handleSubmit} className="p-6">
              {errors.general && (
                <div className="mb-4 text-red-600 font-medium bg-red-100 px-4 py-2 rounded">
                  {errors.general}
                </div>
              )}
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Category Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Category Name"
                  value={form.name}
                  onChange={handleChange}
                  className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                  aria-label="Category Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  placeholder="Category Description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                  aria-label="Description"
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-5 py-2.5 mt-2 font-bold text-white rounded-lg bg-gradient-to-tl from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating Category..." : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;

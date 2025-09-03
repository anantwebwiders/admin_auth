import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { ApiUrls } from "../constants/api_urls";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: "",
    name: "",
    description: ""
  });
  const [editErrors, setEditErrors] = useState({});
  const [editSubmitting, setEditSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.get(ApiUrls.ALL_CATEGORIES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 1 && Array.isArray(response.data.data)) {
        setCategories(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch categories");
      }
    } catch (err) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (id) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) {
      setEditForm({
        id: cat.id,
        name: cat.name || "",
        description: cat.description || ""
      });
      setEditErrors({});
      setEditModalOpen(true);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSubmitting(true);
    setEditErrors({});
    // Basic validation
    let tempErrors = {};
    if (!editForm.name.trim()) tempErrors.name = "Name is required";

    if (Object.keys(tempErrors).length) {
      setEditErrors(tempErrors);
      setEditSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      const payload = {
        name: editForm.name,
        description: editForm.description
      };
      const response = await axios.put(`${ApiUrls.ALL_CATEGORIES}/${editForm.id}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 1) {
        toast.success(response.data.message || "Category updated successfully!");
        setEditModalOpen(false);
        fetchCategories();
      } else {
        toast.error(response.data.message || "Failed to update category");
      }
    } catch (err) {
      if (err.response?.data?.error && Array.isArray(err.response.data.error)) {
        const errorMap = {};
        err.response.data.error.forEach((e) => {
          if (e.field) errorMap[e.field] = e.message;
        });
        setEditErrors(errorMap);
        toast.error("Please fix the validation errors");
      } else {
        toast.error(err.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem("auth_token");
      const response = await axios.delete(`${ApiUrls.ALL_CATEGORIES}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status === 1) {
        toast.success("Category deleted successfully");
        fetchCategories();
      } else {
        toast.error(response.data.message || "Failed to delete category");
      }
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <Layout>
      <main className="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68 rounded-xl bg-gradient-to-tl from-blue-500 to-violet-500">
        <div className="relative w-full mx-auto py-10">
          <div className="flex items-center justify-between px-6 pb-4">
            <h2 className="text-2xl font-bold text-white">All Categories</h2>
            <button
              className="px-4 py-2 font-semibold text-white rounded-lg bg-gradient-to-tl from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600"
              onClick={() => navigate("/create-category")}
            >
              Add Category
            </button>
          </div>
          <div className="mx-6 bg-white rounded-2xl shadow-3xl p-6">
            {loading ? (
              <p>Loading...</p>
            ) : categories.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id} className="border-b">
                      <td className="px-4 py-2">{cat.name}</td>
                      <td className="px-4 py-2">{cat.description}</td>
                      <td className="px-4 py-2">{cat.status ? "Active" : "Inactive"}</td>
                      <td className="px-4 py-2">
                        <button
                          className="mr-2 px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
                          onClick={() => handleEdit(cat.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 text-sm font-semibold text-white bg-red-500 rounded hover:bg-red-600"
                          onClick={() => handleDelete(cat.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {/* Edit Modal */}
            {editModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setEditModalOpen(false)}
                  >
                    &times;
                  </button>
                  <h3 className="text-xl font-bold mb-4">Edit Category</h3>
                  <form onSubmit={handleEditSubmit}>
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Category Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                      {editErrors.name && (
                        <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows="3"
                        className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        className="mr-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        onClick={() => setEditModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                        disabled={editSubmitting}
                      >
                        {editSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AllCategories;

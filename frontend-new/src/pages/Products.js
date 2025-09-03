import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiUrls } from '../constants/api_urls';
import toast from 'react-hot-toast';

const Products = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    sku: '',
    imageUrl: '',
    categoryId: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setErrors((prev) => ({ ...prev, imageUrl: undefined }));

    if (!file) return;

    setImageUploading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(ApiUrls.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 1 && response.data.data?.relativePath) {
        setForm((prev) => ({
          ...prev,
          imageUrl: response.data.data.relativePath
        }));
        toast.success('Image uploaded!');
      } else {
        setErrors((prev) => ({
          ...prev,
          imageUrl: response.data.message || 'Image upload failed'
        }));
        toast.error(response.data.message || 'Image upload failed');
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        imageUrl: 'Image upload failed'
      }));
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Basic validation
    let tempErrors = {};
    if (!form.name.trim()) tempErrors.name = 'Product name is required';
    if (!form.price || form.price <= 0) tempErrors.price = 'Valid price is required';
    if (!form.stock || form.stock < 0) tempErrors.stock = 'Valid stock quantity is required';
    if (!form.sku.trim()) tempErrors.sku = 'SKU is required';
    if (!form.categoryId) tempErrors.categoryId = 'Category is required';
    // imageUrl is optional, but if file selected and not uploaded, show error
    if (imageFile && !form.imageUrl) tempErrors.imageUrl = 'Please wait for image upload to finish';

    if (Object.keys(tempErrors).length) {
      setErrors(tempErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Authentication required. Please login again.');
        navigate('/login');
        return;
      }

      const response = await axios.post(ApiUrls.PRODUCTS, form, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 1) {
        toast.success(response.data.message || 'Product created successfully!');
        setForm({
          name: '',
          description: '',
          price: '',
          stock: '',
          sku: '',
          imageUrl: '',
          categoryId: ''
        });
        setImageFile(null);
        // Optionally navigate to products list
        // navigate('/products');
      } else {
        toast.error(response.data.message || 'Failed to create product');
      }
    } catch (err) {
      // Handle backend validation errors
      if (err.response?.data?.error && Array.isArray(err.response.data.error)) {
        const errorMap = {};
        err.response.data.error.forEach((e) => {
          if (e.field) {
            errorMap[e.field] = e.message;
          }
        });
        setErrors(errorMap);
        toast.error('Please fix the validation errors');
      } else {
        const errorMsg = err.response?.data?.message || 'Something went wrong!';
        setErrors({ general: errorMsg });
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(
          `${ApiUrls.PRODUCTS.replace('/products', '/categories')}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Check for status: 1 instead of success
        if (response.data.status === 1 && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          toast.error('Failed to fetch categories');
        }
      } catch (err) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  return (
    <Layout>
      <div className="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68">
        <nav className="absolute z-20 flex flex-wrap items-center justify-between w-full px-6 py-2 -mt-56 text-white transition-all ease-in shadow-none duration-250 lg:flex-nowrap lg:justify-start" navbar-profile navbar-scroll="true">
          <div className="flex items-center justify-between w-full px-6 py-1 mx-auto flex-wrap-inherit">
            <nav>
              <ol className="flex flex-wrap pt-1 pl-2 pr-4 mr-12 bg-transparent rounded-lg sm:mr-16">
                <li className="leading-normal text-sm">
                  <a className="opacity-50" href="javascript:;">Products</a>
                </li>
                <li className="text-sm pl-2 capitalize leading-normal before:float-left before:pr-2 before:content-['/']" aria-current="page">Create Product</li>
              </ol>
              <h6 className="mb-2 ml-2 font-bold text-white capitalize dark:text-white">Create New Product</h6>
            </nav>

            <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
              {/* Search and other nav items can go here */}
            </div>
          </div>
        </nav>

        <div className="relative w-full mx-auto mt-60">
          <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-6 overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
            <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
              <div className="flex items-center">
                <p className="mb-0 dark:text-white/80">Add New Product</p>
              </div>
            </div>
            
            <form role="form text-left" onSubmit={handleSubmit} className="p-6">
              {errors.general && (
                <div className="mb-4 text-red-600 font-medium bg-red-100 px-4 py-2 rounded">
                  {errors.general}
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={handleChange}
                  className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                  aria-label="Product Name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  placeholder="Product Description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                  aria-label="Description"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={form.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                    aria-label="Price"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={handleChange}
                    min="0"
                    className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                    aria-label="Stock"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    placeholder="SKU"
                    value={form.sku}
                    onChange={handleChange}
                    className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                    aria-label="SKU"
                  />
                  {errors.sku && (
                    <p className="text-red-500 text-sm mt-1">{errors.sku}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                    aria-label="Category"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-1 text-sm font-medium text-gray-700">Product Image</label>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                  aria-label="Product Image"
                  disabled={imageUploading}
                />
                {imageUploading && (
                  <p className="text-blue-500 text-sm mt-1">Uploading image...</p>
                )}
                {form.imageUrl && !imageUploading && (
                  <p className="text-green-500 text-sm mt-1">Image uploaded!</p>
                )}
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-5 py-2.5 mt-2 font-bold text-white rounded-lg bg-gradient-to-tl from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating Product...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ApiUrls } from '../constants/api_urls';



const RESET_PASSWORD = () => {
  const navigate = useNavigate();
  
    useEffect(() => {
      const user = localStorage.getItem('auth_token');
      if (user) {
        // navigate('/dashboard'); 
      }
    }, []);
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setErrors({});
  setSuccess('');

  try {
    const token = localStorage.getItem('auth_token');
    const res = await axios.put(ApiUrls.RESET_PASSWORD, form, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      withCredentials: false
    });

    if (res.data.status === 1) {
      setSuccess(res.data.message);
      setTimeout(() => {
        localStorage.removeItem('user');     
  localStorage.removeItem('auth_token');    
        navigate("/login");
      }, 2000);
    }
  } catch (err) {
  const resData = err.response?.data;
  
  // if 'error' is array (field-wise errors)
  if (Array.isArray(resData?.error)) {
    const fieldErrors = {};
    resData.error.forEach((e) => {
      if (!fieldErrors[e.field]) {
        fieldErrors[e.field] = e.message;
      }
    });
    setErrors(fieldErrors);
  }
  
  // if 'error' is string (like token missing, auth fail etc.)
  else if (typeof resData?.error === 'string') {
    setError(resData.error); // general error message
  }


  else {
    setError(resData?.message || 'Something went wrong');
  }
}

};

  return (
    <section className="min-h-screen mb-32 bg-gray-100">
      <div class="container sticky top-0 z-sticky">
      <div class="flex flex-wrap -mx-3">
        <div class="w-full max-w-full px-3 flex-0">
        
          
        </div>
      </div>
    </div>
    <main class="mt-0 transition-all duration-200 ease-in-out">
      <section>
        <div class="relative flex items-center min-h-screen p-0 overflow-hidden bg-center bg-cover">
          <div class="container z-1">
            <div class="flex flex-wrap -mx-3">
              <div class="flex flex-col w-full max-w-full px-3 mx-auto lg:mx-0 shrink-0 md:flex-0 md:w-7/12 lg:w-5/12 xl:w-4/12">
                <div class="relative flex flex-col min-w-0 break-words bg-transparent border-0 shadow-none lg:py4 dark:bg-gray-950 rounded-2xl bg-clip-border">
                  <div class="p-6 pb-0 mb-0">
                    <h4 class="font-bold">Reset Password</h4>
                    <p class="mb-0">Enter your old  and new password</p>
                  </div>
                  <div class="flex-auto p-6">
                    <form role="form" onSubmit={handleSubmit}>
  {/* General Error or Success */}
  {error && <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>}
  {success && <div className="mb-4 text-green-600 bg-green-100 p-2 rounded">{success}</div>}

  {/* Old Password */}
  <div className="mb-4">
    <input
      type="password"
      name="oldPassword"
      placeholder="Old password"
      value={form.oldPassword}
      onChange={handleChange}
      className="text-sm block w-full rounded-lg border p-3 text-gray-700 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
    />
    {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>}
  </div>

  {/* New Password */}
  <div className="mb-4">
    <input
      type="password"
      name="newPassword"
      placeholder="New password"
      value={form.newPassword}
      onChange={handleChange}
      className="text-sm block w-full rounded-lg border p-3 text-gray-700 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
    />
    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
  </div>

  {/* Confirm Password */}
  <div className="mb-4">
    <input
      type="password"
      name="confirmPassword"
      placeholder="Confirm password"
      value={form.confirmPassword}
      onChange={handleChange}
      className="text-sm block w-full rounded-lg border p-3 text-gray-700 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
    />
    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
  </div>

  <div className="text-center">
    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600">
      Submit
    </button>
  </div>
</form>

                  </div>
                  <div class="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center pt-0 px-1 sm:px-6">
                  </div>
                </div>
              </div>
              <div class="absolute top-0 right-0 flex-col justify-center hidden w-6/12 h-full max-w-full px-3 pr-0 my-auto text-center flex-0 lg:flex">
                <div class="relative flex flex-col justify-center h-full bg-cover px-24 m-4 overflow-hidden bg-[url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg')] rounded-xl ">
                  <span class="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-blue-500 to-violet-500 opacity-60"></span>
                  <h4 class="z-20 mt-12 font-bold text-white">"Attention is the new currency"</h4>
                  <p class="z-20 text-white ">The more effortless the writing looks, the more effort the writer actually put into the process.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <footer class="py-12">
      <div class="container">
        <div class="flex flex-wrap -mx-3">
          <div class="flex-shrink-0 w-full max-w-full mx-auto mb-6 text-center lg:flex-0 lg:w-8/12">
            <a href="javascript:;" target="_blank" class="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"> Company </a>
            <a href="javascript:;" target="_blank" class="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"> About Us </a>
            <a href="javascript:;" target="_blank" class="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"> Team </a>
            <a href="javascript:;" target="_blank" class="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"> Products </a>
            <a href="javascript:;" target="_blank" class="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"> Blog </a>
            <a href="javascript:;" target="_blank" class="mb-2 mr-4 text-slate-400 sm:mb-0 xl:mr-12"> Pricing </a>
          </div>
          <div class="flex-shrink-0 w-full max-w-full mx-auto mt-2 mb-6 text-center lg:flex-0 lg:w-8/12">
            <a href="javascript:;" target="_blank" class="mr-6 text-slate-400">
              <span class="text-lg fab fa-dribbble"></span>
            </a>
            <a href="javascript:;" target="_blank" class="mr-6 text-slate-400">
              <span class="text-lg fab fa-twitter"></span>
            </a>
            <a href="javascript:;" target="_blank" class="mr-6 text-slate-400">
              <span class="text-lg fab fa-instagram"></span>
            </a>
            <a href="javascript:;" target="_blank" class="mr-6 text-slate-400">
              <span class="text-lg fab fa-pinterest"></span>
            </a>
            <a href="javascript:;" target="_blank" class="mr-6 text-slate-400">
              <span class="text-lg fab fa-github"></span>
            </a>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3">
          <div class="w-8/12 max-w-full px-3 mx-auto mt-1 text-center flex-0">
            <p class="mb-0 text-slate-400">
              Copyright ©
             
              Argon Dashboard 2 by Creative Tim.
            </p>
          </div>
        </div>
      </div>
    </footer>
    </section>
  );
};

export default RESET_PASSWORD;

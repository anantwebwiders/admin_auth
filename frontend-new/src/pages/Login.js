import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ApiUrls } from '../constants/api_urls';



const Login = () => {
  const navigate = useNavigate();
  
    useEffect(() => {
      const user = localStorage.getItem('user');
      if (user) {
        navigate('/dashboard'); 
      }
    }, []);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setError('');
    try {
     const res = await axios.post(ApiUrls.LOGIN, form, {
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: false // true only if using cookies
});

      console.log(res);
      // handleLoginSubmit function ke andar jab response mil jaye
if (res.data.status === 1) {
  // Save token
  localStorage.setItem("auth_token", res.data.data.token);

  // Optionally save user info
  localStorage.setItem("auth_user", JSON.stringify(res.data.data));

  // setSuccess(res.data.message);
  setTimeout(() => {
    navigate("/dashboard");
  }, 1000);
}

    
       // redirect
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };
  return (
    <section className="bg-gray-100">
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
                    <h4 class="font-bold">Sign In</h4>
                    <p class="mb-0">Enter your email and password to sign in</p>
                  </div>
                  <div class="flex-auto p-6">
                    <form role="form" onSubmit={handleSubmit}>
                       {error && (
                        <div className="mb-4 text-red-600 font-medium bg-red-100 px-4 py-2 rounded">
                        {error}
                        </div>
                    )}
                        <div className="mb-4">
                          <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="focus:shadow-primary-outline text-sm block w-full rounded-lg border p-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
                          />
                        </div>
                        <div className="mb-4">
                          <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="focus:shadow-primary-outline text-sm block w-full rounded-lg border p-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-fuchsia-300 focus:outline-none"
                          />
                        </div>
                     
                        <div className="text-center">
                          <button
                            type="submit"
                            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                          >
                            Sign in
                          </button>
                        </div>
                      </form>
                  </div>
                  <div class="border-black/12.5 rounded-b-2xl border-t-0 border-solid p-6 text-center pt-0 px-1 sm:px-6">
                    <p class="mx-auto mb-6 leading-normal text-sm">Don't have an account? <Link to="/register" class="font-semibold text-transparent bg-clip-text bg-gradient-to-tl from-blue-500 to-violet-500">Sign up</Link></p>
                    <p class="mx-auto mb-6 leading-normal text-sm"><Link to="/forget-password" class="font-semibold text-transparent bg-clip-text bg-gradient-to-tl from-blue-500 to-violet-500">Forget Password?</Link></p>
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
    
    </section>
  );
};

export default Login;

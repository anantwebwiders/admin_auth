import React, { useState,  useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RoutesPath  } from '../constants/route_paths';
import { ApiUrls  } from '../constants/api_urls';
 


const Register = () => {
    const navigate = useNavigate();
    
      useEffect(() => {
        const user = localStorage.getItem('auth_token');
        if (user) {
          navigate('/dashboard');
        }
      }, []);
     const [form, setForm] = useState({
     name: '',
      email: '',
      mobile: '',
      gender: '',
      password: '',
      confirmPassword: '',
      profile: '',
      terms: false
      });

  const [errors, setErrors] = useState({});

  const [success, setSuccess] = useState('');
  const [preview, setPreview] = useState(null);

  const validateForm = () => {
  const newErrors = {};

  if (!form.name.trim()) {
    newErrors.name = 'Name is required';
  }

  if (!form.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    newErrors.email = 'Invalid email format';
  }

  if (!form.mobile.trim()) {
    newErrors.mobile = 'Mobile number is required';
  } else if (!/^[0-9]{10}$/.test(form.mobile)) {
    newErrors.mobile = 'Mobile number must be 10 digits';
  }

  if (!form.gender) {
    newErrors.gender = 'Gender is required';
  } else if (!['male', 'female', 'other'].includes(form.gender)) {
    newErrors.gender = 'Invalid gender value';
  }

  if (!form.password) {
    newErrors.password = 'Password is required';
  } else if (form.password.length < 6) {
    newErrors.password = 'Password must be at least 6 characters';
  }

  if (!form.profile) {
    newErrors.profile = 'Profile is required';
  }

  if (form.terms == false) {
    newErrors.terms = 'Please accept terms and conditions';
  } 

  if (!form.confirmPassword) {
    newErrors.confirmPassword = 'Confirm password is required';
  } else if (form.password !== form.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  return newErrors;
};


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});
  setSuccess('');

  // ✅ 1. Frontend validation
  const clientErrors = validateForm();
  if (Object.keys(clientErrors).length > 0) {
    setErrors(clientErrors);
    return;
  }

  try {
    let profilePath = '';

    // ✅ 2. If user uploaded profile image, upload it to /api/upload
    if (form.profile) {
      const profileData = new FormData();
      profileData.append('file', form.profile);
      profileData.append('path', 'upload/userProfile'); // 👈 path passed as field

      const uploadRes = await axios.post(ApiUrls.UPLOAD, profileData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (uploadRes.data.status === 1) {
        profilePath = uploadRes.data.data.relativePath; // 👈 extract relativePath
      } else {
        setErrors({ profile: 'Failed to upload profile picture.' });
        return;
      }
    }

    // ✅ 3. Now submit REGISTER form with profilePath (if any)
    const registerFormData = new FormData();
    for (const key in form) {
      if (key === 'profile') {
        if (profilePath) {
          registerFormData.append('profile', profilePath); // use uploaded path
        }
      } else {
        registerFormData.append(key, form[key]);
      }
    }

    const res = await axios.post(ApiUrls.REGISTER, registerFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // ✅ 4. Success handling
    setSuccess(res.data.message);
    setTimeout(() => {
      navigate('/login');
    }, 2000);

  } catch (err) {
    // ✅ 5. Error handling
    console.log(err);
    if (err.response?.data?.error && Array.isArray(err.response.data.error)) {
      const errorMap = {};
      err.response.data.error.forEach((e) => {
        if (!errorMap[e.field]) {
          errorMap[e.field] = e.message;
        }
      });
      setErrors(errorMap);
    } else {
      setErrors({
        general: err.response?.data?.message || 'Something went wrong!',
      });
    }
  }
};


 
 useEffect(() => {
  if (success) {
    setForm({
      name: '',
      email: '',
      password: '',
      mobile: '',
      gender: '',
      confirmPassword: '',
      profile: null,
    });

    setPreview(null); // 👈 Clear image preview on success
  }
}, [success]);

    return (
             <section class="m-0 font-sans antialiased font-normal bg-white text-start text-base leading-default text-slate-500">
    <nav class="absolute top-0 z-30 flex flex-wrap items-center justify-between w-full px-4 py-2 mt-6 mb-4 shadow-none lg:flex-nowrap lg:justify-start">
      <div class="container flex items-center justify-between py-0 flex-wrap-inherit">
        <a class="py-1.75 ml-4 mr-4 font-bold text-white text-sm whitespace-nowrap lg:ml-0" href="https://demos.creative-tim.com/argon-dashboard-tailwind/pages/dashboard.html" target="_blank"> Argon Dashboard 2 </a>
        <button navbar-trigger class="px-3 py-1 ml-2 leading-none transition-all ease-in-out bg-transparent border border-transparent border-solid rounded-lg shadow-none cursor-pointer text-lg lg:hidden" type="button" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
          <span class="inline-block mt-2 align-middle bg-center bg-no-repeat bg-cover w-6 h-6 bg-none">
            <span bar1 class="w-5.5 rounded-xs duration-350 relative my-0 mx-auto block h-px bg-white transition-all"></span>
            <span bar2 class="w-5.5 rounded-xs mt-1.75 duration-350 relative my-0 mx-auto block h-px bg-white transition-all"></span>
            <span bar3 class="w-5.5 rounded-xs mt-1.75 duration-350 relative my-0 mx-auto block h-px bg-white transition-all"></span>
          </span>
        </button>
        <div navbar-menu class="items-center flex-grow transition-all ease duration-350 lg-max:bg-white lg-max:max-h-0 lg-max:overflow-hidden basis-full rounded-2xl lg:flex lg:basis-auto">
          <ul class="flex flex-col pl-0 mx-auto mb-0 list-none lg-max:py-2 lg:flex-row xl:ml-auto">
            {/* <li>
              <a class="flex items-center px-4 py-2 mr-2 font-normal text-white transition-all ease-in-out duration-250 lg-max:opacity-0 lg-max:text-slate-700 text-sm lg:px-2 lg:hover:text-white/75" aria-current="page" href="../pages/dashboard.html">
                <i class="mr-1 text-white lg-max:text-slate-700 fa fa-chart-pie opacity-60"></i>
                Dashboard
              </a>
            </li> */}
            {/* <li>
              <a class="block px-4 py-2 mr-2 font-normal text-white transition-all ease-in-out duration-250 lg-max:opacity-0 lg-max:text-slate-700 text-sm lg:px-2 lg:hover:text-white/75" href="../pages/profile.html">
                <i class="mr-1 text-white lg-max:text-slate-700 fa fa-user opacity-60"></i>
                Profile
              </a>
            </li> */}
            {/* <li>
              <a class="block px-4 py-2 mr-2 font-normal text-white transition-all ease-in-out duration-250 lg-max:opacity-0 lg-max:text-slate-700 text-sm lg:px-2 lg:hover:text-white/75" href="../pages/sign-up.html">
                <i class="mr-1 text-white lg-max:text-slate-700 fas fa-user-circle opacity-60"></i>
                Sign Up
              </a>
            </li> */}
            {/* <li>
              <Link to="/login" className="block px-4 py-2 mr-2 font-normal text-white transition-all ease-in-out duration-250 lg-max:opacity-0 lg-max:text-slate-700 text-sm lg:px-2 lg:hover:text-white/75" >
                <i class="mr-1 text-white lg-max:text-slate-700 fas fa-key opacity-60"></i>
                Sign In
              </Link>
            </li> */}
          </ul>
        
       
        </div>
      </div>
    </nav>

    <main class="mt-0 transition-all duration-200 ease-in-out">
      <section class="min-h-screen">
        <div class="bg-top relative flex items-start pt-12 pb-56 m-4 overflow-hidden bg-cover min-h-50-screen rounded-xl bg-[url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg')]">
          <span class="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-gradient-to-tl from-zinc-800 to-zinc-700 opacity-60"></span>
          <div class="container z-10">
            <div class="flex flex-wrap justify-center -mx-3">
              <div class="w-full max-w-full px-3 mx-auto mt-0 text-center lg:flex-0 shrink-0 lg:w-5/12">
                <h1 class="mt-12 mb-2 text-white">Welcome!</h1>
                <p class="text-white">Use these awesome forms to login or create new account in your project for free.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="flex flex-wrap -mx-3 -mt-48 md:-mt-56 lg:-mt-48">
            <div class="w-full max-w-full px-3 mx-auto mt-0 md:flex-0 shrink-0 md:w-7/12 lg:w-5/12 xl:w-4/12">
              <div class="relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-xl rounded-2xl bg-clip-border">
                <div class="p-6 mb-0 text-center bg-white border-b-0 rounded-t-2xl">
                  <h5>Register with</h5>
                </div>
                <div class="flex flex-wrap px-3 -mx-3 sm:px-6 xl:px-12">
                  <div class="w-3/12 max-w-full px-1 ml-auto flex-0">
                    <a class="inline-block w-full px-5 py-2.5 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:-translate-y-px leading-pro text-xs ease-in tracking-tight-rem bg-150 bg-x-25 hover:bg-transparent hover:opacity-75" href="javascript:;">
                      <svg width="24px" height="32px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g transform="translate(3.000000, 3.000000)" fill-rule="nonzero">
                            <circle fill="#3C5A9A" cx="29.5091719" cy="29.4927506" r="29.4882047"></circle>
                            <path d="M39.0974944,9.05587273 L32.5651312,9.05587273 C28.6886088,9.05587273 24.3768224,10.6862851 24.3768224,16.3054653 C24.395747,18.2634019 24.3768224,20.1385313 24.3768224,22.2488655 L19.8922122,22.2488655 L19.8922122,29.3852113 L24.5156022,29.3852113 L24.5156022,49.9295284 L33.0113092,49.9295284 L33.0113092,29.2496356 L38.6187742,29.2496356 L39.1261316,22.2288395 L32.8649196,22.2288395 C32.8649196,22.2288395 32.8789377,19.1056932 32.8649196,18.1987181 C32.8649196,15.9781412 35.1755132,16.1053059 35.3144932,16.1053059 C36.4140178,16.1053059 38.5518876,16.1085101 39.1006986,16.1053059 L39.1006986,9.05587273 L39.0974944,9.05587273 L39.0974944,9.05587273 Z" fill="#FFFFFF"></path>
                          </g>
                        </g>
                      </svg>
                    </a>
                  </div>
                  <div class="w-3/12 max-w-full px-1 flex-0">
                    <a class="inline-block w-full px-5 py-2.5 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:-translate-y-px leading-pro text-xs ease-in tracking-tight-rem bg-150 bg-x-25 hover:bg-transparent hover:opacity-75" href="javascript:;">
                      <svg width="24px" height="32px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g transform="translate(7.000000, 0.564551)" fill="#000000" fill-rule="nonzero">
                            <path
                              d="M40.9233048,32.8428307 C41.0078713,42.0741676 48.9124247,45.146088 49,45.1851909 C48.9331634,45.4017274 47.7369821,49.5628653 44.835501,53.8610269 C42.3271952,57.5771105 39.7241148,61.2793611 35.6233362,61.356042 C31.5939073,61.431307 30.2982233,58.9340578 25.6914424,58.9340578 C21.0860585,58.9340578 19.6464932,61.27947 15.8321878,61.4314159 C11.8738936,61.5833617 8.85958554,57.4131833 6.33064852,53.7107148 C1.16284874,46.1373849 -2.78641926,32.3103122 2.51645059,22.9768066 C5.15080028,18.3417501 9.85858819,15.4066355 14.9684701,15.3313705 C18.8554146,15.2562145 22.5241194,17.9820905 24.9003639,17.9820905 C27.275104,17.9820905 31.733383,14.7039812 36.4203248,15.1854154 C38.3824403,15.2681959 43.8902255,15.9888223 47.4267616,21.2362369 C47.1417927,21.4153043 40.8549638,25.1251794 40.9233048,32.8428307 M33.3504628,10.1750144 C35.4519466,7.59650964 36.8663676,4.00699306 36.4804992,0.435448578 C33.4513624,0.558856931 29.7884601,2.48154382 27.6157341,5.05863265 C25.6685547,7.34076135 23.9632549,10.9934525 24.4233742,14.4943068 C27.7996959,14.7590956 31.2488715,12.7551531 33.3504628,10.1750144"
                            ></path>
                          </g>
                        </g>
                      </svg>
                    </a>
                  </div>
                  <div class="w-3/12 max-w-full px-1 mr-auto flex-0">
                    <a class="inline-block w-full px-5 py-2.5 mb-4 font-bold text-center text-gray-200 uppercase align-middle transition-all bg-transparent border border-gray-200 border-solid rounded-lg shadow-none cursor-pointer hover:-translate-y-px leading-pro text-xs ease-in tracking-tight-rem bg-150 bg-x-25 hover:bg-transparent hover:opacity-75" href="javascript:;">
                      <svg width="24px" height="32px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <g transform="translate(3.000000, 2.000000)" fill-rule="nonzero">
                            <path d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267" fill="#4285F4"></path>
                            <path d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667" fill="#34A853"></path>
                            <path d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782" fill="#FBBC05"></path>
                            <path d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769" fill="#EB4335"></path>
                          </g>
                        </g>
                      </svg>
                    </a>
                  </div>
                  <div class="relative w-full max-w-full px-3 mt-2 text-center shrink-0">
                    <p class="z-20 inline px-4 mb-2 font-semibold leading-normal bg-white text-sm text-slate-400">or</p>
                  </div>
                </div>
                <div class="flex-auto p-6">
                <form role="form text-left" onSubmit={handleSubmit}>
                  {success && (
                    <div className="mb-4 text-green-600 font-medium bg-green-100 px-4 py-2 rounded">
                      {success}
                    </div>
                  )}
                 


                  {/* Name */}
                  <div className="mb-4">
                    <input type="text" name="name"  placeholder="Name" value={form.name} onChange={handleChange}
                      className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                      aria-label="Name" />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      

                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <input type="email" name="email"   placeholder="Email" value={form.email} onChange={handleChange}
                      className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                      aria-label="Email" />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                  </div>

                  {/* Mobile Number */}
                  <div className="mb-4">
                    <input type="text" name="mobile"   placeholder="Mobile Number" value={form.mobile} onChange={handleChange}
                      className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                      aria-label="Mobile Number" />
                      {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                  </div>

                  {/* Gender */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Gender:</label>
                    <div className="flex gap-4">
                      <label>
                        <input type="radio" name="gender"   value="male" checked={form.gender === 'male'} onChange={handleChange} />
                        <span className="ml-2 text-sm">Male</span>
                      </label>
                      <label>
                        <input type="radio" name="gender"   value="female" checked={form.gender === 'female'} onChange={handleChange} />
                        <span className="ml-2 text-sm">Female</span>
                      </label>
                      <label>
                        <input type="radio" name="gender"   value="other" checked={form.gender === 'other'} onChange={handleChange} />
                        <span className="ml-2 text-sm">Other</span>
                      </label>
                    </div>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>

                  {/* Profile Picture */}
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Profile Picture:</label>
                    <input
                      type="file"
                      name="profile"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setForm({ ...form, profile: file });
                          setPreview(URL.createObjectURL(file));
                        }
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.profile && <p className="text-red-500 text-sm mt-1">{errors.profile}</p>}

                    {/* ✅ Image Preview */}
                    {preview && (
                      <div className="mt-4">
                        <img
                          src={preview}
                          alt="Profile Preview"
                          className="w-24 h-24 object-cover border-2 border-gray-300"
                        />
                      </div>
                    )}
                  </div>


                  {/* Password */}
                  <div className="mb-4">
                    <input type="password" name="password"   placeholder="Password" value={form.password} onChange={handleChange}
                      className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                      aria-label="Password" />
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <input type="password" name="confirmPassword"   placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange}
                      className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
                      aria-label="Confirm Password" />
                      {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="min-h-6 pl-7 mb-0.5 block">
                    <input
  className="..."
  type="checkbox"
  name="terms"
  checked={form.terms || false}
  onChange={(e) => setForm({ ...form, terms: e.target.checked })}
/>

                    <label className="ml-2 font-normal text-sm text-slate-700"> I agree to the <a href="javascript:;" className="font-bold">Terms and Conditions</a> </label>
                    {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <button type="submit"
                      className="w-full px-5 py-2.5 mt-6 mb-2 font-bold text-white rounded-lg bg-gradient-to-tl from-zinc-800 to-zinc-700 hover:bg-slate-700 transition-all">
                      Sign up
                    </button>
                  </div>

                  {/* Already have account */}
                  <p className="mt-4 mb-0 leading-normal text-sm">Already have an account? <Link to="/login" className="font-bold text-slate-700">Sign in</Link></p>
                </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
                <script>
                  document.write(new Date().getFullYear());
                </script>
                Argon Dashboard 2 by Creative Tim.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
 </section>
    );

};

export default Register;
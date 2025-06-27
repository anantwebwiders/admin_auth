import React,{ useState,  useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ApiUrls } from '../constants/api_urls';
import { fetchUserData } from "../services/authService";


const Profile = () => {
  const navigate = useNavigate();
const [user, setUser] = useState(null);
const [form, setForm] = useState({
  name: '',
  email: '',
  mobile: '',
  gender: '',
  about: '',
  profile: null,
});
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
const [errors, setErrors] = useState({});
const [success, setSuccess] = useState('');

// ✅ Check auth + set user
useEffect(() => {
  const token = localStorage.getItem('auth_token');
  const storedUser = localStorage.getItem('auth_user');

  if (!token) {
    navigate('/login');
    return;
  }

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // ✅ Set form values now
    setForm({
      name: parsedUser.name || '',
      email: parsedUser.email || '',
      mobile: parsedUser.mobile || '',
      gender: parsedUser.gender || '',
      about: parsedUser.about || '',
      profile: null,
    });

    // Optional name split
    const nameParts = parsedUser.name.trim().split(' ');
    setFirstName(nameParts[0]);
    setLastName(nameParts.slice(1).join(' '));
  }
}, []);
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm({ ...form, [name]: value });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // ✅ Client-side validation (example)
  let tempErrors = {};
  if (!form.name.trim()) tempErrors.name = 'Name is required';
  if (!form.email.trim()) tempErrors.email = 'Email is required';
  if (!form.mobile.trim()) tempErrors.mobile = 'Mobile is required';
  if (!form.gender) tempErrors.gender = 'Please select gender';

  if (Object.keys(tempErrors).length) {
    setErrors(tempErrors);
    return;
  }

  setErrors({});
  try {
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

  const res = await axios.put(ApiUrls.UPDATE_PROFILE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
     
        fetchUserData(setUser); 
     
        setSuccess(res.data.message);

  } catch (err) {
    console.error(err);
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

  const profileImageSrc = user?.profile
  ? `http://localhost:5000/${user.profile.replace(/\\/g, '/')}` // 👈 Windows \ to / fix
  : '/assets/img/team-2.jpg'; // 👈 default fallback image

    return (
<Layout> <div class="relative h-full max-h-screen transition-all duration-200 ease-in-out xl:ml-68">
      <nav class="absolute z-20 flex flex-wrap items-center justify-between w-full px-6 py-2 -mt-56 text-white transition-all ease-in shadow-none duration-250 lg:flex-nowrap lg:justify-start" navbar-profile navbar-scroll="true">
        <div class="flex items-center justify-between w-full px-6 py-1 mx-auto flex-wrap-inherit">
          <nav>
            <ol class="flex flex-wrap pt-1 pl-2 pr-4 mr-12 bg-transparent rounded-lg sm:mr-16">
              <li class="leading-normal text-sm">
                <a class="opacity-50" href="javascript:;">Pages</a>
              </li>
              <li class="text-sm pl-2 capitalize leading-normal before:float-left before:pr-2 before:content-['/']" aria-current="page">Profile</li>
            </ol>
            <h6 class="mb-2 ml-2 font-bold text-white capitalize dark:text-white">Profile</h6>
          </nav>

          <div class="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
            <div class="flex items-center md:ml-auto md:pr-4">
              <div class="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease">
                <span class="text-sm ease leading-5.6 absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
                  <i class="fas fa-search" aria-hidden="true"></i>
                </span>
                <input type="text" class="pl-9 text-sm dark:bg-slate-850 dark:text-white focus:shadow-primary-outline ease w-1/100 leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:transition-shadow" placeholder="Type here." />
              </div>
            </div>
            <ul class="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
             
              
              <li class="flex items-center pl-4 xl:hidden">
                <a href="javascript:;" class="block p-0 text-white transition-all ease-in-out text-sm" sidenav-trigger>
                  <div class="w-4.5 overflow-hidden">
                    <i class="ease mb-0.75 relative block h-0.5 rounded-sm bg-white transition-all"></i>
                    <i class="ease mb-0.75 relative block h-0.5 rounded-sm bg-white transition-all"></i>
                    <i class="ease relative block h-0.5 rounded-sm bg-white transition-all"></i>
                  </div>
                </a>
              </li>
              <li class="flex items-center px-4">
                <a href="javascript:;" class="p-0 text-white transition-all ease-in-out text-sm">
                  <i fixed-plugin-button-nav class="cursor-pointer fa fa-cog" aria-hidden="true"></i>
                </a>
              </li>


              <li class="relative flex items-center pr-2">
                <p class="hidden dark:text-white dark:opacity-60 transform-dropdown-show"></p>
                <a dropdown-trigger href="javascript:;" class="block p-0 text-white transition-all text-sm ease-nav-brand" aria-expanded="false">
                  <i class="cursor-pointer fa fa-bell" aria-hidden="true"></i>
                </a>

                <ul dropdown-menu class="text-sm transform-dropdown before:font-awesome before:leading-default before:duration-350 before:ease lg:shadow-3xl duration-250 min-w-44 before:sm:right-8 before:text-5.5 pointer-events-none absolute right-0 top-0 z-50 origin-top list-none rounded-lg border-0 border-solid border-transparent bg-white bg-clip-padding px-2 py-4 text-left text-slate-500 opacity-0 transition-all before:absolute before:right-2 before:left-auto before:top-0 before:z-50 before:inline-block before:font-normal before:text-white before:antialiased before:transition-all before:content-['\f0d8'] sm:-mr-6 lg:absolute lg:right-0 lg:left-auto lg:mt-2 lg:block lg:cursor-pointer">
                  <li class="relative mb-2">
                    <a class="ease py-1.2 clear-both block w-full whitespace-nowrap rounded-lg bg-transparent px-4 duration-300 lg:transition-colors" href="javascript:;">
                      <div class="flex py-1">
                        <div class="my-auto">
                          <img src="/assets/img/team-2.jpg" class="inline-flex items-center justify-center mr-4 text-white text-sm h-9 w-9 max-w-none rounded-xl" />
                        </div>
                        <div class="flex flex-col justify-center">
                          <h6 class="mb-1 font-normal leading-normal dark:text-white text-sm"><span class="font-semibold">New message</span> from Laur</h6>
                          <p class="mb-0 leading-tight dark:text-white dark:opacity-60 text-xs text-slate-400">
                            <i class="mr-1 fa fa-clock" aria-hidden="true"></i>
                            13 minutes ago
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>

                  <li class="relative mb-2">
                    <a class="ease py-1.2 clear-both block w-full whitespace-nowrap rounded-lg px-4 duration-300 lg:transition-colors" href="javascript:;">
                      <div class="flex py-1">
                        <div class="my-auto">
                          <img src="/assets/img/small-logos/logo-spotify.svg" class="inline-flex items-center justify-center mr-4 text-white text-sm bg-gradient-to-tl from-zinc-800 to-zinc-700 dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 h-9 w-9 max-w-none rounded-xl" />
                        </div>
                        <div class="flex flex-col justify-center">
                          <h6 class="mb-1 font-normal leading-normal dark:text-white text-sm"><span class="font-semibold">New album</span> by Travis Scott</h6>
                          <p class="mb-0 leading-tight dark:text-white dark:opacity-60 text-xs text-slate-400">
                            <i class="mr-1 fa fa-clock" aria-hidden="true"></i>
                            1 day
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>

                  <li class="relative">
                    <a class="ease py-1.2 clear-both block w-full whitespace-nowrap rounded-lg px-4 duration-300 lg:transition-colors" href="javascript:;">
                      <div class="flex py-1">
                        <div class="inline-flex items-center justify-center my-auto mr-4 text-white transition-all duration-200 ease-in-out text-sm bg-gradient-to-tl from-slate-600 to-slate-300 h-9 w-9 rounded-xl">
                          <svg width="12px" height="12px" viewBox="0 0 43 36" version="1.1" >
                            <title>credit-card</title>
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                              <g transform="translate(-2169.000000, -745.000000)" fill="#FFFFFF" fill-rule="nonzero">
                                <g transform="translate(1716.000000, 291.000000)">
                                  <g transform="translate(453.000000, 454.000000)">
                                    <path class="color-background" d="M43,10.7482083 L43,3.58333333 C43,1.60354167 41.3964583,0 39.4166667,0 L3.58333333,0 C1.60354167,0 0,1.60354167 0,3.58333333 L0,10.7482083 L43,10.7482083 Z" opacity="0.593633743"></path>
                                    <path class="color-background" d="M0,16.125 L0,32.25 C0,34.2297917 1.60354167,35.8333333 3.58333333,35.8333333 L39.4166667,35.8333333 C41.3964583,35.8333333 43,34.2297917 43,32.25 L43,16.125 L0,16.125 Z M19.7083333,26.875 L7.16666667,26.875 L7.16666667,23.2916667 L19.7083333,23.2916667 L19.7083333,26.875 Z M35.8333333,26.875 L28.6666667,26.875 L28.6666667,23.2916667 L35.8333333,23.2916667 L35.8333333,26.875 Z"></path>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                        <div class="flex flex-col justify-center">
                          <h6 class="mb-1 font-normal leading-normal dark:text-white text-sm">Payment successfully completed</h6>
                          <p class="mb-0 leading-tight dark:text-white dark:opacity-60 text-xs text-slate-400">
                            <i class="mr-1 fa fa-clock" aria-hidden="true"></i>
                            2 days
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div class="relative w-full mx-auto mt-60 ">
        
        <div class="relative flex flex-col flex-auto min-w-0 p-4 mx-6 overflow-hidden break-words bg-white border-0 dark:bg-slate-850 dark:shadow-dark-xl shadow-3xl rounded-2xl bg-clip-border">
          <div class="flex flex-wrap -mx-3">
            <div class="flex-none w-auto max-w-full px-3">
              <div class="relative inline-flex items-center justify-center text-white transition-all duration-200 ease-in-out text-base h-19 w-19 rounded-xl">
                <img src="/assets/img/team-1.jpg" alt="profile_image" class="w-full shadow-2xl rounded-xl" />
              </div>
            </div>
            <div class="flex-none w-auto max-w-full px-3 my-auto">
              <div class="h-full">
                <h5 class="mb-1 dark:text-white">{user?.name}</h5>
                <p class="mb-0 font-semibold leading-normal dark:text-white dark:opacity-60 text-sm">Public Relations</p>
              </div>
            </div>
            <div class="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12">
              <div class="relative right-0">
                <ul class="relative flex flex-wrap p-1 list-none bg-gray-50 rounded-xl" nav-pills role="tablist">
                  <li class="z-30 flex-auto text-center">
                    <a class="z-30 flex items-center justify-center w-full px-0 py-1 mb-0 transition-all ease-in-out border-0 rounded-lg bg-inherit text-slate-700" nav-link active href="javascript:;" role="tab" aria-selected="true">
                      <i class="ni ni-app"></i>
                      <span class="ml-2">App</span>
                    </a>
                  </li>
                  <li class="z-30 flex-auto text-center">
                    <a class="z-30 flex items-center justify-center w-full px-0 py-1 mb-0 transition-all ease-in-out border-0 rounded-lg bg-inherit text-slate-700" nav-link href="javascript:;" role="tab" aria-selected="false">
                      <i class="ni ni-email-83"></i>
                      <span class="ml-2">Messages</span>
                    </a>
                  </li>
                  <li class="z-30 flex-auto text-center">
                    <a class="z-30 flex items-center justify-center w-full px-0 py-1 mb-0 transition-colors ease-in-out border-0 rounded-lg bg-inherit text-slate-700" nav-link href="javascript:;" role="tab" aria-selected="false">
                      <i class="ni ni-settings-gear-65"></i>
                      <span class="ml-2">Settings</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-full p-6 mx-auto">
        <div class="flex flex-wrap -mx-3">
          <div class="w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-0">
            <div class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
              <div class="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 pb-0">
                <div class="flex items-center">
                  <p class="mb-0 dark:text-white/80">Edit Profile</p>
                  <button type="button" class="inline-block px-8 py-2 mb-4 ml-auto font-bold leading-normal text-center text-white align-middle transition-all ease-in bg-blue-500 border-0 rounded-lg shadow-md cursor-pointer text-xs tracking-tight-rem hover:shadow-xs hover:-translate-y-px active:opacity-85">Settings</button>
                </div>
              </div>
              <form role="form text-left" onSubmit={handleSubmit} style={{ margin: '40px' }}>
  {success && (
    <div className="mb-4 text-green-600 font-medium bg-green-100 px-4 py-2 rounded">
      {success}
    </div>
  )}

  {/* Name */}
  <div className="mb-4">
    <input
      type="text"
      name="name"
      placeholder="Name"
      value={form.name}
      onChange={handleChange}
      className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
      aria-label="Name"
    />
    {errors.name && (
      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
    )}
  </div>
  <div className="mb-4">
    <input
      type="text"
      name="email"
      placeholder="email"
      value={form.email}
      onChange={handleChange}
      className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
      aria-label="Email"
    />
    {errors.email && (
      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
    )}
  </div>

  {/* Mobile Number */}
  <div className="mb-4">
    <input
      type="text"
      name="mobile"
      placeholder="Mobile Number"
      value={form.mobile}
      onChange={handleChange}
      className="placeholder:text-gray-500 text-sm block w-full rounded-lg border border-gray-300 bg-white py-2 px-3 text-gray-700 focus:border-blue-500 focus:outline-none"
      aria-label="Mobile Number"
    />
    {errors.mobile && (
      <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
    )}
  </div>

  {/* Gender */}
  <div className="mb-4">
    <label className="block mb-1 text-sm font-medium text-gray-700">
      Gender:
    </label>
    <div className="flex gap-4">
      <label>
        <input
          type="radio"
          name="gender"
          value="male"
          checked={form.gender === 'male'}
          onChange={handleChange}
        />
        <span className="ml-2 text-sm">Male</span>
      </label>
      <label>
        <input
          type="radio"
          name="gender"
          value="female"
          checked={form.gender === 'female'}
          onChange={handleChange}
        />
        <span className="ml-2 text-sm">Female</span>
      </label>
      <label>
        <input
          type="radio"
          name="gender"
          value="other"
          checked={form.gender === 'other'}
          onChange={handleChange}
        />
        <span className="ml-2 text-sm">Other</span>
      </label>
    </div>
    {errors.gender && (
      <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
    )}
  </div>

  {/* Profile Picture */}
  <div className="mb-4" style={{ display: 'none', }}>
    <label className="block mb-1 text-sm font-medium text-gray-700">
      Profile Picture:
    </label>
    <input
      type="file"
      name="profile"
      accept="image/*"
      onChange={(e) =>
        setForm({ ...form, profile: e.target.files[0] })
      }
      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
    />
  </div>

  {/* Bio or About Me */}


  {/* Submit Button */}
  <div className="text-center">
    <button
      type="submit"
      className="w-full px-5 py-2.5 mt-6 mb-2 font-bold text-white rounded-lg bg-gradient-to-tl from-zinc-800 to-zinc-700 hover:bg-slate-700 transition-all"
    >
      Update Profile
    </button>
  </div>
</form>

            </div>
          </div>
          <div class="w-full max-w-full px-3 mt-6 shrink-0 md:w-4/12 md:flex-0 md:mt-0">
            <div class="relative flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
              <img class="w-full rounded-t-2xl" src="/assets/img/bg-profile.jpg" alt="profile cover image" />
              <div class="flex flex-wrap justify-center -mx-3">
                <div class="w-4/12 max-w-full px-3 flex-0 ">
                  <div class="mb-6 -mt-6 lg:mb-0 lg:-mt-16">
                    <a href="javascript:;">
                      <img class="h-auto max-w-full border-2 border-white border-solid rounded-circle" src={profileImageSrc} alt="profile image" />
                    </a>
                  </div>
                </div>
              </div>
              <div class="border-black/12.5 rounded-t-2xl p-6 text-center pt-0 pb-6 lg:pt-2 lg:pb-4">
                <div class="flex justify-between">
                  <button type="button" class="hidden px-8 py-2 font-bold leading-normal text-center text-white align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer text-xs bg-cyan-500 lg:block tracking-tight-rem hover:shadow-xs hover:-translate-y-px active:opacity-85">Connect</button>
                  <button type="button" class="block px-8 py-2 font-bold leading-normal text-center text-white align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer text-xs bg-cyan-500 lg:hidden tracking-tight-rem hover:shadow-xs hover:-translate-y-px active:opacity-85">
                    <i class="ni ni-collection text-2.8"></i>
                  </button>
                  <button type="button" class="hidden px-8 py-2 font-bold leading-normal text-center text-white align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer text-xs bg-slate-700 lg:block tracking-tight-rem hover:shadow-xs hover:-translate-y-px active:opacity-85">Message</button>
                  <button type="button" class="block px-8 py-2 font-bold leading-normal text-center text-white align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer text-xs bg-slate-700 lg:hidden tracking-tight-rem hover:shadow-xs hover:-translate-y-px active:opacity-85">
                    <i class="ni ni-email-83 text-2.8"></i>
                  </button>
                </div>
              </div>

              <div class="flex-auto p-6 pt-0">
                <div class="flex flex-wrap -mx-3">
                  <div class="w-full max-w-full px-3 flex-1-0">
                    <div class="flex justify-center">
                      <div class="grid text-center">
                        <span class="font-bold dark:text-white text-lg">22</span>
                        <span class="leading-normal dark:text-white text-sm opacity-80">Friends</span>
                      </div>
                      <div class="grid mx-6 text-center">
                        <span class="font-bold dark:text-white text-lg">10</span>
                        <span class="leading-normal dark:text-white text-sm opacity-80">Photos</span>
                      </div>
                      <div class="grid text-center">
                        <span class="font-bold dark:text-white text-lg">89</span>
                        <span class="leading-normal dark:text-white text-sm opacity-80">Comments</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mt-6 text-center">
                  <h5 class="dark:text-white ">
                    Mark Davis
                    <span class="font-light">, 35</span>
                  </h5>
                  <div class="mb-2 font-semibold leading-relaxed text-base dark:text-white/80 text-slate-700">
                    <i class="mr-2 dark:text-white ni ni-pin-3"></i>
                    Bucharest, Romania
                  </div>
                  <div class="mt-6 mb-2 font-semibold leading-relaxed text-base dark:text-white/80 text-slate-700">
                    <i class="mr-2 dark:text-white ni ni-briefcase-24"></i>
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div class="dark:text-white/80">
                    <i class="mr-2 dark:text-white ni ni-hat-3"></i>
                    University of Computer Science
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <footer class="pt-4">
          <div class="w-full px-6 mx-auto">
            <div class="flex flex-wrap items-center -mx-3 lg:justify-between">
              <div class="w-full max-w-full px-3 mt-0 mb-6 shrink-0 lg:mb-0 lg:w-1/2 lg:flex-none">
                <div class="leading-normal text-center text-sm text-slate-500 lg:text-left">
                  ©
                  <script>
                    document.write(new Date().getFullYear() + ",");
                  </script>
                  made with <i class="fa fa-heart"></i> by
                  <a href="https://www.creative-tim.com" class="font-semibold dark:text-white text-slate-700" target="_blank">Creative Tim</a>
                  for a better web.
                </div>
              </div>
              <div class="w-full max-w-full px-3 mt-0 shrink-0 lg:w-1/2 lg:flex-none">
                <ul class="flex flex-wrap justify-center pl-0 mb-0 list-none lg:justify-end">
                  <li class="nav-item">
                    <a href="https://www.creative-tim.com" class="block px-4 pt-0 pb-1 font-normal transition-colors ease-in-out text-sm text-slate-500" target="_blank">Creative Tim</a>
                  </li>
                  <li class="nav-item">
                    <a href="https://www.creative-tim.com/presentation" class="block px-4 pt-0 pb-1 font-normal transition-colors ease-in-out text-sm text-slate-500" target="_blank">About Us</a>
                  </li>
                  <li class="nav-item">
                    <a href="https://creative-tim.com/blog" class="block px-4 pt-0 pb-1 font-normal transition-colors ease-in-out text-sm text-slate-500" target="_blank">Blog</a>
                  </li>
                  <li class="nav-item">
                    <a href="https://www.creative-tim.com/license" class="block px-4 pt-0 pb-1 pr-0 font-normal transition-colors ease-in-out text-sm text-slate-500" target="_blank">License</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>  </Layout>
   
  
    );
};

export default Profile;
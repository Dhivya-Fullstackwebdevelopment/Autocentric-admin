

// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useNavigate } from 'react-router-dom';
// import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
// import logo from '../../assets/images/aclogo.jpg';
// import { apiAxios } from '../../commonapicall/api/apiUrl';


// export const loginSchema = z.object({
//   username: z.string().min(1, "Username is required"),
//   password: z.string().min(1, "Password is required")
// });


// type LoginFormInputs = z.infer<typeof loginSchema>;

// export const LoginForm:React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [apiError, setApiError] = useState('');
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<LoginFormInputs>({
//     resolver: zodResolver(loginSchema)
//   });

//   const onSubmit = async (data: LoginFormInputs) => {
//     setApiError('');
//     const formData = new FormData();
//     formData.append("username", data.username);
//     formData.append("password", data.password);

//     try {
//       const response = await apiAxios.post("/api/login/", formData);
//       const result = response.data;

//       localStorage.setItem("user", JSON.stringify(result.user));
//       navigate("/WelcomePage");
//     } catch (err: any) {
//       const msg = err.response?.data?.message || "Login failed. Please try again.";
//       setApiError(msg);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
//         <div className="flex justify-center mb-6">
//           <img src={logo} alt="Auto Centric Logo" className="h-12" />
//         </div>
//         <h2 className="text-center text-xl font-bold text-gray-800 mb-6">
//           Login to Auto Centric
//         </h2>

//         {apiError && (
//           <div className="mb-4 text-red-600 text-sm text-center font-medium">
//             {apiError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit(onSubmit)} noValidate>
        
//           <div className="mb-4 relative">
//             <span className="absolute left-3 top-3.5 text-gray-400">
//               <FaEnvelope />
//             </span>
//             <input
//               type="email"
//               {...register("username")}
//               placeholder="jane@example.com"
//               className={`pl-10 pr-4 py-2 w-full border-2 rounded-md focus:outline-none`}
//             />
//             {errors.username && (
//               <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
//             )}
//           </div>

          
//           <div className="mb-2 relative">
//             <span className="absolute left-3 top-3.5 text-gray-400">
//               <FaLock />
//             </span>
//             <input
//               type={showPassword ? "text" : "password"}
//               {...register("password")}
//               placeholder="••••••"
//               className={`pl-10 pr-10 py-2 w-full border-2 rounded-md focus:outline-none`}
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-3 cursor-pointer text-gray-600"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </button>
//             {errors.password && (
//               <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
//             )}
//           </div>

//           {/* <div className="mb-6 text-right text-sm text-gray-600">
//             <div className="hover:underline cursor-pointer">
//               Forgot Password?
//             </div>
//           </div> */}

        
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full cursor-pointer bg-main text-white hover:text-main hover:border-main border-1 py-2 rounded-md font-bold hover:bg-white transition"
//           >
//             {isSubmitting ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../../assets/images/aclogo.jpg';
import { apiAxios } from '../../commonapicall/api/apiUrl';

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Clear storage and prevent back navigation when component mounts
  useEffect(() => {
    // Clear all authentication data
    localStorage.clear();
    sessionStorage.clear();
    
    // Disable back button functionality
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, '', window.location.href);
    };

    return () => {
      window.onpopstate = null; // Cleanup event listener
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setApiError('');
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    try {
      const response = await apiAxios.post("/api/login/", formData);
      const result = response.data;

      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        
        // Replace history to prevent back navigation to login
        window.history.replaceState(null, '', '/WelcomePage');
        navigate("/WelcomePage", { replace: true });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err: any) {
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid username or password";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Auto Centric Logo" className="h-12" />
        </div>
        <h2 className="text-center text-xl font-bold text-gray-800 mb-6">
          Login to Auto Centric
        </h2>

        {apiError && (
          <div className="mb-4 p-3 text-red-600 text-sm text-center font-medium bg-red-50 rounded-md">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4 relative">
            <span className="absolute left-3 top-3.5 text-gray-400">
              <FaEnvelope />
            </span>
            <input
              type="email"
              {...register("username")}
              placeholder="jane@example.com"
              className={`pl-10 pr-4 py-2 w-full border-2 rounded-md focus:outline-none ${
                errors.username ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
            )}
          </div>

          <div className="mb-6 relative">
            <span className="absolute left-3 top-3.5 text-gray-400">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••"
              className={`pl-10 pr-10 py-2 w-full border-2 rounded-md focus:outline-none ${
                errors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
              }`}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-3 cursor-pointer text-gray-600 hover:text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-bold transition ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
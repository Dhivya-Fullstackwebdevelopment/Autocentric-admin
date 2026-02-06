// // // src/components/Header.tsx
// // import { NavLink, useNavigate } from 'react-router-dom';
// // import Logo from '../assets/images/aclogo.jpg';

// // export const Header = () => {
// //   const navigate = useNavigate();

// //   // const handleLogout = () => {
// //   //   navigate('/');
// //   //   sessionStorage.clear();
// //   // };

// //   return (
// //     <header className="bg-white shadow-md  z-10">
// //       <div className="relative max-w-screen-xl mx-auto flex items-center justify-between gap-2 px-4 py-3">
// //         {/* Left Spacer - same width as logo to balance nav */}
// //         {/* <div className="w-12" /> */}

// //         {/* Center Navigation (absolutely centered) */}
// //         {/* <nav className="absolute left-1/2 transform -translate-x-1/2 mr-auto"> */}
// //         <nav className="">
// //           <ul className="flex space-x-6 text-black font-medium gap-8">
// //             <li>
// //               <NavLink to="/WelcomePage" className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap" aria-current="page">Home</NavLink>
// //             </li>
// //             <li>
// //               <NavLink to="/CustomerInfo" className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap" aria-current="page">Customer Information</NavLink>
// //             </li>

// //             <li>
// //               <NavLink to="/ServiceMaster" className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap" aria-current="page">Services Master</NavLink>
// //             </li>
// //             <li>
// //               <NavLink to="/AppoinmentBookingTable" className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap" aria-current="page">Appointment Booking</NavLink>
// //             </li>
// //             {/* <li>
// //               <NavLink to="/ServiceDetails" className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap" aria-current="page">Invoice</NavLink>
// //             </li> */}
// //           </ul>
// //         </nav>

      
// //         {/* Logo on Right */}
// //         <div className="  flex justify-end  gap-8">
// //             <nav>
// //           <ul>
// //           <li className="text-md max-xl:text-sm">
// //             <NavLink to="/vehicle" className="active-nav max-2xl:before:!-bottom-5" aria-current="page">Search</NavLink>
// //           </li>
// //            </ul>
// //         </nav>
// //         <div className=" relative w-12 flex justify-end group  gap-8">

// //           <img src={Logo} alt="Logo" className="h-8 w-8  rounded-full object-cover cursor-pointer" />

// //           <div className="absolute  right-0 mt-12 w-40  bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1001]">

// //             <div className="block px-4 py-2 text-sm text-armsBlack hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/ResetPassWord")}>Password Reset</div>
// //             <div
// //               //onClick={handleLogout}
// //               className="block px-4 py-2 text-sm text-armsBlack hover:bg-gray-100 cursor-pointer">Log Out</div>
// //           </div>
// // </div>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };


// // src/components/Header.tsx
// import { NavLink, useNavigate } from 'react-router-dom';
// import Logo from '../assets/images/aclogo.jpg';

// export const Header = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     sessionStorage.clear();
//     localStorage.clear();
//     navigate('/');
//   };

//   return (
//     <header className="bg-white shadow-md z-10">
//       <div className="relative max-w-screen-xl mx-auto flex items-center justify-between gap-2 px-4 py-3">
//         {/* Center Navigation */}
//         <nav>
//           <ul className="flex space-x-6 text-black font-medium gap-8">
//             <li>
//               <NavLink
//                 to="/WelcomePage"
//                 className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap"
//                 aria-current="page"
//               >
//                 Home
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/CustomerInfo"
//                 className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap"
//                 aria-current="page"
//               >
//                 Customer Information
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/ServiceMaster"
//                 className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap"
//                 aria-current="page"
//               >
//                 Services Master
//               </NavLink>
//             </li>
//             <li>
//               <NavLink
//                 to="/AppoinmentBookingTable"
//                 className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap"
//                 aria-current="page"
//               >
//                 Appointment Booking
//               </NavLink>
//             </li>
//             {/* <li>
//               <NavLink
//                 to="/ServiceDetails"
//                 className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap"
//                 aria-current="page"
//               >
//                 Invoice
//               </NavLink>
//             </li> */}
//           </ul>
//         </nav>

//         {/* Right Section */}
//         <div className="flex justify-end gap-8">
//           <nav>
//             <ul>
//               <li className="text-md max-xl:text-sm">
//                 <NavLink
//                   to="/vehicle"
//                   className="active-nav max-2xl:before:!-bottom-5"
//                   aria-current="page"
//                 >
//                   Search
//                 </NavLink>
//               </li>
//             </ul>
//           </nav>

//           <div className="relative w-12 flex justify-end group gap-8">
//             <img
//               src={Logo}
//               alt="Logo"
//               className="h-8 w-8 rounded-full object-cover cursor-pointer"
//             />

//             {/* Dropdown Menu */}
//             <div className="absolute right-0 mt-12 w-40 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1001]">
//               <div
//                 className="block px-4 py-2 text-sm text-armsBlack hover:bg-gray-100 cursor-pointer"
//                 onClick={() => navigate('/ResetPassWord')}
//               >
//                 Password Reset
//               </div>
//               <div
//                 onClick={handleLogout}
//                 className="block px-4 py-2 text-sm text-armsBlack hover:bg-gray-100 cursor-pointer"
//               >
//                 Log Out
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };


import { NavLink, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/aclogo.jpg';

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login page
    navigate('/');
    
    // Prevent back button navigation
    window.history.replaceState(null, '', '/');
  };

  return (
    <header className="bg-white shadow-md z-10">
      <div className="relative max-w-screen-xl mx-auto flex items-center justify-between gap-2 px-4 py-3">
        <nav>
          <ul className="flex space-x-6 text-black font-medium gap-8">
            <li>
              <NavLink
                to="/WelcomePage"
                className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap"
                aria-current="page"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/CustomerInfo"
                className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap"
                aria-current="page"
              >
                Customer Information
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/ServiceMaster"
                className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap"
                aria-current="page"
              >
                Services Master
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/AppoinmentBookingTable"
                className="active-nav max-2xl:before:!-bottom-5 whitespace-nowrap"
                aria-current="page"
              >
                Booking & Invoice
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="flex justify-end gap-8">
          <nav>
            <ul>
              <li className="text-md max-xl:text-sm">
                <NavLink
                  to="/vehicle"
                  className="active-nav max-2xl:before:!-bottom-5"
                  aria-current="page"
                >
                  Search
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="relative w-12 flex justify-end group gap-8">
            <img
              src={Logo}
              alt="Logo"
              className="h-8 w-8 rounded-full object-cover cursor-pointer"
            />

            <div className="absolute right-0 mt-12 w-40 bg-white shadow-lg rounded-md py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1001]">
              <div
                className="block px-4 py-2 text-sm text-armsBlack hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate('/ResetPassWord')}
              >
                Password Reset
              </div>
              <div
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-armsBlack hover:bg-gray-100 cursor-pointer"
              >
                Log Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
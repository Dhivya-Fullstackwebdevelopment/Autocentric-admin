// import { useState, useEffect, useRef } from "react";
// // import { IoIosSave } from "react-icons/io";
// // import { FaTrash, FaEdit } from "react-icons/fa";n
// import { Header } from "../Header";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   customerSchema,
//   // vehicleSchema,
//   type CustomerFormType,
//   type VehicleType,
// } from "../../commonapicall/utils/AddCustomerInfoSchema";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { EditVehiclePopup } from "../VehiclesPopups/EditVehiclePopup";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { MdDelete, MdEdit } from "react-icons/md";

// const OS_API_KEY = 'C6hpVCnxKcvEx7XXRt3O8gxdwmt2GavF';

// export const EditCustomerInfoPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
//   const [tempVehicleData, setTempVehicleData] = useState<VehicleType | null>(null);
//   const [showEditVehiclePopup, setShowEditVehiclePopup] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
//   const [showAddressDropdown, setShowAddressDropdown] = useState(false);
//   const [isFetchingAddress, setIsFetchingAddress] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const addressInputRef = useRef<HTMLInputElement>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     getValues,
//     watch,
//     trigger,
//     clearErrors,
//   } = useForm<CustomerFormType>({
//     resolver: zodResolver(customerSchema),
//     defaultValues: {
//       date: new Date().toISOString().split('T')[0],
//       vehicles: [] as VehicleType[],
//     },
//   });

//   const postalCode = watch("postal_code") || "";

//   // Fetch addresses when postal code changes
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       if (!postalCode || postalCode.length < 3) return;

//       try {
//         setIsFetchingAddress(true);
//         const response = await axios.get(
//           `https://api.os.uk/search/places/v1/postcode?postcode=${encodeURIComponent(postalCode)}&key=${OS_API_KEY}`
//         );
//         setAddressSuggestions(response.data.results || []);
//       } catch (error) {
//         console.error("Address fetch error:", error);
//         toast.error("Failed to fetch addresses.Please Check Postal Code");
//       } finally {
//         setIsFetchingAddress(false);
//       }
//     };

//     const handler = setTimeout(fetchAddresses, 500);
//     return () => clearTimeout(handler);
//   }, [postalCode]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
//         addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
//         setShowAddressDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleAddressSelect = (address: string) => {
//     setValue("home_address", address);
//     setShowAddressDropdown(false);
//   };

//   useEffect(() => {
//     const fetchCustomerData = async () => {
//       try {
//         const response = await axios.patch(
//           `http://217.154.63.73:8000/api/customer/update/${id}/`
//         );
//         const customerData = response.data.data;

//         // Helper function to format date as YYYY-MM-DD
//         const formatDate = (dateString: string | null | undefined): string => {
//           if (!dateString) return "";
//           try {
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "";
//             const year = date.getFullYear();
//             const month = String(date.getMonth() + 1).padStart(2, '0');
//             const day = String(date.getDate()).padStart(2, '0');
//             return `${year}-${month}-${day}`;
//           } catch {
//             return "";
//           }
//         };

//         const formattedDate = formatDate(customerData.date) || new Date().toISOString().split('T')[0];

//         const vehicles: VehicleType[] = customerData.vehicles.map((vehicle: any) => ({
//           id: String(vehicle.id),
//           registration_number: vehicle.registration_number || "",
//           make: vehicle.make || "",
//           fuel_type: vehicle.fuel_type || "",
//           tax_status: vehicle.tax_status || "",
//           mileage: vehicle.mileage || "",
//           year_of_manufacture: vehicle.year_of_manufacture?.toString() || "",
//           colour: vehicle.colour || "",
//           mot_expiry_date: formatDate(vehicle.mot_expiry_date),
//         }));

//         reset({
//           full_name: customerData.full_name,
//           home_address: customerData.home_address,
//           phone_number: customerData.phone_number,
//           postal_code: customerData.postal_code,
//           email: customerData.email,
//           date: formattedDate,
//           vehicles: vehicles,
//         });
//       } catch (error) {
//         console.error("Error fetching customer data:", error);
//         toast.error("Failed to load customer data");
//       }
//     };

//     fetchCustomerData();
//   }, [id, reset]);

//   const onSubmit = async (data: CustomerFormType) => {


//     setIsSubmitting(true);
//     try {
//       // Helper function to validate and format date as YYYY-MM-DD
//       const formatDateForApi = (dateString: string | undefined): string | null => {
//         if (!dateString) return null;
//         // If already in correct format, return as-is
//         if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//           return dateString;
//         }
//         try {
//           const date = new Date(dateString);
//           if (isNaN(date.getTime())) return null;
//           const year = date.getFullYear();
//           const month = String(date.getMonth() + 1).padStart(2, '0');
//           const day = String(date.getDate()).padStart(2, '0');
//           return `${year}-${month}-${day}`;
//         } catch {
//           return null;
//         }
//       };

//       const payload = {
//         ...data,
//         date: formatDateForApi(data.date),
//         vehicles: data.vehicles.map(vehicle => {
//           const { id, ...vehicleWithoutId } = vehicle;
//           return {
//             ...vehicleWithoutId,
//             mot_expiry_date: formatDateForApi(vehicle.mot_expiry_date)
//           };
//         })
//       };

//       const response = await axios.put(
//         `http://217.154.63.73:8000/api/customer/update/${id}/`,
//         payload
//       );
//       console.log("Update successful:", response.data);
//       toast.success("Customer updated successfully!");
//       navigate("/CustomerInfo");
//     } catch (error) {
//       console.error("Error updating customer:", error);
//       toast.error("Failed to update customer");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEditVehicle = (vehicle: VehicleType) => {
//     setEditingVehicleId(vehicle.id ?? "");
//     setTempVehicleData({
//       ...vehicle,
//       year_of_manufacture: vehicle.year_of_manufacture?.toString() || ""
//     });
//     setShowEditVehiclePopup(true);
//   };



//   const handleDeleteVehicle = async (vehicleId: string) => {
//     try {
//       const currentVehicles = getValues("vehicles");
//       const updatedVehicles = currentVehicles.filter((v) => v.id !== vehicleId);
//       setValue("vehicles", updatedVehicles);
//       toast.success("Vehicle deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting vehicle:", error);
//       toast.error("Failed to delete vehicle");
//     }
//   };

//   const handleAddVehicleClick = async () => {
//     const valid = await trigger([
//       "full_name",
//       "home_address",
//       "phone_number",
//       "postal_code",
//       "email",
//       "date"
//     ]);
//     if (valid) {
//       setEditingVehicleId(null);
//       setTempVehicleData(null);
//       setShowEditVehiclePopup(true);
//     } else {
//       toast.error("Please fill out the customer form correctly first.");
//     }
//   };

//   const handleAddVehicle = (vehicle: VehicleType) => {
//     const newVehicle = {
//       ...vehicle,
//       id: String(Date.now()),
//     };

//     const currentVehicles = getValues("vehicles");
//     setValue("vehicles", [...currentVehicles, newVehicle]);
//     setShowEditVehiclePopup(false);
//     toast.success("Vehicle added successfully!");
//   };

//   const handleUpdateVehicle = (vehicle: VehicleType) => {
//     if (!editingVehicleId) return;

//     const currentVehicles = getValues("vehicles");
//     const updatedVehicles = currentVehicles.map((v) =>
//       v.id === editingVehicleId ? { ...v, ...vehicle } : v
//     );

//     setValue("vehicles", updatedVehicles);
//     setShowEditVehiclePopup(false);
//     setEditingVehicleId(null);
//     toast.success("Vehicle updated successfully!");
//   };
//   const handleCancel = () => {
//     localStorage.removeItem("customerVehicles");
//     navigate("/CustomerInfo");
//   };

//   return (
//     <div className="min-h-screen bg-[#F3F4F6]">
//       <Header />
//       <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-w-full shadow-lg relative flex flex-col mx-auto mt-10">
//         {isSubmitting && (
//           <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//           </div>
//         )}
//         {isFetchingAddress && (
//           <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//           </div>
//         )}
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-main uppercase">
//               Edit Customer Information
//             </h2>
//           </div>

//           <div className="grid grid-cols-3 gap-4 mb-6">
//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Full Name<span className="text-red-500">*</span></label>
//               <input
//                 {...register("full_name")}
//                 type="text"
//                 placeholder="Full Name"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("full_name", e.target.value);
//                   clearErrors("full_name");
//                 }}
//               />
//               {errors.full_name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
//               )}
//             </div>

//             {/* <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Address<span className="text-red-500">*</span></label>
//               <input
//                 {...register("home_address")}
//                 type="text"
//                 placeholder="Address"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("home_address", e.target.value);
//                   clearErrors("home_address");
//                 }}
//               />
//               {errors.home_address && (
//                 <p className="text-red-500 text-sm mt-1">{errors.home_address.message}</p>
//               )}
//             </div> */}

//             <div className="flex flex-col relative">
//               <label className="mb-1 font-medium text-gray-700">
//                 Address
//               </label>
//               <input
//                 type="text"
//                 {...register("home_address")}
//                 placeholder="Address"
//                 ref={addressInputRef}
//                 value={watch("home_address") || ""}
//                 //onClick={() => postalCode?.length >= 3 && setShowAddressDropdown(true)}
//                 onChange={(e) => {
//                   setValue("home_address", e.target.value);
//                   clearErrors("home_address");
//                 }}
//                 onFocus={() => {
//                   if (postalCode?.length >= 3 && addressSuggestions.length > 0) {
//                     setShowAddressDropdown(true);
//                   }
//                 }}
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none cursor-pointer"
//                 readOnly
//               />
//               {showAddressDropdown && addressSuggestions.length > 0 && (
//                 <div
//                   ref={dropdownRef}
//                   className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-18"
//                 >
//                   {addressSuggestions.map((result, index) => (
//                     <div
//                       key={index}
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                       onClick={() => handleAddressSelect(result.DPA.ADDRESS)}
//                     >
//                       {result.DPA.ADDRESS}
//                     </div>
//                   ))}
//                 </div>
//               )}
//               <span className="text-red-500 text-sm">{errors.home_address?.message}</span>
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Phone<span className="text-red-500">*</span></label>
//               <input
//                 {...register("phone_number")}
//                 type="text"
//                 placeholder="Phone"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("phone_number", e.target.value);
//                   clearErrors("phone_number");
//                 }}
//               />
//               {errors.phone_number && (
//                 <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Post Code</label>
//               <input
//                 {...register("postal_code")}
//                 type="text"
//                 placeholder="Post code"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("postal_code", e.target.value);
//                   clearErrors("postal_code");
//                   // Trigger address lookup immediately when postal code changes
//                   if (e.target.value.length >= 3) {
//                     setShowAddressDropdown(true);
//                   } else {
//                     setShowAddressDropdown(false);
//                     setAddressSuggestions([]);
//                   }
//                 }}
//               />
//               {errors.postal_code && (
//                 <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
//               <input
//                 {...register("email")}
//                 type="email"
//                 placeholder="Email"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("email", e.target.value);
//                   clearErrors("email");
//                 }}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Date</label>
//               <input
//                 {...register("date")}
//                 type="date"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//               />
//               {errors.date && (
//                 <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
//               )}
//             </div>
//           </div>


//           <div className="flex justify-end mb-4">
//             <button
//               type="button"
//               onClick={handleAddVehicleClick}
//               className="bg-main text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-main border hover:border-main"
//             >
//               Add Vehicle
//             </button>
//           </div>

//           <h2 className="text-2xl font-bold text-main mb-6 uppercase">
//             Edit Vehicle List
//           </h2>
//           {errors.vehicles?.message && (
//                     <p className="text-red-500 text-sm mb-2">{errors.vehicles.message}</p>
//                 )}

//           <div className="flex-1 overflow-y-auto bg-white rounded mb-6 space-y-4">
//             <div className="grid grid-cols-5 bg-main text-white text-sm font-semibold px-4 py-3 rounded">
//               <div>Car Reg</div>
//               <div>Make</div>
//               <div>Year</div>
//               <div>Fuel Type</div>
//               <div className="flex justify-center">Actions</div> {/* Combined Actions column */}
//             </div>

//             {watch("vehicles").map((vehicle: VehicleType) => (
//               <div
//                 key={vehicle.id}
//                 className="grid grid-cols-5 bg-aclightash text-sm text-black px-4 py-4 rounded shadow items-center"
//               >
//                 <div>{vehicle.registration_number || "N/A"}</div>
//                 <div>{vehicle.make || "N/A"}</div>
//                 <div>{vehicle.year_of_manufacture || "N/A"}</div>
//                 <div>{vehicle.fuel_type || "N/A"}</div>
//                 <div className="flex space-x-1 justify-center">
//                   <button
//                     type="button"
//                     onClick={() => handleEditVehicle(vehicle)}
//                     className="bg-main text-white p-2 rounded-full  hover:text-main hover:bg-white hover:border-main border-1"
//                   >
//                     <MdEdit className="text-xl cursor-pointer" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteVehicle(vehicle.id ?? "")}
//                     className="bg-main text-white p-2 rounded-full hover:text-main hover:bg-white hover:border-main border-1"
//                   >
//                     <MdDelete className="text-xl cursor-pointer" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>


//           {/* <div className="flex justify-end mb-6">
//             <button
//               type="submit"
//               className="bg-main border font-semibold hover:text-main hover:bg-white hover:border-main text-white px-7 py-3 rounded"
//               disabled={isSubmitting}
//             >
//               Save Customer
//             </button>
//           </div> */}
//           <div className="flex justify-end gap-4">
//             <button
//               type="submit"
//               className={`bg-main text-white px-5 py-2 rounded font-bold hover:bg-white hover:text-main border hover:border-main ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
//               onClick={handleSubmit(onSubmit)}
//               disabled={isSubmitting}
//             >
//               Save Customer
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-gray-100 text-black px-5 py-2 rounded hover:bg-gray-200"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>

//             {isSubmitting && (
//               <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//               </div>
//             )}
//           </div>
//         </form>

//         {showEditVehiclePopup && (
//           <EditVehiclePopup
//             closePopup={() => {
//               setShowEditVehiclePopup(false);
//               setEditingVehicleId(null);
//               setTempVehicleData(null);
//             }}
//             onSave={editingVehicleId ? handleUpdateVehicle : handleAddVehicle}
//             initialData={tempVehicleData || {
//               registration_number: "",
//               make: "",
//               fuel_type: "",
//               tax_status: "",
//               year_of_manufacture: "",
//               colour: "",
//               mot_expiry_date: "",
//               mileage: "",
//             }}
//             isEditMode={!!editingVehicleId}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// import { useState, useEffect, useRef } from "react";
// import { Header } from "../Header";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   customerSchema,
//   type CustomerFormType,
//   type VehicleType,
// } from "../../commonapicall/utils/AddCustomerInfoSchema";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { EditVehiclePopup } from "../VehiclesPopups/EditVehiclePopup";
// // import { AddVehiclePopup } from "../VehiclesPopups/AddVehiclePopup";
// import { AddVehiclePopup } from "../VehiclesPopups/AddVehiclesPopup";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { MdDelete, MdEdit } from "react-icons/md";

// const OS_API_KEY = 'C6hpVCnxKcvEx7XXRt3O8gxdwmt2GavF';

// export const EditCustomerInfoPage = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
//   const [tempVehicleData, setTempVehicleData] = useState<VehicleType | null>(null);
//   const [showEditVehiclePopup, setShowEditVehiclePopup] = useState(false);
//   const [showAddVehiclePopup, setShowAddVehiclePopup] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
//   const [showAddressDropdown, setShowAddressDropdown] = useState(false);
//   const [isFetchingAddress, setIsFetchingAddress] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const addressInputRef = useRef<HTMLInputElement>(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     getValues,
//     watch,
//     trigger,
//     clearErrors,
//   } = useForm<CustomerFormType>({
//     resolver: zodResolver(customerSchema),
//     defaultValues: {
//       date: new Date().toISOString().split('T')[0],
//       vehicles: [] as VehicleType[],
//     },
//   });

//   const postalCode = watch("postal_code") || "";

//   // Fetch addresses when postal code changes
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       if (!postalCode || postalCode.length < 3) return;

//       try {
//         setIsFetchingAddress(true);
//         const response = await axios.get(
//           `https://api.os.uk/search/places/v1/postcode?postcode=${encodeURIComponent(postalCode)}&key=${OS_API_KEY}`
//         );
//         setAddressSuggestions(response.data.results || []);
//       } catch (error) {
//         console.error("Address fetch error:", error);
//         toast.error("Failed to fetch addresses. Please check postal code");
//       } finally {
//         setIsFetchingAddress(false);
//       }
//     };

//     const handler = setTimeout(fetchAddresses, 500);
//     return () => clearTimeout(handler);
//   }, [postalCode]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
//         addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
//         setShowAddressDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleAddressSelect = (address: string) => {
//     setValue("home_address", address);
//     setShowAddressDropdown(false);
//   };

//   // Fetch customer data when component mounts
//   useEffect(() => {
//     const fetchCustomerData = async () => {
//       try {
//         const response = await axios.patch(
//           `http://217.154.63.73:8000/api/customer/update/${id}/`
//         );
//         const customerData = response.data.data;

//         // Helper function to format date as YYYY-MM-DD
//         const formatDate = (dateString: string | null | undefined): string => {
//           if (!dateString) return "";
//           try {
//             const date = new Date(dateString);
//             if (isNaN(date.getTime())) return "";
//             const year = date.getFullYear();
//             const month = String(date.getMonth() + 1).padStart(2, '0');
//             const day = String(date.getDate()).padStart(2, '0');
//             return `${year}-${month}-${day}`;
//           } catch {
//             return "";
//           }
//         };

//         const formattedDate = formatDate(customerData.date) || new Date().toISOString().split('T')[0];

//         const vehicles: VehicleType[] = customerData.vehicles.map((vehicle: any) => ({
//           id: String(vehicle.id),
//           registration_number: vehicle.registration_number || "",
//           make: vehicle.make || "",
//           fuel_type: vehicle.fuel_type || "",
//           tax_status: vehicle.tax_status || "",
//           mileage: vehicle.mileage || "",
//           year_of_manufacture: vehicle.year_of_manufacture?.toString() || "",
//           colour: vehicle.colour || "",
//           mot_expiry_date: formatDate(vehicle.mot_expiry_date),
//         }));

//         reset({
//           full_name: customerData.full_name,
//           home_address: customerData.home_address,
//           phone_number: customerData.phone_number,
//           postal_code: customerData.postal_code,
//           email: customerData.email,
//           date: formattedDate,
//           remarks:customerData.remarks,
//           vehicles: vehicles,
//         });
//       } catch (error) {
//         console.error("Error fetching customer data:", error);
//         toast.error("Failed to load customer data");
//       }
//     };

//     fetchCustomerData();
//   }, [id, reset]);

//   const onSubmit = async (data: CustomerFormType) => {
//     setIsSubmitting(true);
//     try {
//       // Helper function to validate and format date as YYYY-MM-DD
//       const formatDateForApi = (dateString: string | undefined): string | null => {
//         if (!dateString) return null;
//         // If already in correct format, return as-is
//         if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
//           return dateString;
//         }
//         try {
//           const date = new Date(dateString);
//           if (isNaN(date.getTime())) return null;
//           const year = date.getFullYear();
//           const month = String(date.getMonth() + 1).padStart(2, '0');
//           const day = String(date.getDate()).padStart(2, '0');
//           return `${year}-${month}-${day}`;
//         } catch {
//           return null;
//         }
//       };

//       const payload = {
//         ...data,
//         date: formatDateForApi(data.date),
//         vehicles: data.vehicles.map(vehicle => {
//           const { id, ...vehicleWithoutId } = vehicle;
//           return {
//             ...vehicleWithoutId,
//             mot_expiry_date: formatDateForApi(vehicle.mot_expiry_date)
//           };
//         })
//       };

//       const response = await axios.put(
//         `http://217.154.63.73:8000/api/customer/update/${id}/`,
//         payload
//       );
//       console.log("Update successful:", response.data);
//       toast.success("Customer updated successfully!");
//       navigate("/CustomerInfo");
//     } catch (error) {
//       console.error("Error updating customer:", error);
//       toast.error("Failed to update customer");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleEditVehicle = (vehicle: VehicleType) => {
//     setEditingVehicleId(vehicle.id ?? "");
//     setTempVehicleData({
//       ...vehicle,
//       year_of_manufacture: vehicle.year_of_manufacture?.toString() || ""
//     });
//     setShowEditVehiclePopup(true);
//   };

//   const handleDeleteVehicle = async (vehicleId: string) => {
//     try {
//       const currentVehicles = getValues("vehicles");
//       const updatedVehicles = currentVehicles.filter((v) => v.id !== vehicleId);
//       setValue("vehicles", updatedVehicles);
//       toast.success("Vehicle deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting vehicle:", error);
//       toast.error("Failed to delete vehicle");
//     }
//   };

//   const handleAddVehicleClick = async () => {
//     const valid = await trigger([
//       "full_name",
//       "home_address",
//       "phone_number",
//       "postal_code",
//       "email",
//       "date"
//     ]);

//     if (valid) {
//       setShowAddVehiclePopup(true);
//     } else {
//       toast.error("Please fill out the customer form correctly first.");
//     }
//   };

//   const handleAddVehicle = (vehicle: VehicleType) => {
//     const newVehicle = {
//       ...vehicle,
//       id: String(Date.now()),
//     };

//     const currentVehicles = getValues("vehicles");
//     setValue("vehicles", [...currentVehicles, newVehicle]);
//     setShowAddVehiclePopup(false);
//     toast.success("Vehicle added successfully!");
//   };

//   const handleUpdateVehicle = (vehicle: VehicleType) => {
//     if (!editingVehicleId) return;

//     const currentVehicles = getValues("vehicles");
//     const updatedVehicles = currentVehicles.map((v) =>
//       v.id === editingVehicleId ? { ...v, ...vehicle } : v
//     );

//     setValue("vehicles", updatedVehicles);
//     setShowEditVehiclePopup(false);
//     setEditingVehicleId(null);
//     toast.success("Vehicle updated successfully!");
//   };

//   const handleCancel = () => {
//     navigate("/CustomerInfo");
//   };

//   return (
//     <div className="min-h-screen bg-[#F3F4F6]">
//       <Header />
//       <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-w-full shadow-lg relative flex flex-col mx-auto mt-10">
//         {isSubmitting && (
//           <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//           </div>
//         )}
//         {isFetchingAddress && (
//           <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//           </div>
//         )}
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-main uppercase">
//               Edit Customer Information
//             </h2>
//           </div>

//           <div className="grid grid-cols-3 gap-4 mb-6">
//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Full Name<span className="text-red-500">*</span></label>
//               <input
//                 {...register("full_name")}
//                 type="text"
//                 placeholder="Full Name"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("full_name", e.target.value);
//                   clearErrors("full_name");
//                 }}
//               />
//               {errors.full_name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col relative">
//               <label className="mb-1 font-medium text-gray-700">
//                 Address<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 {...register("home_address")}
//                 placeholder="Address"
//                 ref={addressInputRef}
//                 value={watch("home_address") || ""}
//                 onChange={(e) => {
//                   setValue("home_address", e.target.value);
//                   clearErrors("home_address");
//                 }}
//                 onFocus={() => {
//                   if (postalCode?.length >= 3 && addressSuggestions.length > 0) {
//                     setShowAddressDropdown(true);
//                   }
//                 }}
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//               />
//               {showAddressDropdown && addressSuggestions.length > 0 && (
//                 <div
//                   ref={dropdownRef}
//                   className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-18"
//                 >
//                   {addressSuggestions.map((result, index) => (
//                     <div
//                       key={index}
//                       className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                       onClick={() => handleAddressSelect(result.DPA.ADDRESS)}
//                     >
//                       {result.DPA.ADDRESS}
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {errors.home_address && (
//                 <p className="text-red-500 text-sm mt-1">{errors.home_address.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Phone<span className="text-red-500">*</span></label>
//               <input
//                 {...register("phone_number")}
//                 type="text"
//                 placeholder="Phone"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("phone_number", e.target.value);
//                   clearErrors("phone_number");
//                 }}
//               />
//               {errors.phone_number && (
//                 <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Post Code</label>
//               <input
//                 {...register("postal_code")}
//                 type="text"
//                 placeholder="Post code"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("postal_code", e.target.value);
//                   clearErrors("postal_code");
//                   if (e.target.value.length >= 3) {
//                     setShowAddressDropdown(true);
//                   } else {
//                     setShowAddressDropdown(false);
//                     setAddressSuggestions([]);
//                   }
//                 }}
//               />
//               {errors.postal_code && (
//                 <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
//               <input
//                 {...register("email")}
//                 type="email"
//                 placeholder="Email"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("email", e.target.value);
//                   clearErrors("email");
//                 }}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Date</label>
//               <input
//                 {...register("date")}
//                 type="date"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//               />
//               {errors.date && (
//                 <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
//               )}
//             </div>
//             <div className="flex flex-col">
//               <label className="mb-1 font-medium text-gray-700">Remarks</label>
//               <input
//                 {...register("remarks")}
//                 type="text"
//                 placeholder="Remarks"
//                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                 onChange={(e) => {
//                   setValue("remarks", e.target.value);
//                   clearErrors("remarks");
//                 }}
//               />
//               {errors.remarks && (
//                 <p className="text-red-500 text-sm mt-1">{errors.remarks.message}</p>
//               )}
//             </div>
//           </div>

//           <div className="flex justify-end mb-4">
//             <button
//               type="button"
//               onClick={handleAddVehicleClick}
//               className="bg-main text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-main border hover:border-main"
//             >
//               Add Vehicle
//             </button>
//           </div>

//           <h2 className="text-2xl font-bold text-main mb-6 uppercase">
//             Edit Vehicle List
//           </h2>
//           {errors.vehicles?.message && (
//             <p className="text-red-500 text-sm mb-2">{errors.vehicles.message}</p>
//           )}

//           <div className="flex-1 overflow-y-auto bg-white rounded mb-6 space-y-4">
//             <div className="grid grid-cols-5 bg-main text-white text-sm font-semibold px-4 py-3 rounded">
//               <div>Car Reg</div>
//               <div>Make</div>
//               <div>Year</div>
//               <div>Fuel Type</div>
//               <div className="flex justify-center">Actions</div>
//             </div>

//             {watch("vehicles").map((vehicle: VehicleType) => (
//               <div
//                 key={vehicle.id}
//                 className="grid grid-cols-5 bg-aclightash text-sm text-black px-4 py-4 rounded shadow items-center"
//               >
//                 <div>{vehicle.registration_number || "N/A"}</div>
//                 <div>{vehicle.make || "N/A"}</div>
//                 <div>{vehicle.year_of_manufacture || "N/A"}</div>
//                 <div>{vehicle.fuel_type || "N/A"}</div>
//                 <div className="flex space-x-1 justify-center">
//                   <button
//                     type="button"
//                     onClick={() => handleEditVehicle(vehicle)}
//                     className="bg-main text-white p-2 rounded-full hover:text-main hover:bg-white hover:border-main border-1"
//                   >
//                     <MdEdit className="text-xl cursor-pointer" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleDeleteVehicle(vehicle.id ?? "")}
//                     className="bg-main text-white p-2 rounded-full hover:text-main hover:bg-white hover:border-main border-1"
//                   >
//                     <MdDelete className="text-xl cursor-pointer" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="flex justify-end gap-4">
//             <button
//               type="submit"
//               className={`bg-main text-white px-5 py-2 rounded font-bold hover:bg-white hover:text-main border hover:border-main ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
//               disabled={isSubmitting}
//             >
//               Save Customer
//             </button>
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-gray-100 text-black px-5 py-2 rounded hover:bg-gray-200"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>

//         {showAddVehiclePopup && (
//           <AddVehiclePopup
//             closePopup={() => setShowAddVehiclePopup(false)}
//             onSave={handleAddVehicle}
//           />
//         )}

//         {showEditVehiclePopup && (
//           <EditVehiclePopup
//             closePopup={() => {
//               setShowEditVehiclePopup(false);
//               setEditingVehicleId(null);
//               setTempVehicleData(null);
//             }}
//             onSave={handleUpdateVehicle}
//             initialData={tempVehicleData || {
//               registration_number: "",
//               make: "",
//               fuel_type: "",
//               tax_status: "",
//               year_of_manufacture: "",
//               colour: "",
//               mot_expiry_date: "",
//               mileage: "",
//             }}
//             isEditMode={true}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

import { useState, useEffect, useRef } from "react";
import { Header } from "../Header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  customerSchema,
  type CustomerFormType,
  type VehicleType,
} from "../../commonapicall/utils/AddCustomerInfoSchema";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { EditVehiclePopup } from "../VehiclesPopups/EditVehiclePopup";
import { AddVehiclePopup } from "../VehiclesPopups/AddVehiclesPopup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete, MdEdit } from "react-icons/md";

const OS_API_KEY = 'C6hpVCnxKcvEx7XXRt3O8gxdwmt2GavF';

export const EditCustomerInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [tempVehicleData, setTempVehicleData] = useState<VehicleType | null>(null);
  const [showEditVehiclePopup, setShowEditVehiclePopup] = useState(false);
  const [showAddVehiclePopup, setShowAddVehiclePopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
    trigger,
    clearErrors,
  } = useForm<CustomerFormType>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      vehicles: [] as VehicleType[],
      remarks: null,
    },
  });

  const postalCode = watch("postal_code") || "";

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!postalCode || postalCode.length < 3) return;

      try {
        setIsFetchingAddress(true);
        const response = await axios.get(
          `https://api.os.uk/search/places/v1/postcode?postcode=${encodeURIComponent(postalCode)}&key=${OS_API_KEY}`
        );
        setAddressSuggestions(response.data.results || []);
      } catch (error) {
        console.error("Address fetch error:", error);
        toast.error("Failed to fetch addresses. Please check postal code");
      } finally {
        setIsFetchingAddress(false);
      }
    };

    const handler = setTimeout(fetchAddresses, 500);
    return () => clearTimeout(handler);
  }, [postalCode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
        setShowAddressDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddressSelect = (address: string) => {
    setValue("home_address", address);
    setShowAddressDropdown(false);
  };

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await axios.patch(
          `http://217.154.63.73:8000/api/customer/update/${id}/`
        );
        const customerData = response.data.data;

        const formatDate = (dateString: string | null | undefined): string => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          } catch {
            return "";
          }
        };

        const formattedDate = formatDate(customerData.date) || new Date().toISOString().split('T')[0];

        const vehicles: VehicleType[] = customerData.vehicles.map((vehicle: any) => ({
          id: String(vehicle.id),
          registration_number: vehicle.registration_number || "",
          make: vehicle.make || "",
          fuel_type: vehicle.fuel_type || "",
          tax_status: vehicle.tax_status || "",
          mileage: vehicle.mileage || "",
          year_of_manufacture: vehicle.year_of_manufacture?.toString() || "",
          colour: vehicle.colour || "",
          mot_expiry_date: formatDate(vehicle.mot_expiry_date),
        }));

        reset({
          full_name: customerData.full_name,
          home_address: customerData.home_address,
          phone_number: customerData.phone_number,
          postal_code: customerData.postal_code,
          email: customerData.email,
          date: formattedDate,
          remarks: customerData.remarks ?? null,
          vehicles: vehicles,
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
        toast.error("Failed to load customer data");
      }
    };

    fetchCustomerData();
  }, [id, reset]);

  // const onSubmit = async (data: CustomerFormType) => {
  //   setIsSubmitting(true);
  //   try {
  //     const formatDateForApi = (dateString: string | undefined): string | null => {
  //       if (!dateString) return null;
  //       if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
  //         return dateString;
  //       }
  //       try {
  //         const date = new Date(dateString);
  //         if (isNaN(date.getTime())) return null;
  //         const year = date.getFullYear();
  //         const month = String(date.getMonth() + 1).padStart(2, '0');
  //         const day = String(date.getDate()).padStart(2, '0');
  //         return `${year}-${month}-${day}`;
  //       } catch {
  //         return null;
  //       }
  //     };

  //     const payload = {
  //       ...data,
  //       date: formatDateForApi(data.date),
  //       remarks: data.remarks ?? null,
  //       vehicles: data.vehicles.map(vehicle => {
  //         const { id, ...vehicleWithoutId } = vehicle;
  //         return {
  //           ...vehicleWithoutId,
  //           mot_expiry_date: formatDateForApi(vehicle.mot_expiry_date)
  //         };
  //       })
  //     };

  //     const response = await axios.put(
  //       `http://217.154.63.73:8000/api/customer/update/${id}/`,
  //       payload
  //     );
  //     console.log("Update successful:", response.data);
  //     toast.success("Customer updated successfully!");
  //     navigate("/CustomerInfo");
  //   } catch (error) {
  //     console.error("Error updating customer:", error);
  //     toast.error("Failed to update customer");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = async (data: CustomerFormType) => {
    setIsSubmitting(true);

    const formatDateForApi = (dateString: string | undefined): string | null => {
      if (!dateString) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch {
        return null;
      }
    };

    try {
      const payload = {
        ...data,
        date: formatDateForApi(data.date),
        remarks: data.remarks ?? null,
        vehicles: data.vehicles.map(vehicle => {
          const { id, ...vehicleWithoutId } = vehicle;
          return {
            ...vehicleWithoutId,
            mot_expiry_date: formatDateForApi(vehicle.mot_expiry_date)
          };
        })
      };

      const response = await axios.put(
        `http://217.154.63.73:8000/api/customer/update/${id}/`,
        payload
      );

      console.log("Update successful:", response.data);
      toast.success("Customer updated successfully!");
      navigate("/CustomerInfo");
    }
  // catch (error: any) {
  //   console.error("Error updating customer:", error);

  //   // Extract backend message if available
  //   let errorMessage = "Failed to update customer";
  //   if (error.response?.data) {
  //     if (typeof error.response.data === "string") {
  //       errorMessage = error.response.data;
  //     } else if (Array.isArray(error.response.data)) {
  //       errorMessage = error.response.data.join(", ");
  //     } else if (typeof error.response.data === "object") {
  //       const messages: string[] = [];
  //       for (const key in error.response.data) {
  //         if (Array.isArray(error.response.data[key])) {
  //           messages.push(...error.response.data[key]);
  //         } else if (typeof error.response.data[key] === "string") {
  //           messages.push(error.response.data[key]);
  //         }
  //       }
  //       if (messages.length > 0) {
  //         errorMessage = messages.join(", ");
  //       }
  //     }
  //   }

  //   toast.error(errorMessage);
  // } finally {
  //   setIsSubmitting(false);
  // }
   catch (error: any) {
    console.error("Error updating customer:", error);

    let errorMessage = "Failed to update customer";
    if (error.response?.data) {
      const backendData = error.response.data;
      if (backendData.data && Array.isArray(backendData.data) && backendData.data.length > 0) {
        // Only take the first message from `data`
        errorMessage = backendData.data[0];
      }
    }

    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }

};

const handleEditVehicle = (vehicle: VehicleType) => {
  setEditingVehicleId(vehicle.id ?? "");
  setTempVehicleData({
    ...vehicle,
    year_of_manufacture: vehicle.year_of_manufacture?.toString() || ""
  });
  setShowEditVehiclePopup(true);
};

const handleDeleteVehicle = async (vehicleId: string) => {
  try {
    const currentVehicles = getValues("vehicles");
    const updatedVehicles = currentVehicles.filter((v) => v.id !== vehicleId);
    setValue("vehicles", updatedVehicles);
    toast.success("Vehicle deleted successfully!");
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    toast.error("Failed to delete vehicle");
  }
};

const handleAddVehicleClick = async () => {
  const valid = await trigger([
    "full_name",
    "home_address",
    "phone_number",
    "postal_code",
    "email",
    "date"
  ]);

  if (valid) {
    setShowAddVehiclePopup(true);
  } else {
    toast.error("Please fill out the customer form correctly first.");
  }
};

const handleAddVehicle = (vehicle: VehicleType) => {
  const newVehicle = {
    ...vehicle,
    id: String(Date.now()),
  };

  const currentVehicles = getValues("vehicles");
  setValue("vehicles", [...currentVehicles, newVehicle]);
  setShowAddVehiclePopup(false);
  toast.success("Vehicle added successfully!");
};

const handleUpdateVehicle = (vehicle: VehicleType) => {
  if (!editingVehicleId) return;

  const currentVehicles = getValues("vehicles");
  const updatedVehicles = currentVehicles.map((v) =>
    v.id === editingVehicleId ? { ...v, ...vehicle } : v
  );

  setValue("vehicles", updatedVehicles);
  setShowEditVehiclePopup(false);
  setEditingVehicleId(null);
  toast.success("Vehicle updated successfully!");
};

const handleCancel = () => {
  navigate("/CustomerInfo");
};

return (
  <div className="min-h-screen bg-[#F3F4F6]">
    <Header />
    <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-w-full shadow-lg relative flex flex-col mx-auto mt-10">
      {isSubmitting && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
        </div>
      )}
      {isFetchingAddress && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-main uppercase">
            Edit Customer Information
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Full Name<span className="text-red-500">*</span></label>
            <input
              {...register("full_name")}
              type="text"
              placeholder="Full Name"
              className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              onChange={(e) => {
                setValue("full_name", e.target.value);
                clearErrors("full_name");
              }}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
            )}
          </div>

          <div className="flex flex-col relative">
            <label className="mb-1 font-medium text-gray-700">
              Address<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("home_address")}
              placeholder="Address"
              ref={addressInputRef}
              value={watch("home_address") || ""}
              onChange={(e) => {
                setValue("home_address", e.target.value);
                clearErrors("home_address");
              }}
              onFocus={() => {
                if (postalCode?.length >= 3 && addressSuggestions.length > 0) {
                  setShowAddressDropdown(true);
                }
              }}
              className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
            />
            {showAddressDropdown && addressSuggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-18"
              >
                {addressSuggestions.map((result, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleAddressSelect(result.DPA.ADDRESS)}
                  >
                    {result.DPA.ADDRESS}
                  </div>
                ))}
              </div>
            )}
            {errors.home_address && (
              <p className="text-red-500 text-sm mt-1">{errors.home_address.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Phone<span className="text-red-500">*</span></label>
            <input
              {...register("phone_number")}
              type="text"
              placeholder="Phone"
              className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              onChange={(e) => {
                setValue("phone_number", e.target.value);
                clearErrors("phone_number");
              }}
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Post Code</label>
            <input
              {...register("postal_code")}
              type="text"
              placeholder="Post code"
              className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              onChange={(e) => {
                setValue("postal_code", e.target.value);
                clearErrors("postal_code");
                if (e.target.value.length >= 3) {
                  setShowAddressDropdown(true);
                } else {
                  setShowAddressDropdown(false);
                  setAddressSuggestions([]);
                }
              }}
            />
            {errors.postal_code && (
              <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              onChange={(e) => {
                setValue("email", e.target.value);
                clearErrors("email");
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">Date</label>
            <input
              {...register("date")}
              type="date"
              className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          
        </div>
        <div className="flex flex-col mb-4">
            <label className="mb-1 font-medium text-gray-700">Remarks</label>
            <textarea
              {...register("remarks")}
              // type="text"
              placeholder="Remarks"
              className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              onChange={(e) => {
                setValue("remarks", e.target.value === "" ? null : e.target.value);
                clearErrors("remarks");
              }}
              value={watch("remarks") ?? ""}
            />
            {errors.remarks && (
              <p className="text-red-500 text-sm mt-1">{errors.remarks.message}</p>
            )}
          </div>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={handleAddVehicleClick}
            className="bg-main text-white px-4 py-2 rounded font-bold hover:bg-white hover:text-main border hover:border-main"
          >
            Add Vehicle
          </button>
        </div>

        <h2 className="text-2xl font-bold text-main mb-6 uppercase">
          Edit Vehicle List
        </h2>
        {errors.vehicles?.message && (
          <p className="text-red-500 text-sm mb-2">{errors.vehicles.message}</p>
        )}

        <div className="flex-1 overflow-y-auto bg-white rounded mb-6 space-y-4">
          <div className="grid grid-cols-5 bg-main text-white text-sm font-semibold px-4 py-3 rounded">
            <div>Car reg</div>
            <div>Make</div>
            <div>Year</div>
            <div>Fuel Type</div>
            <div className="flex justify-center">Actions</div>
          </div>

          {watch("vehicles").length > 0 ? (
            watch("vehicles").map((vehicle: VehicleType) => (
              <div
                key={vehicle.id}
                className="grid grid-cols-5 bg-aclightash text-sm text-black px-4 py-4 rounded shadow items-center"
              >
                <div>{vehicle.registration_number || "N/A"}</div>
                <div>{vehicle.make || "N/A"}</div>
                <div>{vehicle.year_of_manufacture || "N/A"}</div>
                <div>{vehicle.fuel_type || "N/A"}</div>
                <div className="flex space-x-1 justify-center">
                  <button
                    type="button"
                    onClick={() => handleEditVehicle(vehicle)}
                    className="bg-main text-white p-2 rounded-full hover:text-main hover:bg-white hover:border-main border-1"
                  >
                    <MdEdit className="text-xl cursor-pointer" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVehicle(vehicle.id ?? "")}
                    className="bg-main text-white p-2 rounded-full hover:text-main hover:bg-white hover:border-main border-1"
                  >
                    <MdDelete className="text-xl cursor-pointer" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No vehicles added yet
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            className={`bg-main text-white px-5 py-2 rounded font-bold hover:bg-white hover:text-main border hover:border-main ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSubmitting}
          >
            Save Customer
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-100 text-black px-5 py-2 rounded hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>

      {showAddVehiclePopup && (
        <AddVehiclePopup
          closePopup={() => setShowAddVehiclePopup(false)}
          onSave={handleAddVehicle}
        />
      )}

      {showEditVehiclePopup && (
        <EditVehiclePopup
          closePopup={() => {
            setShowEditVehiclePopup(false);
            setEditingVehicleId(null);
            setTempVehicleData(null);
          }}
          onSave={handleUpdateVehicle}
          initialData={tempVehicleData || {
            registration_number: "",
            make: "",
            fuel_type: "",
            tax_status: "",
            year_of_manufacture: "",
            colour: "",
            mot_expiry_date: "",
            mileage: "",
          }}
          isEditMode={true}
        />
      )}
    </div>
  </div>
);
};
// // AddCustomerPage.tsx
// import { useEffect, useState } from "react";
// import { InputField } from "../../common/InputField";
// import { Header } from "../../components/Header";
// import 'react-phone-input-2/lib/style.css';
// import PhoneInput from "react-phone-input-2";
// import { useLocation, useNavigate } from "react-router-dom";
// import * as zod from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller } from "react-hook-form";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { EditCustomerInfo } from "../../commonapicall/CutomerInfoapis/CutomerInfoapis";

// // Define validation schema
// const customerSchema = zod.object({
//     first_name: zod.string().min(3, "First name is required"),
//     last_name: zod.string().min(3, "Last name is required"),
//     phone_number: zod.string()
//         .min(10, "Phone number is required")
//         .refine(val => /^\d+$/.test(val), "Phone number must contain only digits"),
//     email: zod
//         .string()
//         .min(3, "Email is required")
//         .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
//     home_address: zod.string()
//         .min(3, "Address is required"),
//     date: zod.string().optional()
// });

// type CustomerFormData = zod.infer<typeof customerSchema>;

// export const EditCustomerPage = () => {
//     const [, setPhone] = useState('');
//     const navigate = useNavigate();
//     const { id } = useParams(); // This gives you the ID from the route like /customer/edit/:id
//     const location = useLocation();
//     const [isLoading, setIsLoading] = useState(false);
//     // Get the customer data from navigation state
//     const customerData = location.state?.customerData;
//     const {
//         register,
//         handleSubmit,
//         control,
//         formState: { errors },
//         setValue,
//     } = useForm<CustomerFormData>({
//         resolver: zodResolver(customerSchema),
//     });

//     useEffect(() => {
//         if (customerData) {
//             setValue("first_name", customerData.first_name);
//             setValue("last_name", customerData.last_name);
//             setValue("phone_number", customerData.phone_number);
//             setValue("email", customerData.email);
//             setValue("home_address", customerData.home_address);
//             setValue("date", customerData.date);
//             setPhone(customerData.phone_number);
//         }
//     }, [customerData, setValue]);

//     const onSubmit = async (data: CustomerFormData) => {
//         setIsLoading(true);
//         try {
//             if (!id) {
//                 toast.error("Customer ID is missing");
//                 return;
//             }
//             const response = await EditCustomerInfo({
//                 id: parseInt(id),
//                 Email: data.email || 'N/A',
//                 FirstName: data.first_name || 'N/A',
//                 LastName: data.last_name || 'N/A',
//                 PhoneNumber: data.phone_number || 'N/A',
//                 HomeAddress: data.home_address || 'N/A',
//                 Date: data.date || '',
//             });
//             console.log("Customer created successfully!", response);
//             toast.success("Customer created successfully!")
//             navigate("/CustomerInfo");
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : "Something went wrong while creating the customer.";
//             console.log(errorMessage);
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="bg-gray-100 min-h-screen">
//             {isLoading && (
//                 <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//                     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//                 </div>
//             )}
//             <Header />
//             <form onSubmit={handleSubmit(onSubmit)} className="bg-white mt-6 p-6 rounded-md shadow-md max-w-6xl mx-auto">
//                 <div className="p-6">
//                     <div className="flex items-center justify-between mb-4 border-b-2 border-acgrey pb-2">
//                         <h2 className="text-2xl font-bold">Edit Customer Information</h2>
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => navigate("/CustomerInfo")}
//                                 className="px-6 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200">
//                                 Back
//                             </button>
//                             <button
//                                 className="px-6 py-2 bg-main text-white font-semibold rounded hover:bg-white border-1 hover:border-main hover:text-main ">
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-6">
//                         {/* Left Column */}
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     First Name <span className="text-red-500">*</span>
//                                 </label>
//                                 <InputField
//                                     type="text"
//                                     {...register("first_name")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
//                                     label={""}
//                                 />
//                                 {errors.first_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Last Name <span className="text-red-500">*</span>
//                                 </label>
//                                 <InputField
//                                     type="text"
//                                     {...register("last_name")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
//                                     label={""} />
//                                 {errors.last_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Phone Number <span className="text-red-500">*</span>
//                                 </label>
//                                 <Controller
//                                     name="phone_number"
//                                     control={control}
//                                     defaultValue=""
//                                     render={({ field }) => (
//                                         <PhoneInput
//                                             country={'gb'}
//                                             value={field.value}
//                                             onChange={(value) => field.onChange(value)}
//                                             inputProps={{
//                                                 className: "mt-1 block w-full border-2 border-acgrey rounded px-11 py-2 focus-within:outline-none",
//                                                 autoFocus: true,
//                                                 autoFormat: true,
//                                             }}
//                                         />
//                                     )}
//                                 />
//                                 {errors.phone_number && (
//                                     <p className="text-red-500 text-sm mt-1">Phone  number is Required</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Email Address <span className="text-red-500">*</span>
//                                 </label>
//                                 <InputField
//                                     type="text"
//                                     {...register("email")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
//                                     label={""}
//                                 />
//                                 {errors.email && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Right Column */}
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Home Address <span className="text-red-500">*</span>
//                                 </label>
//                                 <textarea
//                                     rows={5}
//                                     {...register("home_address")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 resize-none focus-within:outline-none"
//                                 ></textarea>
//                                 {errors.home_address && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.home_address.message}</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Date
//                                 </label>
//                                 <InputField
//                                     type="date"
//                                     {...register("date")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
//                                     label={""} />
//                                 {errors.date && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };





// import { useEffect, useState, useRef } from "react";
// import { InputField } from "../../common/InputField";
// import { Header } from "../../components/Header";
// import 'react-phone-input-2/lib/style.css';
// import PhoneInput from "react-phone-input-2";
// import { useLocation, useNavigate } from "react-router-dom";
// import * as zod from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Controller } from "react-hook-form";
// import { useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { EditCustomerInfo } from "../../commonapicall/CutomerInfoapis/CutomerInfoapis";
// import axios from "axios";

// const OS_API_KEY = 'C6hpVCnxKcvEx7XXRt3O8gxdwmt2GavF';

// // Updated validation schema with postal_code
// const customerSchema = zod.object({
//     first_name: zod.string().min(3, "First name is required"),
//     last_name: zod.string().min(3, "Last name is required"),
//     phone_number: zod.string()
//         .min(10, "Phone number is required")
//         .refine(val => /^\d+$/.test(val), "Phone number must contain only digits"),
//     email: zod
//         .string()
//         .min(3, "Email is required")
//         .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
//     postal_code: zod.string().optional(),
//     home_address: zod.string()
//         .min(3, "Address is required"),
//     date: zod.string().optional()
// });

// type CustomerFormData = zod.infer<typeof customerSchema>;

// export const EditCustomerPage = () => {
//     const [, setPhone] = useState('');
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const location = useLocation();
//     const [isLoading, setIsLoading] = useState(false);
//     const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
//     const [showDropdown, setShowDropdown] = useState(false);
//     const [isFetchingAddress, setIsFetchingAddress] = useState(false);
//     const dropdownRef = useRef<HTMLDivElement>(null);
//     const addressInputRef = useRef<HTMLTextAreaElement>(null);
    
//     const customerData = location.state?.customerData;
//     const {
//         register,
//         handleSubmit,
//         control,
//         formState: { errors },
//         setValue,
//         watch,
//     } = useForm<CustomerFormData>({
//         resolver: zodResolver(customerSchema),
//     });

//     const postalCode = watch("postal_code");

//     useEffect(() => {
//         if (customerData) {
//             setValue("first_name", customerData.first_name);
//             setValue("last_name", customerData.last_name);
//             setValue("phone_number", customerData.phone_number);
//             setValue("email", customerData.email);
//             setValue("home_address", customerData.home_address);
//             setValue("date", customerData.date);
//             setValue("postal_code", customerData.postal_code || '');
//             setPhone(customerData.phone_number);
//         }
//     }, [customerData, setValue]);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
//                 addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
//                 setShowDropdown(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const fetchAddressSuggestions = async () => {
//         if (!postalCode || postalCode.length < 3) {
//             setAddressSuggestions([]);
//             return;
//         }

//         try {
//             setIsFetchingAddress(true);
//             const response = await axios.get(
//                 `https://api.os.uk/search/places/v1/postcode?postcode=${encodeURIComponent(postalCode)}&key=${OS_API_KEY}`
//             );
            
//             const results = response.data.results || [];
//             setAddressSuggestions(results);
            
//             if (results.length === 0) {
//                 toast.info("No addresses found for this postal code");
//             }
//         } catch (error) {
//             console.error("Error fetching addresses:", error);
//             toast.error("Failed to fetch addresses");
//         } finally {
//             setIsFetchingAddress(false);
//         }
//     };

//     const handleAddressSelect = (address: string) => {
//         setValue("home_address", address, { shouldValidate: true });
//         setShowDropdown(false);
//     };

//     const handleAddressFieldClick = () => {
//         if (postalCode && postalCode.length >= 3) {
//             fetchAddressSuggestions();
//             setShowDropdown(true);
//         } else {
//             toast.info("Please enter a valid postal code first");
//         }
//     };

//     const onSubmit = async (data: CustomerFormData) => {
//         setIsLoading(true);
//         try {
//             if (!id) {
//                 toast.error("Customer ID is missing");
//                 return;
//             }
//             const response = await EditCustomerInfo({
//                 id: parseInt(id),
//                 Email: data.email,
//                 FirstName: data.first_name,
//                 LastName: data.last_name,
//                 PhoneNumber: data.phone_number,
//                 HomeAddress: data.home_address,
//                 Date: data.date,
//                 //PostalCode: data.postal_code,
//             });
//             console.log(response)
//             toast.success("Customer updated successfully!");
//             navigate("/CustomerInfo");
//         } catch (error: unknown) {
//             const errorMessage = error instanceof Error ? error.message : "Something went wrong while updating the customer.";
//             toast.error(errorMessage);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="bg-gray-100 min-h-screen">
//             {isLoading && (
//                 <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//                     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//                 </div>
//             )}
//             <Header />
//             <form onSubmit={handleSubmit(onSubmit)} className="bg-white mt-6 p-6 rounded-md shadow-md max-w-6xl mx-auto">
//                 <div className="p-6">
//                     <div className="flex items-center justify-between mb-4 border-b-2 border-acgrey pb-2">
//                         <h2 className="text-2xl font-bold">Edit Customer Information</h2>
//                         <div className="flex gap-2">
//                             <button
//                                 type="button"
//                                 onClick={() => navigate("/CustomerInfo")}
//                                 className="px-6 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200">
//                                 Back
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="px-6 py-2 bg-main text-white font-semibold rounded hover:bg-white border-1 hover:border-main hover:text-main">
//                                 Save
//                             </button>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-6">
//                         {/* Left Column */}
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     First Name <span className="text-red-500">*</span>
//                                 </label>
//                                 <InputField
//                                     label={""} type="text"
//                                     {...register("first_name")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
//                                 {errors.first_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Last Name <span className="text-red-500">*</span>
//                                 </label>
//                                 <InputField
//                                     label={""} type="text"
//                                     {...register("last_name")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
//                                 {errors.last_name && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Phone Number <span className="text-red-500">*</span>
//                                 </label>
//                                 <Controller
//                                     name="phone_number"
//                                     control={control}
//                                     defaultValue=""
//                                     render={({ field }) => (
//                                         <PhoneInput
//                                             country={'gb'}
//                                             value={field.value}
//                                             onChange={(value) => field.onChange(value)}
//                                             inputProps={{
//                                                 className: "mt-1 block w-full border-2 border-acgrey rounded px-11 py-2 focus-within:outline-none",
//                                                 autoFocus: true,
//                                             }}
//                                         />
//                                     )}
//                                 />
//                                 {errors.phone_number && (
//                                     <p className="text-red-500 text-sm mt-1">Phone number is Required</p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Email Address <span className="text-red-500">*</span>
//                                 </label>
//                                 <InputField
//                                     label={""} type="text"
//                                     {...register("email")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
//                                 {errors.email && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Right Column */}
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Postal Code <span className="text-red-500">*</span>
//                                 </label>
//                                 <InputField
//                                     label={""} type="text"
//                                     {...register("postal_code")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
//                                 {isFetchingAddress && (
//                                     <div className="absolute right-3 top-3">
//                                         <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-main"></div>
//                                     </div>
//                                 )}
//                                 {errors.postal_code && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
//                                 )}
//                             </div>

//                             <div className="relative">
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Home Address <span className="text-red-500">*</span>
//                                 </label>
//                                 <textarea
//                                     rows={5}
//                                     {...register("home_address")}
//                                     ref={addressInputRef}
//                                     onClick={handleAddressFieldClick}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 resize-none focus-within:outline-none"
//                                     value={watch("home_address")}
//                                     readOnly
//                                 />
//                                 {errors.home_address && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.home_address.message}</p>
//                                 )}
                                
//                                 {/* Address Dropdown */}
//                                 {showDropdown && (
//                                     <div 
//                                         ref={dropdownRef}
//                                         className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1"
//                                     >
//                                         {addressSuggestions.length > 0 ? (
//                                             addressSuggestions.map((result, index) => (
//                                                 <div
//                                                     key={index}
//                                                     className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                                     onClick={() => handleAddressSelect(result.DPA.ADDRESS)}
//                                                 >
//                                                     {result.DPA.ADDRESS}
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <div className="px-4 py-2 text-gray-500">
//                                                 {isFetchingAddress ? "Loading addresses..." : "No addresses found"}
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Date
//                                 </label>
//                                 <InputField
//                                     label={""} type="date"
//                                     {...register("date")}
//                                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
//                                 {errors.date && (
//                                     <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </div>
//     );
// };







import { useEffect, useState, useRef } from "react";
import { InputField } from "../../common/InputField";
import { Header } from "../../components/Header";
import 'react-phone-input-2/lib/style.css';
import PhoneInput from "react-phone-input-2";
import { useLocation, useNavigate } from "react-router-dom";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { EditCustomerInfo } from "../../commonapicall/CutomerInfoapis/CutomerInfoapis";
import axios from "axios";

const OS_API_KEY = 'C6hpVCnxKcvEx7XXRt3O8gxdwmt2GavF';

// Updated validation schema with postal_code
const customerSchema = zod.object({
    first_name: zod.string().min(3, "First name is required"),
    last_name: zod.string().min(3, "Last name is required"),
    phone_number: zod.string()
        .min(10, "Phone number is required")
        .refine(val => /^\d+$/.test(val), "Phone number must contain only digits"),
    email: zod
        .string()
        .min(3, "Email is required")
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    postal_code: zod.string().optional(),
    home_address: zod.string()
        .min(3, "Address is required"),
    date: zod.string().optional()
});

type CustomerFormData = zod.infer<typeof customerSchema>;

export const EditCustomerPage = () => {
    const [, setPhone] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const addressInputRef = useRef<HTMLTextAreaElement>(null);
    
    const customerData = location.state?.customerData;
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CustomerFormData>({
        resolver: zodResolver(customerSchema),
    });

    const postalCode = watch("postal_code");

    useEffect(() => {
        if (customerData) {
            setValue("first_name", customerData.first_name);
            setValue("last_name", customerData.last_name);
            setValue("phone_number", customerData.phone_number);
            setValue("email", customerData.email);
            setValue("home_address", customerData.home_address);
            setValue("date", customerData.date);
            setValue("postal_code", customerData.postal_code || '');
            setPhone(customerData.phone_number);
        }
    }, [customerData, setValue]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
                addressInputRef.current && !addressInputRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchAddressSuggestions = async () => {
        if (!postalCode || postalCode.length < 3) {
            setAddressSuggestions([]);
            return;
        }

        try {
            setIsFetchingAddress(true);
            const response = await axios.get(
                `https://api.os.uk/search/places/v1/postcode?postcode=${encodeURIComponent(postalCode)}&key=${OS_API_KEY}`
            );
            
            const results = response.data.results || [];
            setAddressSuggestions(results);
            
            if (results.length === 0) {
                toast.info("No addresses found for this postal code");
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to fetch addresses");
        } finally {
            setIsFetchingAddress(false);
        }
    };

    const handleAddressSelect = (address: string) => {
        setValue("home_address", address, { shouldValidate: true });
        setShowDropdown(false);
    };

    const handleAddressFieldClick = () => {
        if (postalCode && postalCode.length >= 3) {
            fetchAddressSuggestions();
            setShowDropdown(true);
        } else {
            toast.info("Please enter a valid postal code first");
        }
    };

    const onSubmit = async (data: CustomerFormData) => {
        setIsLoading(true);
        try {
            if (!id) {
                toast.error("Customer ID is missing");
                return;
            }
            const response = await EditCustomerInfo({
                id: parseInt(id),
                Email: data.email,
                FirstName: data.first_name,
                LastName: data.last_name,
                PhoneNumber: data.phone_number,
                HomeAddress: data.home_address,
                Date: data.date,
                //PostalCode: data.postal_code,
            });
            console.log(response)
            toast.success("Customer updated successfully!");
            navigate("/CustomerInfo");
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong while updating the customer.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {isLoading && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
                </div>
            )}
            <Header />
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white mt-6 p-6 rounded-md shadow-md max-w-6xl mx-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4 border-b-2 border-acgrey pb-2">
                        <h2 className="text-2xl font-bold">Edit Customer Information</h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => navigate("/CustomerInfo")}
                                className="px-6 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200">
                                Back
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-main text-white font-semibold rounded hover:bg-white border-1 hover:border-main hover:text-main">
                                Save
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                    label={""} type="text"
                                    {...register("first_name")}
                                    className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
                                {errors.first_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                    label={""} type="text"
                                    {...register("last_name")}
                                    className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
                                {errors.last_name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="phone_number"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <PhoneInput
                                            country={'gb'}
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                            inputProps={{
                                                className: "mt-1 block w-full border-2 border-acgrey rounded px-11 py-2 focus-within:outline-none",
                                                autoFocus: true,
                                            }}
                                        />
                                    )}
                                />
                                {errors.phone_number && (
                                    <p className="text-red-500 text-sm mt-1">Phone number is Required</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                    label={""} type="text"
                                    {...register("email")}
                                    className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Postal Code <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                    label={""} type="text"
                                    {...register("postal_code")}
                                    className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
                                {isFetchingAddress && (
                                    <div className="absolute right-3 top-3">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-main"></div>
                                    </div>
                                )}
                                {errors.postal_code && (
                                    <p className="text-red-500 text-sm mt-1">{errors.postal_code.message}</p>
                                )}
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700">
                                    Home Address <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                label={""}
                                //  rows={1}
                                {...register("home_address")}
                                //ref={addressInputRef}
                                onClick={handleAddressFieldClick}
                                className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 resize-none focus-within:outline-none"
                                value={watch("home_address")}
                                readOnly                                />
                                {errors.home_address && (
                                    <p className="text-red-500 text-sm mt-1">{errors.home_address.message}</p>
                                )}
                                
                                {/* Address Dropdown */}
                                {showDropdown && (
                                    <div 
                                        ref={dropdownRef}
                                        className="absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1"
                                    >
                                        {addressSuggestions.length > 0 ? (
                                            addressSuggestions.map((result, index) => (
                                                <div
                                                    key={index}
                                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleAddressSelect(result.DPA.ADDRESS)}
                                                >
                                                    {result.DPA.ADDRESS}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500">
                                                {isFetchingAddress ? "Loading addresses..." : "No addresses found"}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Date
                                </label>
                                <InputField
                                    label={""} type="date"
                                    {...register("date")}
                                    className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"                                />
                                {errors.date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};


















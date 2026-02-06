// import React, { useEffect, useState } from "react";
// import { IoMdClose } from "react-icons/io";
// import { vehicleSchema } from "../../commonapicall/utils/AddCustomerInfoSchema";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import type { VehicleType } from "../../commonapicall/utils/AddCustomerInfoSchema";
// import axios from "axios";

// interface EditVehiclePopupProps {
//     closePopup: () => void;
//     onSave: (vehicle: VehicleType) => void;
//     initialData: VehicleType;
//     isEditMode: boolean;
// }

// export const EditVehiclePopup: React.FC<EditVehiclePopupProps> = ({
//     closePopup,
//     onSave,
//     initialData,
//     isEditMode
// }) => {
//     const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
//     const [registrationError, setRegistrationError] = useState<string | null>(null);
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//         setValue,
//         watch,
//         reset
//     } = useForm<VehicleType>({
//         resolver: zodResolver(vehicleSchema),
//         defaultValues: initialData
//     });
//     const registrationNumber = watch("registration_number");
//     useEffect(() => {
//         reset(initialData);
//     }, [initialData, reset]);

//     const fetchVehicleDetails = async (regNumber: string) => {
//         if (!regNumber || regNumber.trim().length < 2) return;

//         setIsFetchingVehicle(true);
//         setRegistrationError(null);

//         try {
//             const response = await axios({
//                 method: 'get',
//                 url: `https://fixamatic.com/dvlaapi_check?vehicleNumber=${regNumber.trim().toUpperCase()}`,
//                 headers: {
//                     'Accept': 'application/json'
//                 }
//             });

//             const data = response.data;

//             // Handle API errors
//             if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
//                 const error = data.errors[0];
//                 throw {
//                     response: {
//                         status: parseInt(error.status),
//                         data: {
//                             detail: error.title || 'Bad Request'
//                         }
//                     }
//                 };
//             }

//             // Format dates to YYYY-MM-DD for date inputs
//             const formatDate = (dateString: string | undefined) =>
//                 dateString ? new Date(dateString).toISOString().split('T')[0] : undefined;

//             // Update form fields with API response
//             setValue('tax_status', data.taxStatus || '');
//             setValue('fuel_type', data.fuelType || '');
//             setValue('make', data.make || '');
//             setValue('year_of_manufacture', data.yearOfManufacture?.toString() || '');
//             setValue('colour', data.colour || '');
//             setValue('mot_expiry_date', formatDate(data.motExpiryDate) || '');

//         } catch (error: unknown) {
//             // Clear form fields on error
//             setValue('tax_status', '');
//             setValue('fuel_type', '');
//             setValue('make', '');
//             setValue('year_of_manufacture', '');
//             setValue('colour', '');
//             setValue('mot_expiry_date', '');

//             if (axios.isAxiosError(error)) {
//                 const status = error.response?.status;
//                 const detail = error.response?.data?.detail || '';

//                 switch (status) {
//                     case 404:
//                         setRegistrationError('Vehicle registration number not found');
//                         break;
//                     case 400:
//                         if (detail.includes('Invalid format')) {
//                             setRegistrationError('Invalid registration number format');
//                         } else {
//                             setRegistrationError(detail || 'Bad Request');
//                         }
//                         break;
//                     default:
//                         setRegistrationError('Failed to fetch vehicle details');
//                 }
//             } else {
//                 setRegistrationError('Invalid registration number');
//             }
//         } finally {
//             setIsFetchingVehicle(false);
//         }
//     };

//     // useEffect(() => {
//     //     const controller = new AbortController();
//     //     const timeoutId = setTimeout(() => {
//     //         if (registrationNumber) {
//     //             fetchVehicleDetails(registrationNumber);
//     //         }
//     //     }, 800);

//     //     return () => {
//     //         clearTimeout(timeoutId);
//     //         controller.abort();
//     //     };
//     // }, [registrationNumber]);
//     useEffect(() => {
//     const controller = new AbortController();

//     // Only fetch if in edit mode and registrationNumber exists and has changed
//     if (isEditMode && registrationNumber && registrationNumber !== initialData.registration_number) {
//         const timeoutId = setTimeout(() => {
//             fetchVehicleDetails(registrationNumber);
//         }, 800);

//         return () => {
//             clearTimeout(timeoutId);
//             controller.abort();
//         };
//     }

//     // Return empty cleanup function if not in edit mode
//     return () => {};
// }, [registrationNumber, isEditMode, initialData.registration_number]);

//     const onSubmit = async (data: VehicleType) => {
//         if (registrationError) {
//             return; // Prevent submission if there's an error
//         }
//         try {
//             await onSave(data);
//         } catch (error) {
//             console.error("Error saving vehicle:", error);
//         }
//     };


//     return (
//         <div className="fixed inset-0 bg-acash bg-opacity-40 flex items-center justify-center z-50">
//             {isFetchingVehicle && (
//                 <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//                     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//                 </div>
//             )}
//             <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-w-full max-h-screen overflow-auto shadow-lg relative flex flex-col">
//                 {/* Close Button */}
//                 <button
//                     onClick={closePopup}
//                     className="absolute top-3 right-3 text-gray-600 hover:text-black"
//                 >
//                     <IoMdClose size={24} />
//                 </button>

//                 {/* Title and Edit Vehicle Button in Same Line */}
//                 <div className="flex items-center justify-between mb-6">
//                     <h2 className="text-2xl font-bold text-main uppercase">
//                         {isEditMode ? "EDIT VEHICLE TO THIS CUSTOMER" : "ADD VEHICLE TO THIS CUSTOMER"}
//                     </h2>
//                     <button
//                         type="submit"
//                         form="vehicleForm"
//                         className="bg-main font-semibold text-white px-4 py-2 rounded hover:text-main hover:bg-white border border-main flex items-center justify-center min-w-[120px]"
//                         disabled={isSubmitting}
//                     >
//                         {isSubmitting ? (
//                             <>
//                                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                 </svg>
//                                 Save Vehicle
//                             </>
//                         ) : (
//                             "Save Vehicle"
//                         )}
//                     </button>
//                 </div>

//                 {/* Customer Form */}
//                 <form id="vehicleForm" onSubmit={handleSubmit(onSubmit)}>
//                     <div className="grid grid-cols-4 gap-4 mb-6">
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Car reg<span className="text-red-500">*</span></label>
//                             <input
//                                 type="text"
//                                 {...register("registration_number")}
//                                 placeholder="Car reg"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                             {errors.registration_number && (
//                                 <span className="text-red-500 text-sm">{errors.registration_number.message}</span>
//                             )}
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Year<span className="text-red-500">*</span></label>
//                             <input
//                                 type="text"
//                                 {...register("year_of_manufacture")}
//                                 placeholder="Year"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                             {errors.year_of_manufacture && (
//                                 <span className="text-red-500 text-sm">{errors.year_of_manufacture.message}</span>
//                             )}
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Fuel Type</label>
//                             <input
//                                 type="text"
//                                 {...register("fuel_type")}
//                                 placeholder="FuelType"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                             {errors.fuel_type && (
//                                 <span className="text-red-500 text-sm">{errors.fuel_type.message}</span>
//                             )}
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Tax Status</label>
//                             <input
//                                 type="text"
//                                 {...register("tax_status")}
//                                 placeholder="Tax Status"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                             {errors.tax_status && (
//                                 <span className="text-red-500 text-sm">{errors.tax_status.message}</span>
//                             )}
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Make</label>
//                             <input
//                                 type="text"
//                                 {...register("make")}
//                                 placeholder="Make"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                             {errors.make && (
//                                 <span className="text-red-500 text-sm">{errors.make.message}</span>
//                             )}
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Colour</label>
//                             <input
//                                 type="text"
//                                 {...register("colour")}
//                                 placeholder="Colour"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                             {errors.colour && (
//                                 <span className="text-red-500 text-sm">{errors.colour.message}</span>
//                             )}
//                         </div>

//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">MOT Exp</label>
//                             <input
//                                 type="date"
//                                 {...register("mot_expiry_date")}
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                             {errors.mot_expiry_date && (
//                                 <span className="text-red-500 text-sm">{errors.mot_expiry_date.message}</span>
//                             )}
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Mileage</label>
//                             <input
//                                 type="text"
//                                 {...register("mileage")}
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                             {errors.mileage && (
//                                 <span className="text-red-500 text-sm">{errors.mileage.message}</span>
//                             )}
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };


import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { vehicleSchema } from "../../commonapicall/utils/AddCustomerInfoSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { VehicleType } from "../../commonapicall/utils/AddCustomerInfoSchema";
import axios from "axios";
import { toast } from "react-toastify";

interface EditVehiclePopupProps {
    closePopup: () => void;
    onSave: (vehicle: VehicleType) => void;
    initialData: VehicleType;
    isEditMode: boolean;
}

export const EditVehiclePopup: React.FC<EditVehiclePopupProps> = ({
    closePopup,
    onSave,
    initialData,
    isEditMode
}) => {
    const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
    const [isCheckingVehicle, setIsCheckingVehicle] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
        reset
    } = useForm<VehicleType>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: initialData
    });
    const registrationNumber = watch("registration_number");

    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const checkVehicleExists = async (registration_number: string): Promise<boolean> => {
        try {
            setIsCheckingVehicle(true);
            const response = await fetch("http://217.154.63.73:8000/api/check-vehicle/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registration_number })
            });

            if (response.ok) {
                return true; // Vehicle exists
            } else if (response.status === 404) {
                return false; // Vehicle not found
            } else {
                const errorData = await response.json();
                throw new Error(errorData?.detail || `Server error: ${response.status}`);
            }
        } finally {
            setIsCheckingVehicle(false);
        }
    };




    const fetchVehicleDetails = async (regNumber: string) => {
        if (!regNumber || regNumber.trim().length < 2) return;

        setIsFetchingVehicle(true);
        setRegistrationError(null);

        try {
            const response = await axios({
                method: 'get',
                url: `https://fixamatic.com/dvlaapi_check?vehicleNumber=${regNumber.trim().toUpperCase()}`,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = response.data;

            // Handle API errors
            if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                const error = data.errors[0];
                throw {
                    response: {
                        status: parseInt(error.status),
                        data: {
                            detail: error.title || 'Bad Request'
                        }
                    }
                };
            }

            // Format dates to YYYY-MM-DD for date inputs
            const formatDate = (dateString: string | undefined) =>
                dateString ? new Date(dateString).toISOString().split('T')[0] : undefined;

            // Update form fields with API response
            setValue('tax_status', data.taxStatus || '');
            setValue('fuel_type', data.fuelType || '');
            setValue('make', data.make || '');
            setValue('year_of_manufacture', data.yearOfManufacture?.toString() || '');
            setValue('colour', data.colour || '');
            setValue('mot_expiry_date', formatDate(data.motExpiryDate) || '');

        } catch (error: unknown) {
            // Clear form fields on error
            setValue('tax_status', '');
            setValue('fuel_type', '');
            setValue('make', '');
            setValue('year_of_manufacture', '');
            setValue('colour', '');
            setValue('mot_expiry_date', '');

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const detail = error.response?.data?.detail || '';

                switch (status) {
                    case 404:
                        setRegistrationError('Vehicle registration number not found');
                        break;
                    case 400:
                        if (detail.includes('Invalid format')) {
                            setRegistrationError('Invalid registration number format');
                        } else {
                            setRegistrationError(detail || 'Bad Request');
                        }
                        break;
                    default:
                        setRegistrationError('Failed to fetch vehicle details');
                }
            } else {
                setRegistrationError('Invalid registration number');
            }
        } finally {
            setIsFetchingVehicle(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();

        // Only fetch if in edit mode and registrationNumber exists and has changed
        if (isEditMode && registrationNumber && registrationNumber !== initialData.registration_number) {
            const timeoutId = setTimeout(() => {
                fetchVehicleDetails(registrationNumber);
            }, 800);

            return () => {
                clearTimeout(timeoutId);
                controller.abort();
            };
        }

        // Return empty cleanup function if not in edit mode
        return () => { };
    }, [registrationNumber, isEditMode, initialData.registration_number]);

    const onSubmit = async (data: VehicleType) => {
        if (registrationError) return;

        try {
            // ✅ Always run the check API before saving
            const vehicleExists = await checkVehicleExists(data.registration_number);

            if (vehicleExists && !isEditMode) {
                // If adding a new vehicle and it already exists
                toast.error("This vehicle is already registered in the system");
                return;
            }

            // ✅ Continue saving (for both add & edit mode)
            await onSave(data);
            closePopup();
        } catch (error: any) {
            console.error("Error saving vehicle:", error);
            toast.error(error.message || "Error saving vehicle");
        }
    };



    return (
        <div className="fixed inset-0 bg-acash bg-opacity-40 flex items-center justify-center z-50">
            {(isFetchingVehicle || isCheckingVehicle) && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
                </div>
            )}
            <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-w-full max-h-screen overflow-auto shadow-lg relative flex flex-col">
                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    <IoMdClose size={24} />
                </button>

                {/* Title and Edit Vehicle Button in Same Line */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-main uppercase">
                        {isEditMode ? "EDIT VEHICLE TO THIS CUSTOMER" : "ADD VEHICLE TO THIS CUSTOMER"}
                    </h2>
                    <button
                        type="submit"
                        form="vehicleForm"
                        className="bg-main font-semibold text-white px-4 py-2 rounded hover:text-main hover:bg-white border border-main flex items-center justify-center min-w-[120px]"
                        disabled={isSubmitting || isCheckingVehicle}
                    >
                        {isSubmitting || isCheckingVehicle ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isCheckingVehicle ? "Checking..." : "Save Vehicle"}
                            </>
                        ) : (
                            "Save Vehicle"
                        )}
                    </button>
                </div>

                {/* Customer Form */}
                <form id="vehicleForm" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Car reg<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register("registration_number")}
                                placeholder="Car reg"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            {errors.registration_number && (
                                <span className="text-red-500 text-sm">{errors.registration_number.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Year<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register("year_of_manufacture")}
                                placeholder="Year"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            {errors.year_of_manufacture && (
                                <span className="text-red-500 text-sm">{errors.year_of_manufacture.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Fuel Type</label>
                            <input
                                type="text"
                                {...register("fuel_type")}
                                placeholder="FuelType"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            {errors.fuel_type && (
                                <span className="text-red-500 text-sm">{errors.fuel_type.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Tax Status</label>
                            <input
                                type="text"
                                {...register("tax_status")}
                                placeholder="Tax Status"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            {errors.tax_status && (
                                <span className="text-red-500 text-sm">{errors.tax_status.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Make</label>
                            <input
                                type="text"
                                {...register("make")}
                                placeholder="Make"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            {errors.make && (
                                <span className="text-red-500 text-sm">{errors.make.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Colour</label>
                            <input
                                type="text"
                                {...register("colour")}
                                placeholder="Colour"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            {errors.colour && (
                                <span className="text-red-500 text-sm">{errors.colour.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">MOT Exp</label>
                            <input
                                type="date"
                                {...register("mot_expiry_date")}
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            {errors.mot_expiry_date && (
                                <span className="text-red-500 text-sm">{errors.mot_expiry_date.message}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Mileage</label>
                            <input
                                type="text"
                                {...register("mileage")}
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            {errors.mileage && (
                                <span className="text-red-500 text-sm">{errors.mileage.message}</span>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
// import React, { useEffect, useState } from "react";
// import { IoMdClose } from "react-icons/io";
// import { vehicleSchema } from "../../commonapicall/utils/AddCustomerInfoSchema";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";

// type VehicleType = {
//     registration_number: string;
//     make?: string;
//     fuel_type?: string;
//     tax_status?: string;
//     mileage?:string;
//     year_of_manufacture: string;
//     colour?: string;
//     mot_expiry_date?: string;
// };

// interface EditVehiclePopupProps {
//     closePopup: () => void;
//     onSave: (vehicle: VehicleType) => void;
// }

// export const AddVehiclePopup: React.FC<EditVehiclePopupProps> = ({ closePopup, onSave }) => {
//     const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
//     const [registrationError, setRegistrationError] = useState<string | null>(null);

//     const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<VehicleType>({
//         resolver: zodResolver(vehicleSchema),
//     });

//     // const onSubmit = (data: VehicleType) => {
//     //     onSave(data);
//     // };

//     const registrationNumber = watch("registration_number");

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
//             setValue('mileage', formatDate(data.mileage) || '');

//         } catch (error: unknown) {
//             // Clear form fields on error
//             setValue('tax_status', '');
//             setValue('fuel_type', '');
//             setValue('make', '');
//             setValue('year_of_manufacture', '');
//             setValue('mileage', '');
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

//     useEffect(() => {
//         const controller = new AbortController();
//         const timeoutId = setTimeout(() => {
//             if (registrationNumber) {
//                 fetchVehicleDetails(registrationNumber);
//             }
//         }, 800);

//         return () => {
//             clearTimeout(timeoutId);
//             controller.abort();
//         };
//     }, [registrationNumber]);

//     const onSubmit = (data: VehicleType) => {
//         if (registrationError) {
//             return; // Prevent submission if there's an error
//         }
//         onSave(data);
//     };


//     return (
//         <div className="fixed  inset-0 bg-acash bg-opacity-40 flex items-center justify-center z-50">
//             {isFetchingVehicle && (
//                 <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//                     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//                 </div>
//             )}
//             <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-w-full max-h-screen overflow-auto shadow-lg relative flex flex-col">
//                 <button
//                     onClick={closePopup}
//                     className="absolute top-3 right-3 text-gray-600 hover:text-black"
//                 >
//                     <IoMdClose size={24} />
//                 </button>
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className="flex items-center justify-between mb-6">
//                         <h2 className="text-2xl font-bold text-main uppercase">Add Vehicle to this Customer</h2>
//                         <button
//                             type="submit"
//                             // onClick={onSubmit}
//                             className="bg-main font-semibold text-white px-4 py-2 rounded hover:text-main hover:bg-white border border-main"
//                         >
//                             Save Vehicle
//                         </button>
//                     </div>
//                     <div className="grid grid-cols-4 gap-4 mb-6">
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Car reg<span className="text-red-500">*</span></label>
//                             <input
//                                 type="text"
//                                 {...register("registration_number")}
//                                 placeholder="Car reg"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
//                             />
//                             <span className="text-red-500 text-sm">{errors.registration_number?.message}</span>
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Year<span className="text-red-500">*</span></label>
//                             <input
//                                 type="text"
//                                 {...register("year_of_manufacture")}
//                                 placeholder="Year"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                             <span className="text-red-500 text-sm">{errors.year_of_manufacture?.message}</span>
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Fuel Type</label>
//                             <input
//                                 type="text"
//                                 {...register("fuel_type")}
//                                 placeholder="FuelType"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Tax Status</label>
//                             <input
//                                 type="text"
//                                 {...register("tax_status")}
//                                 placeholder="Tax Status"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
//                             />
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Make</label>
//                             <input
//                                 type="text"
//                                 {...register("make")}
//                                 placeholder="Make"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
//                             />
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Colour</label>
//                             <input
//                                 type="text"
//                                 {...register("colour")}
//                                 placeholder="Colour"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
//                             />
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">MOT Exp</label>
//                             <input
//                                 type="date"
//                                 {...register("mot_expiry_date")}
//                                 placeholder="MOT Exp"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
//                             />
//                         </div>
//                         <div className="flex flex-col">
//                             <label className="mb-1 font-medium text-gray-700">Mileage</label>
//                             <input
//                                 type="text"
//                                 {...register("mileage")}
//                                 placeholder="mileage"
//                                 className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
//                             />
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div >
//     );
// };


import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { vehicleSchema } from "../../commonapicall/utils/AddCustomerInfoSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications

type VehicleType = {
    registration_number: string;
    make?: string;
    fuel_type?: string;
    tax_status?: string;
    mileage?:string;
    year_of_manufacture: string;
    colour?: string;
    mot_expiry_date?: string;
};

interface EditVehiclePopupProps {
    closePopup: () => void;
    onSave: (vehicle: VehicleType) => void;
}

export const AddVehiclePopup: React.FC<EditVehiclePopupProps> = ({ closePopup, onSave }) => {
    const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
    const [isCheckingVehicle] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<VehicleType>({
        resolver: zodResolver(vehicleSchema),
    });

    const registrationNumber = watch("registration_number");

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
            setValue('mileage', formatDate(data.mileage) || '');

        } catch (error: unknown) {
            // Clear form fields on error
            setValue('tax_status', '');
            setValue('fuel_type', '');
            setValue('make', '');
            setValue('year_of_manufacture', '');
            setValue('mileage', '');
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

    // Function to check if vehicle already exists
    const checkVehicleExists = async (registrationNumber: string) => {
    try {
        const response = await fetch('http://217.154.63.73:8000/api/check-vehicle/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ registration_number: registrationNumber })
        });
        
        const result = await response.json();
        
        // Return the entire response object so we can access the message
        return result;
    } catch (error) {
        console.error('Error checking vehicle:', error);
        throw error;
    }
};

    const onSubmit = async (data: VehicleType) => {
    if (registrationError) {
        return;
    }
    
    try {
        const result = await checkVehicleExists(data.registration_number);
        
        if (result.status === 'error') {
            toast.error(result.message); // This will show the backend message
            return;
        }
        
        // If no error status, proceed with saving
        onSave(data);
    } catch (error) {
        toast.error("An error occurred while checking the vehicle");
    }
};

    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            if (registrationNumber) {
                fetchVehicleDetails(registrationNumber);
            }
        }, 800);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [registrationNumber]);

    return (
        <div className="fixed inset-0 bg-acash bg-opacity-40 flex items-center justify-center z-50">
            {(isFetchingVehicle || isCheckingVehicle) && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
                </div>
            )}
            <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-w-full max-h-screen overflow-auto shadow-lg relative flex flex-col">
                <button
                    onClick={closePopup}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    <IoMdClose size={24} />
                </button>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-main uppercase">Add Vehicle to this Customer</h2>
                        <button
                            type="submit"
                            disabled={isCheckingVehicle}
                            className="bg-main font-semibold text-white px-4 py-2 rounded hover:text-main hover:bg-white border border-main disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCheckingVehicle ? "Checking..." : "Save Vehicle"}
                        </button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Car reg<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register("registration_number")}
                                placeholder="Car reg"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
                            />
                            <span className="text-red-500 text-sm">{errors.registration_number?.message}</span>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Year<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register("year_of_manufacture")}
                                placeholder="Year"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            <span className="text-red-500 text-sm">{errors.year_of_manufacture?.message}</span>
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Fuel Type</label>
                            <input
                                type="text"
                                {...register("fuel_type")}
                                placeholder="FuelType"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Tax Status</label>
                            <input
                                type="text"
                                {...register("tax_status")}
                                placeholder="Tax Status"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Make</label>
                            <input
                                type="text"
                                {...register("make")}
                                placeholder="Make"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Colour</label>
                            <input
                                type="text"
                                {...register("colour")}
                                placeholder="Colour"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">MOT Exp</label>
                            <input
                                type="date"
                                {...register("mot_expiry_date")}
                                placeholder="MOT Exp"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Mileage</label>
                            <input
                                type="text"
                                {...register("mileage")}
                                placeholder="mileage"
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
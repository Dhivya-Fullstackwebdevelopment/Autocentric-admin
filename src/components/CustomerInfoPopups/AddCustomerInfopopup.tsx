import { Header } from "../Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { AddVehiclePopup } from "../VehiclesPopups/AddVehiclesPopup";
import { customerSchema, type CustomerFormType } from "../../commonapicall/utils/AddCustomerInfoSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomerInfoNew } from "../../commonapicall/CutomerInfoapis/CutomerInfoapis";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const OS_API_KEY = 'C6hpVCnxKcvEx7XXRt3O8gxdwmt2GavF';

export const AddCustomerInfoPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [showAddVehiclePopup, setShowAddVehiclePopup] = useState(false);
    const [vehicles, setVehicles] = useState<CustomerFormType["vehicles"]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Address lookup state
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
    const [showAddressDropdown, setShowAddressDropdown] = useState(false);
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        trigger,
        getValues,
        clearErrors,
        watch,
        reset,
        setError
    } = useForm<CustomerFormType>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            vehicles: [],
        },
    });

    const watchedValues = watch();
    const postalCode = watch("postal_code") || "";

    // Fetch addresses when postal code changes
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
                toast.error("Failed to fetch addresses.Please Check Postal Code");
            } finally {
                setIsFetchingAddress(false);
            }
        };

        // Add debounce to prevent excessive API calls
        const handler = setTimeout(fetchAddresses, 500);
        return () => clearTimeout(handler);
    }, [postalCode]);

    // Close dropdown when clicking outside
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
        setValue("home_address", address, { shouldValidate: true });
        setShowAddressDropdown(false);
    };

    const formatDate = (value?: string) => {
        return value ? new Date(value).toISOString().split("T")[0] : null;
    };

    // const onSubmit = async (data: CustomerFormType) => {

    //     if (vehicles.length === 0) {
    //         setError("vehicles", {
    //             type: "manual",
    //             message: "Please add at least one vehicle before saving."
    //         });
    //         return;
    //     }

    //     setIsSubmitting(true); // Show loading spinner

    //     try {
    //         const payload = {
    //             email: data.email,
    //             full_name: data.full_name,
    //             phone_number: data.phone_number,
    //             home_address: data.home_address,
    //             date: formatDate(data.date) ?? undefined,
    //             postal_code: data.postal_code,
    //             remarks:data.remarks,
    //             vehicles: vehicles.map(v => ({
    //                 registration_number: v.registration_number ?? "",
    //                 make: v.make ?? undefined,
    //                 fuel_type: v.fuel_type ?? undefined,
    //                 tax_status: v.tax_status ?? undefined,
    //                 year_of_manufacture: v.year_of_manufacture?.toString(),
    //                 colour: v.colour ?? undefined,
    //                 mileage: v.mileage ?? undefined,
    //                 mot_expiry_date: formatDate(v.mot_expiry_date) ?? undefined,
    //             })),
    //         };

    //         const response = await createCustomerInfoNew(payload);

    //         if (response) {
    //             localStorage.removeItem("customerVehicles");
    //             navigate("/CustomerInfo");
    //         }
    //     } catch (error) {
    //         console.error("API Error:", error);
    //     } finally {
    //         setIsSubmitting(false); // Hide spinner
    //     }
    // };
    // const onSubmit = async (data: CustomerFormType) => {
    //     if (vehicles.length === 0) {
    //         setError("vehicles", {
    //             type: "manual",
    //             message: "Please add at least one vehicle before saving."
    //         });
    //         return;
    //     }

    //     setIsSubmitting(true);

    //     try {
    //         // Prepare payload exactly matching API expectations
    //        const payload = {
    //             email: data.email,
    //             full_name: data.full_name,
    //             phone_number: data.phone_number,
    //             home_address: data.home_address,
    //             date: formatDate(data.date) ?? undefined,
    //             postal_code: data.postal_code,
    //             remarks:data.remarks,
    //             vehicles: vehicles.map(v => ({
    //                 registration_number: v.registration_number ?? "",
    //                 make: v.make ?? undefined,
    //                 fuel_type: v.fuel_type ?? undefined,
    //                 tax_status: v.tax_status ?? undefined,
    //                 year_of_manufacture: v.year_of_manufacture?.toString(),
    //                 colour: v.colour ?? undefined,
    //                 mileage: v.mileage ?? undefined,
    //                 mot_expiry_date: formatDate(v.mot_expiry_date) ?? undefined,
    //             })),
    //         };

    //         console.log("Submitting payload:", payload); // Debug log

    //         const response = await createCustomerInfoNew(payload);

    //         if (response) {
    //             localStorage.removeItem("customerVehicles");
    //             toast.success("Customer saved successfully!");
    //             navigate("/CustomerInfo");
    //         }
    //     } catch (error: any) {
    //         console.error("API Error:", error);

    //         let errorMessage = "An unexpected error occurred. Please try again.";
    //         let duplicateVehicleMessage = "Vehicle with this registration number already exists";

    //         // Parse different error response formats
    //         if (error.response?.data) {
    //             const apiError = error.response.data;

    //             // Handle standard API error format
    //             if (apiError.status === "error") {
    //                 if (Array.isArray(apiError.data) && apiError.data.length > 0) {
    //                     errorMessage = apiError.data[0];

    //                     // Extract duplicate vehicle info if exists
    //                     if (errorMessage.includes("already exists")) {
    //                         const regMatch = errorMessage.match(/'([^']+)'/);
    //                         if (regMatch && regMatch[1]) {
    //                             duplicateVehicleMessage = `Vehicle ${regMatch[1]} already exists in system.`;
    //                         }
    //                     }
    //                 } else if (apiError.message) {
    //                     errorMessage = apiError.message;
    //                 }
    //             }
    //             // Handle alternative error formats
    //             else if (Array.isArray(apiError)) {
    //                 errorMessage = apiError.join(", ");
    //             }
    //             else if (apiError.error) {
    //                 errorMessage = apiError.error;
    //             }
    //         } else if (error.message) {
    //             errorMessage = error.message;
    //         }

    //         // Display main error
    //         toast.error(errorMessage, {
    //             position: "top-center",
    //             autoClose: 8000,
    //             className: "bg-red-50 text-red-800 font-medium border-l-4 border-red-500",
    //             progressClassName: "bg-red-500"
    //         });

    //         // Display additional info about duplicate vehicle if found
    //         if (duplicateVehicleMessage) {
    //             toast.info(duplicateVehicleMessage, {
    //                 position: "top-center",
    //                 autoClose: 10000,
    //                 className: "bg-blue-50 text-blue-800 font-medium border-l-4 border-blue-500"
    //             });
    //         }
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };
    const onSubmit = async (data: CustomerFormType) => {
        if (vehicles.length === 0) {
            setError("vehicles", {
                type: "manual",
                message: "Please add at least one vehicle before saving."
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare payload exactly matching API expectations
            const payload = {
                email: data.email,
                full_name: data.full_name,
                phone_number: data.phone_number,
                home_address: data.home_address,
                date: formatDate(data.date) ?? undefined,
                postal_code: data.postal_code,
                remarks: data.remarks,
                vehicles: vehicles.map(v => ({
                    registration_number: v.registration_number ?? "",
                    make: v.make ?? undefined,
                    fuel_type: v.fuel_type ?? undefined,
                    tax_status: v.tax_status ?? undefined,
                    year_of_manufacture: v.year_of_manufacture?.toString(),
                    colour: v.colour ?? undefined,
                    mileage: v.mileage ?? undefined,
                    mot_expiry_date: formatDate(v.mot_expiry_date) ?? undefined,
                })),
            };

            console.log("Submitting payload:", payload);

            const response = await createCustomerInfoNew(payload);

            if (response) {
                localStorage.removeItem("customerVehicles");
                toast.success("Customer saved successfully!");
                navigate("/CustomerInfo");
            }
        } catch (error: any) {
            console.error("API Error:", error);

            let errorMessage = "An unexpected error occurred. Please try again.";

            const apiError = error?.response?.data;

            if (apiError) {
                if (
                    apiError.status === "error" &&
                    Array.isArray(apiError.data) &&
                    apiError.data.length > 0
                ) {
                    // Show the exact backend detail
                    errorMessage = apiError.data[0];
                } else if (Array.isArray(apiError)) {
                    errorMessage = apiError.join(", ");
                } else if (apiError.error) {
                    errorMessage = apiError.error;
                } else if (apiError.message) {
                    errorMessage = apiError.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 8000,
                className: "bg-red-50 text-red-800 font-medium border-l-4 border-red-500",
                progressClassName: "bg-red-500"
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };


    const handleAddVehicle = async (vehicle: CustomerFormType["vehicles"][0]) => {
        const valid = await trigger([
            "full_name",
            "home_address",
            "phone_number",
            "postal_code",
            "email",
            "date",
        ]);

        if (!valid) {
            toast.error("Please fill out the customer form correctly first.");
            return;
        }

        const updatedVehicles = [...vehicles, vehicle];
        setVehicles(updatedVehicles);
        setValue("vehicles", updatedVehicles);
        localStorage.setItem("customerVehicles", JSON.stringify({
            ...getValues(),
            vehicles: updatedVehicles
        }));
        setShowAddVehiclePopup(false);
    };

    // ✅ Clear form and localStorage on initial load
    useEffect(() => {
        if (location.pathname === "/CustomerInfo/AddCustomerinfo") {
            localStorage.removeItem("customerVehicles");
            reset({
                full_name: "",
                home_address: "",
                phone_number: "",
                postal_code: "",
                email: "",
                date: "",
                vehicles: [],
            });
            setVehicles([]);
        }
    }, [location.pathname]);

    useEffect(() => {
        const dataToSave = {
            ...getValues(),
            vehicles,
        };
        localStorage.setItem("customerVehicles", JSON.stringify(dataToSave));
    }, [vehicles, watchedValues]);

    useEffect(() => {
        return () => {
            if (location.pathname !== "/CustomerInfo/AddCustomerinfo") {
                localStorage.removeItem("customerVehicles");
            }
        };
    }, [location]);

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
            toast.error("Please fill all required customer fields first.");
        }
    };

    const handleCancel = () => {
        localStorage.removeItem("customerVehicles");
        navigate("/CustomerInfo");
    };


    return (
        <div className="min-h-screen bg-[#F3F4F6] pb-3">
            <Header />
            <div className="bg-white px-20 py-10 rounded-2xl w-[70%]  max-w-full max-h-full shadow-lg relative flex flex-col mx-auto mb-10 mt-10">
                {isFetchingAddress && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
                    </div>
                )}

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-main uppercase">Add New Customer</h2>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Full Name<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register("full_name")}
                                placeholder="Full Name"
                                onChange={(e) => {
                                    setValue("full_name", e.target.value);
                                    clearErrors("full_name");
                                }}
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            <span className="text-red-500 text-sm">{errors.full_name?.message}</span>
                        </div>

                        <div className="flex flex-col relative">
                            <label className="mb-1 font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                {...register("home_address")}
                                placeholder="Address"
                                ref={addressInputRef}
                                value={watch("home_address") || ""}
                                //onClick={() => postalCode?.length >= 3 && setShowAddressDropdown(true)}
                                onChange={(e) => {
                                    setValue("home_address", e.target.value);
                                    clearErrors("home_address");
                                }}
                                onFocus={() => {
                                    if (postalCode?.length >= 3 && addressSuggestions.length > 0) {
                                        setShowAddressDropdown(true);
                                    }
                                }}
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none cursor-pointer"
                                readOnly
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
                            <span className="text-red-500 text-sm">{errors.home_address?.message}</span>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Phone<span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register("phone_number")}
                                placeholder="Phone"
                                onChange={(e) => {
                                    setValue("phone_number", e.target.value);
                                    clearErrors("phone_number");
                                }}
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            <span className="text-red-500 text-sm">{errors.phone_number?.message}</span>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Post Code</label>
                            <input
                                type="text"
                                {...register("postal_code")}
                                placeholder="Post code"
                                onChange={(e) => {
                                    setValue("postal_code", e.target.value);
                                    clearErrors("postal_code");
                                    // Trigger address lookup immediately when postal code changes
                                    if (e.target.value.length >= 3) {
                                        setShowAddressDropdown(true);
                                    } else {
                                        setShowAddressDropdown(false);
                                        setAddressSuggestions([]);
                                    }
                                }}
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            {isFetchingAddress && (
                                <div className="absolute right-3 mt-3">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-main"></div>
                                </div>
                            )}
                            <span className="text-red-500 text-sm">{errors.postal_code?.message}</span>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Email<span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="Email"
                                onChange={(e) => {
                                    setValue("email", e.target.value);
                                    clearErrors("email");
                                }}
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            <span className="text-red-500 text-sm">{errors.email?.message}</span>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1 font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                {...register("date")}
                                onChange={(e) => {
                                    setValue("date", e.target.value);
                                    clearErrors("date");
                                }}
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            <span className="text-red-500 text-sm">{errors.date?.message}</span>
                        </div>
                        
                    </div>
                    <div className="flex flex-col mb-4 ">
                            <label className="mb-1  font-medium text-gray-700">Remarks</label>
                            <textarea
                                // type="text"
                                {...register("remarks")}
                                placeholder="Remarks"
                                onChange={(e) => {
                                    setValue("remarks", e.target.value);
                                    clearErrors("remarks");
                                }}
                                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                            />
                            <span className="text-red-500 text-sm">{errors.remarks?.message}</span>
                        </div>


                    <div className="flex justify-end mb-6">
                        <button
                            type="button"
                            onClick={handleAddVehicleClick}
                            className="bg-main border font-semibold hover:text-main hover:bg-white hover:border-main text-white px-7 py-3 rounded"
                            disabled={isSubmitting}
                        >
                            Add Vehicle
                        </button>
                    </div>
                </form>

                <h2 className="text-2xl font-bold text-main mb-3 uppercase">Add Vehicle to this Customer</h2>
                {errors.vehicles?.message && (
                    <p className="text-red-500 text-base mb-2">{errors.vehicles.message}</p>
                )}

                <div className="flex-1 bg-white rounded mb-6 space-y-4">
                    <div className="grid grid-cols-8 bg-main text-white text-sm font-semibold px-4 py-3 rounded">
                        <div>Car reg</div>
                        <div>Make</div>
                        <div>Year</div>
                        <div>Colour</div>
                        <div>Fuel Type</div>
                        <div>MOT Exp</div>
                        <div>Tax Status</div>
                        <div>Mileage</div>
                    </div>

                    {vehicles.length > 0 ? (
                        vehicles.map((v, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-8 bg-aclightash text-sm text-black px-4 py-4 rounded shadow"
                            >
                                <div>{v.registration_number || "N/A"}</div>
                                <div>{v.make || "N/A"}</div>
                                <div>{v.year_of_manufacture || "N/A"}</div>
                                <div>{v.colour || "N/A"}</div>
                                <div>{v.fuel_type || "N/A"}</div>
                                <div>{v.mot_expiry_date || "N/A"}</div>
                                <div>{v.tax_status || "N/A"}</div>
                                <div>{v.mileage || "N/A"}</div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-4 text-gray-500">No vehicles added yet</div>
                    )}
                </div>

                {/* <div className="flex justify-end gap-4">
                    <button
                        className={`bg-main text-white px-5 py-2 rounded font-bold hover:bg-white hover:text-main border hover:border-main ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save Customer"}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-100 text-black px-5 py-2 rounded hover:bg-gray-200"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                </div> */}

                <div className="flex justify-end gap-4">
                    <button
                        className={`bg-main text-white px-5 py-2 rounded font-bold hover:bg-white hover:text-main border hover:border-main ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        Save Customer
                    </button>
                    <button
                        onClick={handleCancel}
                        className="bg-gray-100 text-black px-5 py-2 rounded hover:bg-gray-200"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    {isSubmitting && (
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
                        </div>
                    )}
                </div>


                {showAddVehiclePopup && (
                    <AddVehiclePopup
                        closePopup={() => setShowAddVehiclePopup(false)}
                        onSave={handleAddVehicle}
                    />
                )}
            </div>
        </div>
    );
};



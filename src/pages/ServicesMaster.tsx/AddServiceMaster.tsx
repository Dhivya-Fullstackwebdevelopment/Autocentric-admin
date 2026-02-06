// AddCustomerPage.tsx
import type React from "react";
import { InputField } from "../../common/InputField";
import { Header } from "../../components/Header";
import 'react-phone-input-2/lib/style.css';
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createServiceMaster } from "../../commonapicall/ServiceMasterapis.tsx/ServiceMasterapis";
import { useForm } from "react-hook-form";
import { useState } from "react";

export interface serviceMaster {
    service_name: string;
    price: string | any
}

export const serviceMasterSchema = z.object({
    service_name: z.string().nonempty("service master is required"),
    // price:z.string().nonempty("Price is required")
    price: z.string(),
})

type serviceMasterFormData = z.infer<typeof serviceMasterSchema>

export const AddServicemasterPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<serviceMasterFormData>({
        resolver: zodResolver(serviceMasterSchema)
    });

    const onSubmit = async (data: serviceMaster) => {
        setIsLoading(true);
        try {
           
            const submissionData = {
                ...data,
                price: data.price === "" ? "0" : data.price
            };
            
            const result = await createServiceMaster(submissionData);
            if (result.status === 'success') {
                navigate('/ServiceMaster');
            } else {
                console.error('Server error:', result.message);
            }
        } catch (error) {
            console.error('Submission failed:', error);
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
            <form className="bg-white mt-6 p-6 rounded-md shadow-md max-w-6xl mx-auto"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4  border-acgrey pb-2">
                        <h2 className="text-2xl font-bold text-main  uppercase">Add Services Master</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/ServiceMaster")}
                                className="px-6 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200">
                                Back
                            </button>
                            <button className="px-6 py-2 bg-main text-white font-semibold rounded hover:bg-white border-1 hover:border-main hover:text-main "
                                type="submit"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block  font-medium text-gray-700">
                                Services <span className="text-red-500">*</span>
                            </label>
                            <InputField
                                type="text"
                                placeholder="Services"
                                // className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                                className="border border-aclightash  w-full px-3 py-3 rounded bg-aclightash focus:outline-none "
                                {...register("service_name")}
                                label={""}
                            />
                            {errors.service_name && <p className="text-red-500">{errors.service_name.message}</p>}
                        </div>

                        <div>
                            <label className="block font-medium text-gray-700">
                                Price
                            </label>
                            <InputField
                                type="text"
                                placeholder="Price"
                                className="border border-aclightash  w-full px-3 py-3 rounded bg-aclightash focus:outline-none "
                                defaultValue="0" 
                                {...register("price")}
                                label={""}
                            />
                            {errors.price && <p className="text-red-500">{errors.price.message}</p>}
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
};




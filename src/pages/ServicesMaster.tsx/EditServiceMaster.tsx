// AddCustomerPage.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "../../common/InputField";
import { Header } from "../../components/Header";
import 'react-phone-input-2/lib/style.css';
import { useNavigate, useParams } from "react-router-dom";
import{z} from "zod"
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { apiAxios } from "../../commonapicall/api/apiUrl";
const serviceSchema = z.object({
service_name:z.string().nonempty("Service name is required"),
price:z.string().optional()
})

type serviceFormData = z.infer<typeof serviceSchema>

export const EditServicemasterPage = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const {register,setValue,handleSubmit,formState:{errors}}=useForm<serviceFormData>({
        resolver:zodResolver(serviceSchema)
    })


    useEffect(()=>{
     if(id){
        const fetchServiceMaster =async()=>{
            try {
                const response = await apiAxios.get(`/api/services/${id}/`)
                const serviceData = response.data.data;
                setValue("service_name",serviceData.service_name)
                setValue("price", serviceData.price ?? "");

              
            } catch (error) {
                 console.error("Error fetching service data:", error);
            }
        }

         fetchServiceMaster();
     }

    
    },[id,setValue])


    const onSubmit = async (data: serviceFormData) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('service_name', data.service_name);
            formData.append("price", data.price ?? "");

            await apiAxios.patch(`/api/services/update/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate("/ServiceMaster");
        } catch (error) {
            console.error("Error updating service:", error);
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
                    <div className="flex items-center justify-between mb-4 border-b-2 border-acgrey pb-2">
                        <h2 className="text-2xl font-bold">Edit Services Master</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => navigate("/ServiceMaster")}
                                className="px-6 py-2 cursor-pointer bg-white text-black rounded font-semibold hover:bg-gray-200">
                                Back
                            </button>
                            <button className="px-6 py-2 cursor-pointer bg-main text-white font-semibold rounded hover:bg-white border-1 hover:border-main hover:text-main "
                            type="submit"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Services <span className="text-red-500">*</span>
                            </label>
                            <InputField
                                type="text"
                                className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                                label={""}
                                {...register("service_name")}
                            />
                            {errors.service_name&&<p className="text-red-500">{errors.service_name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Price
                            </label>
                            <InputField
                                type="text"
                                className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                                label={""}
                                {...register("price")}
                            />
                            {errors.price&&<p className="text-red-500">{errors.price.message}</p>}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

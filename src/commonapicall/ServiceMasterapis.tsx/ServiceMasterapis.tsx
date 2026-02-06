import type { serviceMaster } from '../../pages/ServicesMaster.tsx/AddServiceMaster';
import type { ServiceResponse } from '../../pages/ServicesMaster.tsx/ServiceMasterTable';
import { apiAxios } from '../api/apiUrl';

//Get Customer Info
export const fetchServiceMaster = async (page: number,search: string | undefined,PageSize: string):Promise<ServiceResponse> => {
  try {
    const response = await apiAxios.get(`/api/services/?page=${page}&search=${search}&page_size=${PageSize}`);

    if(response.data.results.status === "success"){
       return response.data as ServiceResponse;     
            }else{
                throw new Error(response.data.message ||"Failed to fetch services")
            }
  } catch (error: any) {
    console.error("Error fetching ServiceMaster:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to fetch ServiceMaster. Please try again later.");
  }
};



//// service master onsubmit api call




export const createServiceMaster = async (data: serviceMaster) => {
  const formData = new FormData();
  formData.append('service_name', data.service_name);
  formData.append('price', data.price);
 
  try {
    const response = await apiAxios.post(
      '/api/services/create/',
      formData
    );
    return response.data; 
  } catch (error) {
    console.error('API error while creating Service master:', error);
    throw error;
  }
};




////// service master delete api 



export const DeleteServiceMasterList = async (id: number) => {
  try {
    const response = await apiAxios.delete(`/api/services/delete/${id}/`);
    if (response.status !== 200 || response.data.status !== 'success') {
      throw new Error("Failed to delete services");
    }
    console.log("services deleted:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error deleting services:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to delete services. Please try again later.");
  }
};
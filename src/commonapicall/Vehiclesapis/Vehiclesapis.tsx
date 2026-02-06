import type { VehicleFormInput } from "../../pages/Vehicles/AddVehicleForm";
import type {  VehicleApiResponse } from "../../pages/Vehicles/VehiclesTable";
import { apiAxios } from "../api/apiUrl";




/// ///////////////////////////// vehicles Table List //////////////////////////////////

export const getVehicleList =async( page: number,search: string | undefined,PageSize: string): Promise<VehicleApiResponse>=>{

    try {
        const response = await apiAxios.get(`/api/vehicles/?page=${page}&search=${search}&page_size=${PageSize}`)
       
        if(response.data.results.status === "success"){
            return response.data as VehicleApiResponse;
        }else{
            throw new Error(response.data.message ||"Failed to fetch Vehicle")
        }
    } catch (error) {
      
          console.error('Error fetching vehicles:', error);
    throw error;
    }

}


/// onsubmit vehicle addform api call


export const createVehicle = async (data: VehicleFormInput) => {
  const formData = new FormData();
  
  // Required fields
  formData.append('customer_name', data.customer_name);
  formData.append('registration_number', data.registration_number);

  // Optional fields - more concise approach
  const optionalFields = [
    'engine_capacity',
    'make',
    'type_approval',
    'wheel_plan',
    'colour',
    'tax_status',
    'mileage',
    'tax_due_date',
    'mot_status',
    'co2_emissions',
    'year_of_manufacture',
    'fuel_type',
    'marked_for_export',
    'date_of_last_v5_issued',
    'revenue_weight',
    'mot_expiry_date',
    'month_of_first_registration'
  ] as const;

  optionalFields.forEach(field => {
    const value = data[field];
    if (value != null) {
      formData.append(field, String(value));
    }
  });

  try {
    const response = await apiAxios.post('/api/vehicles/create/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('API error while creating vehicle:', error);
    throw error;
  }
};

//////////////////// Delete Vehicle 

// Delete CustomerInfo
export const DeleteVehicleList = async (id: number) => {
  try {
    const response = await apiAxios.delete(`/api/vehicles/delete/${id}/`);
    if (response.status !== 200 || response.data.status !== 'success') {
      throw new Error("Failed to delete vehicles");
    }
    console.log("vehicles deleted:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error deleting vehicles:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to delete vehicles. Please try again later.");
  }
};
import type { AppointmentsResponse } from "../../pages/ServiceDetails/ServiceDetailsTable";
import { apiAxios } from "../api/apiUrl";

// export const ServiceDetails = async () => {
//     try {
//         const response = await apiAxios.get('/api/service-details/');
//         if (response.status !== 200 || response.data.status !== 'success') {
//             throw new Error("Failed to fetch ServiceDetails");
//         }
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// }


export const ServiceDetails = async (page: number,search: string | undefined,PageSize: string):Promise<AppointmentsResponse> => {
    try {
        const response = await apiAxios.get(`/api/service-details/?page=${page}&search=${search}&page_size=${PageSize}`);
        
        // Check response structure
        if (response.status !== 200 || response.data?.results?.status !== 'success') {
            throw new Error(response.data?.results?.message || "Failed to fetch service details");
        }

        console.log("Service details API response", response.data.results.data);
        
        // Return the data array from results
        return response.data as AppointmentsResponse;
        
    } catch (error: unknown) {
        console.error('Error fetching service details:', error);
        throw new Error(
            error instanceof Error && error.message ||
            (error as {response?: {data?: {results?: {message?: string}}}})?.response?.data?.results?.message ||
            "Unable to fetch service details. Please try again later."
        );
    }
}

export const createServiceDetails = async (data: {
    booking: number;
    car: number;
    customer_name: string;
    service_ids: string;
    image1: File;
    image2: File;
    image3: File;
    image4: File;
    vat_amount: number;
    total_payable: number;
  }) => {
    const formData = new FormData();
    formData.append('booking', data.booking.toString());
    formData.append('car', data.car.toString());
    formData.append('customer_name', data.customer_name);
    formData.append('service', data.service_ids);
    formData.append('image1', data.image1, data.image1.name);
    formData.append('image2', data.image2, data.image2.name);
    formData.append('image3', data.image3, data.image3.name);
    formData.append('image4', data.image4, data.image4.name);
    formData.append('vat_amount', data.vat_amount.toFixed(2));
    formData.append('total_payable', data.total_payable.toFixed(2));
  
    try {
      const response = await apiAxios.post(
        '/api/service-details/create/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('API error while creating Service details:', error);
      throw error;
    }
  };

  export const updateServiceDetails = async (data: {
    id: number;
    booking: number;
    car: number;
    customer_name: string;
    service: string;
    images?: File[];
    vat_amount: number;
    total_payable: number;
  }) => {
    const formData = new FormData();
    formData.append('booking', data.booking.toString());
    formData.append('car', data.car.toString());
    formData.append('customer_name', data.customer_name);
    formData.append('service', data.service);
    formData.append('vat_amount', data.vat_amount.toFixed(2));
    formData.append('total_payable', data.total_payable.toFixed(2));
    // Append images if they exist
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });
    }

    try {
      const response = await apiAxios.put(
        `/api/service-details/update/${data.id}/`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error('API error while updating Service details:', error);
      throw error;
    }
  };

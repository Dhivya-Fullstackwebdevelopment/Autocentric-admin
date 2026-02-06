// import type {  CustomersResponse } from '../../pages/CustomerInfo/CustomerInfoTable';
// import { apiAxios } from '../api/apiUrl';

// //Get Customer Info
// export const fetchCustomerInfo = async ( page: number,search: string | undefined,PageSize: string):Promise<CustomersResponse> => {
//   try {
//     const response = await apiAxios.get(`/api/customer/?page=${page}&search=${search}&page_size=${PageSize}`);
//     if (response.status !== 200 || response.data.results.status !== 'success') {
//       throw new Error(response.data.results.message || "Failed to fetch CustomerInfo");
//     }
//     console.log("CustomerInfo API response", response.data.results.data);
//     return response.data as CustomersResponse; // Access data through results.data
//   } catch (error: any) {
//     console.error("Error fetching CustomerInfo:", error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.results?.message || "Unable to fetch CustomerInfo. Please try again later.");
//   }
// };

// //Edit CustomerInfo
// export const createCustomerInfo = async (formData: {
//   Email: string;
//   FirstName: string;
//   LastName: string;
//   PhoneNumber: string;
//   HomeAddress: string;
// }) => {
//   try {
//     const data = new FormData();
//     data.append('email', formData.Email);
//     data.append('first_name', formData.FirstName);
//     data.append('last_name', formData.LastName);
//     data.append('phone_number', formData.PhoneNumber);
//     data.append('home_address', formData.HomeAddress);
//     const response = await apiAxios.post('/api/customer/create/', data);
//     if (response.status !== 201 || response.data.status !== 'success') {
//       throw new Error("Failed to create customer");
//     }
//     console.log("Customer created:", response.data.data);
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Error creating customer:", error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || "Unable to create customer. Please try again later.");
//   }
// };


// //Edit CustomerInfo
// export const EditCustomerInfo = async (formData: {
//   id: number;
//   Email: string;
//   FirstName: string;
//   LastName: string;
//   PhoneNumber: string;
//   HomeAddress: string;
//   Date: string;
// }) => {
//   try {
//     const data = new FormData();
//     data.append('email', formData.Email);
//     data.append('first_name', formData.FirstName);
//     data.append('last_name', formData.LastName);
//     data.append('phone_number', formData.PhoneNumber);
//     data.append('home_address', formData.HomeAddress);
//     data.append('date', formData.Date);
//     const response = await apiAxios.patch(`/api/customer/update/${formData.id}/`, data);
//     if (response.status !== 200 || response.data.status !== 'success') {
//       throw new Error("Failed to create customer");
//     }
//     console.log("Customer created:", response.data.data);
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Error creating customer:", error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || "Unable to create customer. Please try again later.");
//   }
// };

// // Delete CustomerInfo
// export const DeleteCustomerInfo = async (id: number) => {
//   try {
//     const response = await apiAxios.delete(`/api/customer/delete/${id}/`);
//     if (response.status !== 200 || response.data.status !== 'success') {
//       throw new Error("Failed to delete customer");
//     }
//     console.log("Customer deleted:", response.data.data);
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Error deleting customer:", error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || "Unable to delete customer. Please try again later.");
//   }
// };



// import type {  CustomersResponse } from '../../pages/CustomerInfo/CustomerInfoTable';
// import { apiAxios } from '../api/apiUrl';

// //Get Customer Info
// export const fetchCustomerInfo = async ( page: number,search: string | undefined,PageSize: string):Promise<CustomersResponse> => {
//   try {
//     const response = await apiAxios.get(`/api/customer/?page=${page}&search=${search}&page_size=${PageSize}`);
//     if (response.status !== 200 || response.data.results.status !== 'success') {
//       throw new Error(response.data.results.message || "Failed to fetch CustomerInfo");
//     }
//     console.log("CustomerInfo API response", response.data.results.data);
//     return response.data as CustomersResponse; // Access data through results.data
//   } catch (error: any) {
//     console.error("Error fetching CustomerInfo:", error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.results?.message || "Unable to fetch CustomerInfo. Please try again later.");
//   }
// };

// //Edit CustomerInfo
// export const createCustomerInfo = async (formData: {
//   Email: string;
//   FirstName: string;
//   LastName: string;
//   PhoneNumber: string;
//   HomeAddress: string;
// }) => {
//   try {
//     const data = new FormData();
//     data.append('email', formData.Email);
//     data.append('first_name', formData.FirstName);
//     data.append('last_name', formData.LastName);
//     data.append('phone_number', formData.PhoneNumber);
//     data.append('home_address', formData.HomeAddress);
//     const response = await apiAxios.post('/api/customer/create/', data);
//     if (response.status !== 201 || response.data.status !== 'success') {
//       throw new Error("Failed to create customer");
//     }
//     console.log("Customer created:", response.data.data);
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Error creating customer:", error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || "Unable to create customer. Please try again later.");
//   }
// };


// //Edit CustomerInfo
// export const EditCustomerInfo = async (formData: {
//   id: number;
//   Email: string;
//   FirstName: string;
//   LastName: string;
//   PhoneNumber: string;
//   HomeAddress: string;
//   Date: string | undefined;
// }) => {
//   try {
//     const data = new FormData();
//     data.append('email', formData.Email);
//     data.append('first_name', formData.FirstName);
//     data.append('last_name', formData.LastName);
//     data.append('phone_number', formData.PhoneNumber);
//     data.append('home_address', formData.HomeAddress);
//     data.append('date', formData.Date ?? '');
//     const response = await apiAxios.patch(`/api/customer/update/${formData.id}/`, data);
//     if (response.status !== 200 || response.data.status !== 'success') {
//       throw new Error("Failed to create customer");
//     }
//     console.log("Customer created:", response.data.data);
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Error creating customer:", error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || "Unable to create customer. Please try again later.");
//   }
// };

// // Delete CustomerInfo
// export const DeleteCustomerInfo = async (id: number) => {
//   try {
//     const response = await apiAxios.delete(`/api/customer/delete/${id}/`);
//     if (response.status !== 200 || response.data.status !== 'success') {
//       throw new Error("Failed to delete customer");
//     }
//     console.log("Customer deleted:", response.data.data);
//     return response.data.data;
//   } catch (error: any) {
//     console.error("Error deleting customer:", error.response?.data?.message || error.message);
//     throw new Error(error.response?.data?.message || "Unable to delete customer. Please try again later.");
//   }
// };





import type { CustomersResponse } from '../../pages/CustomerInfo/CustomerInfoTable';
import { apiAxios } from '../api/apiUrl';

//Get Customer Info
export const fetchCustomerInfo = async (page: number, search: string | undefined, PageSize: string): Promise<CustomersResponse> => {
  try {
    const response = await apiAxios.get(`/api/customer/?page=${page}&search=${search}&page_size=${PageSize}`);
    if (response.status !== 200 || response.data.results.status !== 'success') {
      throw new Error(response.data.results.message || "Failed to fetch CustomerInfo");
    }
    console.log("CustomerInfo API response", response.data.results.data);
    return response.data as CustomersResponse; // Access data through results.data
  } catch (error: any) {
    console.error("Error fetching CustomerInfo:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.results?.message || "Unable to fetch CustomerInfo. Please try again later.");
  }
};

//Create CustomerInfo
export const createCustomerInfo = async (formData: {
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  HomeAddress: string;
  Date: string, // Add this line
  postalCode: string,
}) => {
  try {
    const data = new FormData();
    data.append('email', formData.Email);
    data.append('first_name', formData.FirstName);
    data.append('last_name', formData.LastName);
    data.append('phone_number', formData.PhoneNumber);
    data.append('home_address', formData.HomeAddress);
    data.append('date', String(formData.Date));
    data.append('postal_code', formData.postalCode);

    const response = await apiAxios.post('/api/customer/create/', data);
    if (response.status !== 201 || response.data.status !== 'success') {
      throw new Error("Failed to create customer");
    }
    console.log("Customer created:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating customer:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to create customer. Please try again later.");
  }
};

//Edit CustomerInfo
export const EditCustomerInfo = async (formData: {
  id: number;
  Email: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  HomeAddress: string;
  Date: string | undefined;
}) => {
  try {
    const data = new FormData();
    data.append('email', formData.Email);
    data.append('first_name', formData.FirstName);
    data.append('last_name', formData.LastName);
    data.append('phone_number', formData.PhoneNumber);
    data.append('home_address', formData.HomeAddress);
    data.append('date', formData.Date ?? '');
    const response = await apiAxios.patch(`/api/customer/update/${formData.id}/`, data);
    if (response.status !== 200 || response.data.status !== 'success') {
      throw new Error("Failed to create customer");
    }
    console.log("Customer created:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error creating customer:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to create customer. Please try again later.");
  }
};

// Delete CustomerInfo
export const DeleteCustomerInfo = async (id: number) => {
  try {
    const response = await apiAxios.delete(`/api/customer/delete/${id}/`);
    if (response.status !== 200 || response.data.status !== 'success') {
      throw new Error("Failed to delete customer");
    }
    console.log("Customer deleted:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error("Error deleting customer:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Unable to delete customer. Please try again later.");
  }
};


export const createCustomerInfoNew = async (formData: {
  email: string;
  full_name: string;
  phone_number: string;
  home_address: string | any;
  date?: string | null |undefined;
  postal_code: string | any;
  remarks: string | any;
  vehicles: {
    registration_number: string;
    make?: string;
    fuel_type?: string;
    tax_status?: string;
    year_of_manufacture?: string;
    colour?: string;
    mot_expiry_date?: string;
    mileage?: string;
  }[];
}) => {
  try {
    const response = await apiAxios.post(
      "/api/customer/create/",
      formData, // pass JSON directly
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201 || response.data.status !== "success") {
      throw new Error("Failed to create customer");
    }

    console.log("Customer created:", response.data.data);
    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error creating customer:",
      error.response?.data?.message || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        "Unable to create customer. Please try again later."
    );
  }
};
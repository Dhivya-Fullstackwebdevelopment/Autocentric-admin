import React, { useEffect, useState } from 'react'
import { Header } from '../../components/Header'
import { InputField } from '../../common/InputField'
import { useNavigate, useParams } from 'react-router-dom'
import { AxiosError } from 'axios';
import axios from 'axios';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { apiAxios } from '../../commonapicall/api/apiUrl';
 
export interface VehicleData {
  id: number;
  customer_name: string;
  registration_number: string;
  tax_status: string | null;
  tax_due_date: string | null;
  mot_status: string | null;
  make: string | null;
  co2_emissions: string | null;
  engine_capacity: string | null;
  wheel_plan: string | null;
  year_of_manufacture: string | null;
  fuel_type: string | null;
  marked_for_export: string | null;
  colour: string | null;
  type_approval: string | null;
  date_of_last_v5_issued: string | null;
  revenue_weight: string | null;
  mot_expiry_date: string | null;
  month_of_first_registration: string | null;
  is_deleted: boolean;
}




export interface VehicleResponse {
  status: string;
  message: string;
  data: VehicleData;
}


type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  home_address: string;
  date: string;
  is_deleted: boolean;
};


// Improved Zod schema with proper validation
export const EditVehicleSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  registration_number: z.string().min(2, "Registration number is required"),
  tax_status: z.string().nullable().optional(),
  tax_due_date: z.string().nullable().optional(),
  mot_status: z.string().nullable().optional(),
  make: z.string().nullable().optional(),
  co2_emissions: z.string().nullable().optional(),
  engine_capacity: z.string().nullable().optional(),
  wheel_plan: z.string().nullable().optional(),
  year_of_manufacture: z.string().nullable().optional(),
  fuel_type: z.string().nullable().optional(),
  marked_for_export: z.string().nullable().optional(),
  colour: z.string().nullable().optional(),
  type_approval: z.string().nullable().optional(),
  date_of_last_v5_issued: z.string().nullable().optional(),
  revenue_weight: z.string().nullable().optional(),
  mot_expiry_date: z.string().nullable().optional(),
  month_of_first_registration: z.string().nullable().optional()
});

type EditFormData = z.infer<typeof EditVehicleSchema>

type FormFields = keyof EditFormData;

export const EditVehicleForm: React.FC = () => {
  const navigate = useNavigate();
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingVehicle, setIsFetchingVehicle] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const {register, setValue, formState: {errors}, handleSubmit, watch} = useForm<EditFormData>({
    resolver: zodResolver(EditVehicleSchema),
    mode: 'onSubmit',
    defaultValues: {
      customer_name: '',
      registration_number: '',
      tax_status: null,
      tax_due_date: null,
      mot_status: null,
      make: null,
      co2_emissions: null,
      engine_capacity: null,
      wheel_plan: null,
      year_of_manufacture: null,
      fuel_type: null,
      marked_for_export: null,
      colour: null,
      type_approval: null,
      date_of_last_v5_issued: null,
      revenue_weight: null,
      mot_expiry_date: null,
      month_of_first_registration: null
    }
  });

  const registrationNumber = watch("registration_number");

  // Fetch customers only once when component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await apiAxios.get('/api/customer/dropdown/');
        if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
          setCustomers(response.data.data);
        } else {
          console.error('Unexpected customers data structure:', response.data);
          setCustomers([]);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      }
    };

    fetchCustomers();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch vehicle data only when id changes
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const response = await apiAxios.get(`/api/vehicles/${id}/`);
        const vehicleData = response.data.data;
        
        if (vehicleData) {
          const matchingCustomer = customers.find(customer => 
            `${customer.first_name}` === vehicleData.customer_name
          );

          setValue("customer_name", matchingCustomer 
            ? `${matchingCustomer.first_name}`
            : vehicleData.customer_name,
            { shouldValidate: true }
          );

          const fieldsToSet = {
            year_of_manufacture: vehicleData.year_of_manufacture,
            registration_number: vehicleData.registration_number,
            fuel_type: vehicleData.fuel_type,
            tax_status: vehicleData.tax_status,
            marked_for_export: vehicleData.marked_for_export,
            tax_due_date: vehicleData.tax_due_date,
            colour: vehicleData.colour,
            mot_status: vehicleData.mot_status,
            type_approval: vehicleData.type_approval,
            make: vehicleData.make,
            date_of_last_v5_issued: vehicleData.date_of_last_v5_issued,
            co2_emissions: vehicleData.co2_emissions,
            revenue_weight: vehicleData.revenue_weight,
            engine_capacity: vehicleData.engine_capacity,
            mot_expiry_date: vehicleData.mot_expiry_date,
            wheel_plan: vehicleData.wheel_plan,
            month_of_first_registration: vehicleData.month_of_first_registration
          };

          Object.entries(fieldsToSet).forEach(([field, value]) => {
            setValue(field as FormFields, value, { 
              shouldValidate: true,
              shouldDirty: true
            });
          });
        }
      } catch (error) {
        console.error("Error fetching Vehicle data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, [id, setValue]); // Only depend on id and setValue

  const fetchVehicleDetails = async (regNumber: string) => {
    if (!regNumber || regNumber.trim().length < 2) return;
    
    setIsFetchingVehicle(true);
    setRegistrationError(null); // Clear any previous errors
    try {
      const response = await axios({
        method: 'get',
        url: `https://fixamatic.com/dvlaapi_check?vehicleNumber=${regNumber.trim().toUpperCase()}`,
        headers: {
          'Accept': 'application/json'
        }
      });

      const data = response.data;
      
      // Check if response contains error information despite 200 status
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
        dateString ? new Date(dateString).toISOString().split('T')[0] : null;
      
      // Handle boolean to string conversion
      const formatBoolean = (value: boolean | undefined) => 
        value !== undefined ? value.toString() : null;

      // Update form fields with API response
      setValue('tax_status', data.taxStatus || null);
      setValue('tax_due_date', formatDate(data.taxDueDate));
      setValue('mot_status', data.motStatus || null);
      setValue('make', data.make || null);
      setValue('year_of_manufacture', data.yearOfManufacture ? data.yearOfManufacture.toString() : null);
      setValue('engine_capacity', data.engineCapacity?.toString() || null);
      setValue('co2_emissions', data.co2Emissions?.toString() || null);
      setValue('fuel_type', data.fuelType || null);
      setValue('marked_for_export', formatBoolean(data.markedForExport));
      setValue('colour', data.colour || null);
      setValue('type_approval', data.typeApproval || null);
      setValue('revenue_weight', data.revenueWeight?.toString() || null);
      setValue('date_of_last_v5_issued', formatDate(data.dateOfLastV5CIssued));
      setValue('mot_expiry_date', formatDate(data.motExpiryDate));
      setValue('wheel_plan', data.wheelplan || null);
      setValue('month_of_first_registration', data.monthOfFirstRegistration || null);

    } catch (error: unknown) {
      console.error('Error fetching vehicle details:', error);
      
      // Clear all form fields except registration number and customer name
      setValue('tax_status', '');
      setValue('tax_due_date', '');
      setValue('mot_status', '');
      setValue('make', '');
      setValue('year_of_manufacture', null);
      setValue('engine_capacity', '');
      setValue('co2_emissions', '');
      setValue('fuel_type', '');
      setValue('marked_for_export', '');
      setValue('colour', '');
      setValue('type_approval', '');
      setValue('revenue_weight', '');
      setValue('date_of_last_v5_issued', '');
      setValue('mot_expiry_date', '');
      setValue('wheel_plan', '');
      setValue('month_of_first_registration', '');
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const detail = error.response?.data?.detail || '';
        
        switch (status) {
          case 404:
            setRegistrationError('Vehicle registration number not found. Please verify the registration number is correct.');
            break;
          case 429:
            setRegistrationError('Too many requests. Please try again later.');
            break;
          case 500:
            setRegistrationError('Vehicle lookup service is currently unavailable. Please try again later.');
            break;
          case 400:
            if (detail.includes('Invalid format')) {
              console.log('Invalid format');
              setRegistrationError('Vehicle Register number is not Valid');
            } else {
              console.log('Bad Request');
              setRegistrationError(detail || 'Bad Request');
            }
            break;
          default:
            setRegistrationError(error.response?.data?.message || error.message || 'Unknown error occurred');
        }
      } else {
        setRegistrationError('Vehicle Register number is not Valid.');
      }
    } finally {
      setIsFetchingVehicle(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    
    if (!registrationNumber) {
      setRegistrationError(null);
      return;
    }
    
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

  const onSubmit = async (data: EditFormData) => {
    if (registrationError) {
      return; // Prevent submission if there's a registration error
    }
    setRegistrationError(null);
    setIsLoading(true);
    console.log('Form submission started', data); // Debug log
    try {
      const formData = new FormData();
      
      // Required fields
      formData.append("customer_name", data.customer_name);
      formData.append("registration_number", data.registration_number);
      
      // Optional fields - handle all fields consistently
      const optionalFields: Array<keyof EditFormData> = [
        'year_of_manufacture',
        'fuel_type',
        'tax_status',
        'marked_for_export',
        'tax_due_date',
        'colour',
        'mot_status',
        'type_approval',
        'make',
        'date_of_last_v5_issued',
        'co2_emissions',
        'revenue_weight',
        'engine_capacity',
        'mot_expiry_date',
        'wheel_plan',
        'month_of_first_registration'
      ];

      optionalFields.forEach(field => {
        const value = data[field];
        if (value !== null && value !== undefined && value !== '') {
          formData.append(field, value);
          console.log(`Appending ${field}:`, value); // Debug log
        }
      });

      console.log('Making API call...'); // Debug log
      const response = await apiAxios.patch(`/api/vehicles/update/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('API response:', response); // Debug log

      navigate("/vehicle");
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error updating vehicle:", axiosError);
      // Add more detailed error logging
      if (axiosError.response) {
        console.error('Error response:', axiosError.response.data);
        console.error('Error status:', axiosError.response.status);
      }
    }
  };

  // Add form validation debugging
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
    }
  }, [errors]);

  return (
    <div className='min-h-screen bg-gray-100 pb-6'>
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
        </div>
      )}
      {isFetchingVehicle && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
        </div>
      )}
      <Header />
        <form className='bg-white mt-6 p-6 rounded-md shadow-md max-w-6xl mx-auto' onSubmit={handleSubmit(onSubmit)}>
          <div className='p-6'>
            <div className='flex items-center justify-between mb-4 border-b-2 border-acgrey'>
              <h2 className='text-2xl font-bold mb-4 '>Edit Vehicles</h2>
              <div className="flex gap-2">
                <button
                  type='button'
                  onClick={() => navigate("/vehicle")}
                  className="px-6 py-2 bg-white text-black rounded font-semibold hover:bg-gray-200">
                  Back
                </button>
                <button className="px-6 py-2 bg-main text-white font-semibold rounded hover:bg-white border-1 hover:border-main hover:text-main "
                type='submit'
                >
                  Save
                </button>
              </div>
            </div>
            <div className='flex flex-wrap gap-4'>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Customer Name<span className='text-red-500'>*</span></label>
                <select
                  {...register("customer_name", { required: "Customer name is required" })}
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={`${customer.first_name}`}>
                      {customer.first_name}
                    </option>
                  ))}
                </select>
                {errors.customer_name && (
                  <p className='text-red-500'>{errors.customer_name.message}</p>
                )}
              </div>
              
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Year Of Manufacture</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                {...register("year_of_manufacture")}
                />
              </div>
            </div>
            <div className='flex flex-wrap gap-4 mt-4'>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Registration Number<span className='text-red-500'>*</span></label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("registration_number")}
                />
                {errors.registration_number && <p className='text-red-500'>{errors.registration_number.message}</p>}
                {registrationError && <p className='text-red-500'>{registrationError}</p>}
              </div>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Fuel Type</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("fuel_type")}
                />
                {errors.fuel_type&&<p className='text-red-500'>{errors.fuel_type.message}</p>}
              </div>
            </div>
         
            <div className='flex flex-wrap gap-4 mt-4'>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Tax Status</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("tax_status")}
                />
                 {errors.tax_status&&<p className='text-red-500'>{errors.tax_status.message}</p>}
              </div>

              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Marked For Export</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("marked_for_export")}
                />
                 {errors.marked_for_export&&<p className='text-red-500'>{errors.marked_for_export.message}</p>}
              </div>
            </div>
            <div className='flex flex-wrap gap-4 mt-4'>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Tax Due Date</label>
                <InputField
                  type="date"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("tax_due_date")}
                />
                 {errors.tax_due_date&&<p className='text-red-500'>{errors.tax_due_date.message}</p>}
              </div>

              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Colour</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("colour")}
                />
                 {errors.colour&&<p className='text-red-500'>{errors.colour.message}</p>}
              </div>
            </div>

            <div className='flex flex-wrap gap-4 mt-4'>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>MOT Status</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("mot_status")}
                />
                 {errors.mot_status&&<p className='text-red-500'>{errors.mot_status.message}</p>}
              </div>

              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Type Approval</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("type_approval")}
                />
                 {errors.type_approval&&<p className='text-red-500'>{errors.type_approval.message}</p>}
              </div>
            </div>


            <div className='flex flex-wrap gap-4 mt-4'>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Make</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("make")}
                />
                 {errors.make&&<p className='text-red-500'>{errors.make.message}</p>}
              </div>

              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Date Of Last V5 Issued</label>
                <InputField
                  type="date"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("date_of_last_v5_issued")}
                />
                 {errors.date_of_last_v5_issued&&<p className='text-red-500'>{errors.date_of_last_v5_issued.message}</p>}
              </div>
            </div>


            <div className='flex flex-wrap gap-4 mt-4'>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Co2 Emissions</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("co2_emissions")}
                />
                 {errors.co2_emissions&&<p className='text-red-500'>{errors.co2_emissions.message}</p>}
              </div>

              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Revenue Weight</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("revenue_weight")}
                />
                 {errors.revenue_weight&&<p className='text-red-500'>{errors.revenue_weight.message}</p>}
              </div>
            </div>

            <div className='flex flex-wrap gap-4 mt-4'>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Engine Capacity</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("engine_capacity")}
                />
                 {errors.engine_capacity&&<p className='text-red-500'>{errors.engine_capacity.message}</p>}
              </div>

              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>MOT Expiry Date</label>
                <InputField
                  type="date"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("mot_expiry_date")}
                />
                 {errors.mot_expiry_date&&<p className='text-red-500'>{errors.mot_expiry_date.message}</p>}
              </div>
            </div>

            <div className='flex flex-wrap gap-4 mt-4'>
              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Wheel Plan</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("wheel_plan")}
                />
                 {errors.wheel_plan&&<p className='text-red-500'>{errors.wheel_plan.message}</p>}
              </div>

              <div className='flex-1 min-w-[200px]'>
                <label className='block text-sm font-medium text-gray-700'>Month Of First Registration</label>
                <InputField
                  type="text"
                  className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
                  label=""
                  {...register("month_of_first_registration")}
                />
                 {errors.month_of_first_registration&&<p className='text-red-500'>{errors.month_of_first_registration.message}</p>}
              </div>
            </div>

          </div>
        </form>
    </div>
  );
};  
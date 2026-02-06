import { apiAxios } from "../api/apiUrl";

export interface Appointment {
  id: number;
  registration_number: string;
  customer_name: string;
  date: string;
  total_estimate: string;
}

export interface AppointmentsResponse {
    count: number;
    results: {
        status: string;
        message: string;
        data: Appointment[];
    };
}

export const AppointmentBooking = async (page: number, search: string | undefined, PageSize: string): Promise<AppointmentsResponse> => {
    try {
        const response = await apiAxios.get(`/api/appointments/?page=${page}&search=${search}&page_size=${PageSize}`);

        // Check response structure
        if (response.status !== 200 || response.data?.results?.status !== 'success') {
            throw new Error(response.data?.results?.message || "Failed to fetch appointments");
        }

        // Return the data array from results
        return response.data as AppointmentsResponse;

    } catch (error: unknown) {
        console.error('Error fetching appointment data:', error);
        const errorMessage = error instanceof Error ? error.message :
            (error && typeof error === 'object' && 'response' in error) ?
                (error.response as any)?.data?.results?.message :
                "Unable to fetch appointments. Please try again later.";
        throw new Error(errorMessage);
    }
}

export const getVehicles = async () => {
    try {
        const response = await apiAxios.get('/api/appointments/vehicles/');
        if (response.status !== 200 || response.data.status !== 'success') {
            throw new Error("Failed to fetch vehicles");
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        throw error;
    }
}

export const getVehicleById = async (id: number) => {
    try {
        const response = await apiAxios.get(`/api/vehicle-details/${id}/`);
        if (response.status !== 200 || response.data.status !== 'success') {
            throw new Error("Failed to fetch vehicle details");
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        throw error;
    }
}

interface ServiceItem {
    service: string;
    price: string | number;
    description: string |any;
}

interface CreateAppointmentData {
    customer_name: string;
    customer_type: string;
    car_reg: string;
    mileage: string;
    date: string;
    time: string;
    services: ServiceItem[];
}

export const createAppointment = async (data: CreateAppointmentData) => {
    try {
        // Convert services to the correct format
        const formattedServices = data.services.map(service => ({
            service: service.service,
            price: typeof service.price === 'number' ? service.price.toString() : service.price,
            description:service.description,
        }));

        const payload = {
            customer_name: data.customer_name,
            customer_type: data.customer_type,
            car_reg: data.car_reg,
            mileage: data.mileage,
            date: data.date,
            time: data.time,
            services: formattedServices
        };

        const response = await apiAxios.post('/api/appointments/create/', payload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
    }
}

interface UpdateAppointmentData {
    id: number;
    car: number;
    date: string;
    time: string;
    description:string,
    // month: string;
    service_ids: string;
    service_prices: string;
}

export const updateAppointment = async (data: UpdateAppointmentData) => {
    try {
        const formData = new FormData();
        formData.append('car', data.car.toString());
        formData.append('date', data.date);
        formData.append('time', data.time);
        // formData.append('month', data.month);
        formData.append('service_ids', data.service_ids);
        formData.append('prices', data.service_prices);
        formData.append('description', data.description);
        const response = await apiAxios.patch(`/api/appointments/update/${data.id}/`, formData);
        return response.data;
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
}


export const fetchServiceMasterappointment = async () => {
    try {
        const response = await apiAxios.get('/api/services/dropdown/');
        console.log('Services API Response:', response.data); // Debug log

        if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            console.error('Unexpected services data structure:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        throw error;
    }
};

export const getAppointmentById = async (id: number) => {
    try {
        const response = await apiAxios.get(`/api/appointments/${id}/`);
        if (response.status !== 200 || response.data.status !== 'success') {
            throw new Error("Failed to fetch appointment details");
        }
        return response.data.data;
    } catch (error) {
        console.error('Error fetching appointment details:', error);
        throw error;
    }
}

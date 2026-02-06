
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { apiAxios } from "../../commonapicall/api/apiUrl";
import { createAppointment } from "../../commonapicall/AppointmentBookingapis/AppointmentBookingapis";
import { FaUser, FaCar, FaTools } from "react-icons/fa";

// ---- Schema ----
const appointmentSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  contactNumber: z.string().optional(),
  licensePlate: z.string().min(1, "License plate is required"),
  make: z.string().optional(),
  model: z.string().optional(),
  serviceId: z.string().min(1, "Service type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().optional(),
  notes: z.string().optional(),
  mileage: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface Service {
  id: number;
  name?: string;
  service_name?: string;
  price: string | number;
  is_deleted: boolean;
  description?: string;
}

interface AddAppointmentPopupProps {
  onClose: () => void;
  refreshData?: () => void;
}

export const AddAppointmentPopup: React.FC<AddAppointmentPopupProps> = ({
  onClose,
  refreshData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [masterServices, setMasterServices] = useState<Service[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      mileage: "",
    }
  });

  // Fetch Services
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await apiAxios.get("/api/services/dropdown/");
        let servicesData: any[] = [];
        
        if (Array.isArray(response.data)) {
            servicesData = response.data;
        } else if (Array.isArray(response.data?.data)) {
            servicesData = response.data.data;
        } else if (Array.isArray(response.data?.data?.services)) {
            servicesData = response.data.data.services;
        } else if (Array.isArray(response.data?.services)) {
            servicesData = response.data.services;
        }

        const activeServices = servicesData
          .filter((s: any) => !s.is_deleted)
          .map((s: any) => ({
            id: s.id,
            name: s.name || s.service_name || s.title || "Unnamed Service",
            price: s.price,
            is_deleted: s.is_deleted,
            description: s.description
          }));

        setMasterServices(activeServices);
      } catch (error) {
        console.error("Error loading services:", error);
      }
    };
    loadServices();
  }, []);

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setIsLoading(true);

      // Find selected service details
      const selectedService = masterServices.find(s => s.id.toString() === data.serviceId);
      
      if (!selectedService) {
        toast.error("Invalid service selected");
        return;
      }

      // Prepare payload
      const payload = {
        customer_name: data.fullName,
        customer_type: "Walk In", // Default
        car_reg: data.licensePlate.toUpperCase(),
        mileage: data.mileage || "0",
        date: data.date,
        time: data.time || "",
        services: [{
          service: selectedService.name || "",
          price: selectedService.price,
          description: data.notes || ""
        }]
      };

      // Call API
      const response = await createAppointment(payload);

      if (response && (response.status === "success" || response.status === 201 || response.status === 200)) {
        toast.success("Appointment created successfully");
        if (refreshData) refreshData();
        onClose();
      } else {
        toast.error(response?.message || "Failed to create appointment");
      }

    } catch (error: any) {
      console.error("Error creating appointment:", error);
      toast.error(error.message || "Error creating appointment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-[#0284c7] text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold">Add New Appointment</h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition">
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          
          {/* Customer Details */}
          <div className="bg-[#f8fafc] p-6 rounded-lg border border-gray-100">
            <h3 className="text-[#0284c7] font-semibold flex items-center gap-2 mb-4 text-sm tracking-wide uppercase">
              <FaUser /> Customer Details
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                <input
                  {...register("fullName")}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0284c7]"
                  placeholder="Enter full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Contact Number</label>
                <input
                  {...register("contactNumber")}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0284c7]"
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>

          {/* Car Information */}
          <div className="bg-[#f8fafc] p-6 rounded-lg border border-gray-100">
            <h3 className="text-[#0284c7] font-semibold flex items-center gap-2 mb-4 text-sm tracking-wide uppercase">
              <FaCar /> Car Information
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">License Plate</label>
                <input
                  {...register("licensePlate")}
                  className="w-full border border-[#0284c7] rounded px-3 py-2 text-sm focus:outline-none ring-1 ring-[#0284c7]/20 font-medium"
                  placeholder="REG123"
                  style={{ textTransform: 'uppercase' }}
                />
                 {errors.licensePlate && <p className="text-red-500 text-xs mt-1">{errors.licensePlate.message}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Make</label>
                <input
                  {...register("make")}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0284c7]"
                  placeholder="Toyota"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Model</label>
                <input
                  {...register("model")}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0284c7]"
                  placeholder="Corolla"
                />
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-[#f8fafc] p-6 rounded-lg border border-gray-100">
            <h3 className="text-[#0284c7] font-semibold flex items-center gap-2 mb-4 text-sm tracking-wide uppercase">
              <FaTools /> Service Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Type of Service</label>
                <select
                  {...register("serviceId")}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0284c7] bg-white"
                >
                  <option value="">Select a service</option>
                  {masterServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} (£{service.price})
                    </option>
                  ))}
                </select>
                {errors.serviceId && <p className="text-red-500 text-xs mt-1">{errors.serviceId.message}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Date</label>
                  <input
                    type="date"
                    {...register("date")}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0284c7]"
                  />
                   {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Time</label>
                  <input
                    type="time"
                    {...register("time")}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0284c7]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
            <textarea
              {...register("notes")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0284c7] h-24 resize-none"
              placeholder="Add any additional instructions..."
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#0284c7] text-white px-8 py-2.5 rounded hover:bg-[#0ea5e9] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Appointment"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

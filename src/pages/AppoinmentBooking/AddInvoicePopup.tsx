
import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { apiAxios } from "../../commonapicall/api/apiUrl";
import { AppointmentBooking, getAppointmentById, createAppointment } from "../../commonapicall/AppointmentBookingapis/AppointmentBookingapis";
import { FaUser, FaCar, FaTools, FaSearch } from "react-icons/fa";

const invoiceSchema = z.object({
  appointmentId: z.string().optional(),
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

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface Service {
  id: number;
  name?: string;
  service_name?: string;
  price: string | number;
  is_deleted: boolean;
  description?: string;
}

interface Appointment {
  id: number;
  registration_number: string;
  customer_name: string;
  date: string;
}

interface AddInvoicePopupProps {
  onClose: () => void;
  refreshData?: () => void;
}

export const AddInvoicePopup: React.FC<AddInvoicePopupProps> = ({
  onClose,
  refreshData,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [masterServices, setMasterServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      mileage: "",
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceRes = await apiAxios.get("/api/services/dropdown/");
        let servicesData: any[] = [];
        if (Array.isArray(serviceRes.data)) servicesData = serviceRes.data;
        else if (Array.isArray(serviceRes.data?.data)) servicesData = serviceRes.data.data;
        else if (Array.isArray(serviceRes.data?.services)) servicesData = serviceRes.data.services;

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

        const apptRes = await AppointmentBooking(1, "", "10");
        if (apptRes && apptRes.results && apptRes.results.data) {
          setAppointments(apptRes.results.data);
        }

      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        try {
          const apptRes = await AppointmentBooking(1, searchTerm, "10");
          if (apptRes && apptRes.results && apptRes.results.data) {
            setAppointments(apptRes.results.data);
            setShowDropdown(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);


  const handleSelectAppointment = async (id: number) => {
    setIsLoading(true);
    setShowDropdown(false);
    try {
      const details = await getAppointmentById(id);
      if (details) {
        setValue("appointmentId", id.toString());
        setValue("fullName", details.customer_name || "");
        setValue("licensePlate", details.car_reg || details.registration_number || "");
        setValue("mileage", details.mileage || "");
      
        if (details.services && details.services.length > 0) {
          
          const serviceName = details.services[0].name || details.services[0].service_name || details.services[0].details;
          const matchedService = masterServices.find(s => s.name === serviceName);
          if (matchedService) {
            setValue("serviceId", matchedService.id.toString());
          }
          setValue("notes", details.services[0].description || "");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch appointment details");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsLoading(true);

      const selectedService = masterServices.find(
        (s) => s.id.toString() === data.serviceId
      );

      if (!selectedService) {
        toast.error("Invalid service selected");
        return;
      }

      const quantity = 1;
      const price = Number(selectedService.price);
      const vatRate = 0.18; // 18% VAT (change if needed)
      const vatAmount = (price * vatRate).toFixed(2);
      const totalWithVat = (price + Number(vatAmount)).toFixed(2);

      const payload = {
        name: `Invoice ${Date.now()}`,
        existing_booking: data.appointmentId
          ? Number(data.appointmentId)
          : null,
        description: data.notes || selectedService.name,
        quantity,
        price: price.toFixed(2),
        vat_amount: vatAmount,
        total_with_vat: totalWithVat,
        customer_name: data.fullName,
        services: [
          {
            service: selectedService.name,
            price: price.toFixed(2),
            description: data.notes || "",
          },
        ],
        invoice_date: data.date,
        vehicle_registration: data.licensePlate.toUpperCase(),
        mileage: Number(data.mileage || 0),
        vat: true,
        is_deleted: false,
      };

      const response = await apiAxios.post("/api/invoice_new/", payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Invoice created successfully");
        refreshData?.();
        onClose();
      } else {
        toast.error("Failed to create invoice");
      }
    } catch (error: any) {
      console.error("Invoice create error:", error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Error creating invoice"
      );
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl relative">

        {/* Header */}
        <div className="bg-[#0284c7] text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
          <h2 className="text-xl font-semibold">Add New Invoice</h2>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition">
            <IoClose size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8">

          {/* Appointment Search */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Search Appointment ID (Auto-fill)</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-10 py-2 text-sm focus:outline-none focus:border-[#0284c7]"
                placeholder="Type ID or Name to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
            </div>

            {showDropdown && appointments.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {appointments.map(appt => (
                  <div
                    key={appt.id}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-0"
                    onClick={() => handleSelectAppointment(appt.id)}
                  >
                    <span className="font-semibold text-[#0284c7]">#{appt.id}</span> - {appt.customer_name} ({appt.registration_number})
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

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
                {isLoading ? "Saving..." : "Create Invoice"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

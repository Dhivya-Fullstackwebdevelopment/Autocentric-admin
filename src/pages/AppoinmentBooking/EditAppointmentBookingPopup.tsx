import React, { useEffect, useState, useMemo, useCallback } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { apiAxios } from "../../commonapicall/api/apiUrl";

// ---- Schema (price validation removed) ----
const appointmentSchema = z.object({
  car: z.string({
    required_error: "Car registration is required",
  }).min(1, "Car registration is required"),
  date: z.string({
    required_error: "Date is required",
  }).min(1, "Date is required"),
  time: z.string().optional(),
  customerName: z.string({
    required_error: "Customer name is required",
  }).min(1, "Customer name is required"),
  mileage: z.string().optional(),
  services: z.array(z.object({
    serviceId: z.number().optional(),
    details: z.string(),
    price: z.number(), // no min validation
    description: z.string().optional(),
  })).min(1, "At least one service is required"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface Service {
  id: number;
  name?: string;
  description?: string;
  service_name?: string;
  price: string | number;
  is_deleted: boolean;
}

interface ServiceRow {
  no: number;
  serviceId?: number;
  details: string;
  price: number;
  description: string;
  isDropdownOpen?: boolean;
  searchTerm?: string;
  isManualEdit?: boolean;
}

interface EditAppointmentBookingPopupProps {
  onClose: () => void;
  appointmentId: number;
  refreshData?: () => void;
}

export const EditAppointmentBookingPopup: React.FC<EditAppointmentBookingPopupProps> = ({
  onClose,
  appointmentId,
  refreshData
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [servicesError, setServicesError] = useState("");
  const [masterServices, setMasterServices] = useState<Service[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedCustomerType, setSelectedCustomerType] = useState("Walk In");
  const [actualTotal, setActualTotal] = useState("0.00");
  const [includeVAT, setIncludeVAT] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showServiceErrors, setShowServiceErrors] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    getValues,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    mode: "onChange",
  });

  const selectedServiceIds = useMemo(() =>
    services.filter(s => s.serviceId !== undefined).map(s => s.serviceId as number),
    [services]);

  const calculateActualTotal = useCallback((servicesList: ServiceRow[], includeVat: boolean) => {
    const subtotal = servicesList.reduce((sum, service) => sum + (service.price || 0), 0);
    const total = includeVat ? subtotal * 1.2 : subtotal;
    return total.toFixed(2);
  }, []);

  const handlePriceChange = (index: number, value: string) => {
    const newPrice = parseFloat(value) || 0;

    setServices(prev => {
      const newServices = [...prev];
      newServices[index] = {
        ...newServices[index],
        price: newPrice,
        isManualEdit: newServices[index].isManualEdit || true
      };
      return newServices;
    });

    // Update the form values immediately when price changes
    const currentValues = getValues();
    const updatedServices = [...(currentValues.services || [])];
    updatedServices[index] = {
      serviceId: updatedServices[index]?.serviceId || services[index]?.serviceId || 0,
      details: updatedServices[index]?.details || services[index]?.details || "",
      price: newPrice,
      description: updatedServices[index]?.description || services[index]?.description || "",
    } as any;
    setValue("services", updatedServices as any);

    setActualTotal(calculateActualTotal(
      services.map((s, i) => i === index ? { ...s, price: newPrice } : s),
      includeVAT
    ));
  };

  const loadAppointmentData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiAxios.get(`/api/appointments/${appointmentId}/`);

      if (response.data?.status === "success") {
        const data = response.data.data;
        const servicesData = data.services || [];

        const initialServices = servicesData.map((service: any, index: number) => ({
          no: index + 1,
          serviceId: service.id || service.serviceId || undefined,
          details: service.name || service.service_name || service.details || '',
          price: parseFloat(service.price) || 0,
          description: service.description || '',
          isDropdownOpen: false,
          searchTerm: service.name || service.service_name || '',
          isManualEdit: false,
        }));

        setServices(initialServices);
        setIncludeVAT(Boolean(data.include_vat));
        setActualTotal(calculateActualTotal(initialServices, Boolean(data.include_vat)));
        setSelectedCustomerType(data.customer_type || "Walk In");

        const timeValue = data.time ? data.time.split(':').slice(0, 2).join(':') : '';

        reset({
          car: (data.car_reg || data.car || '').toString(),
          date: data.date ? data.date.split('T')[0] : '',
          time: timeValue,
          customerName: data.customer_name || '',
          mileage: data.mileage || '',
          services: initialServices.map((service: any) => ({
            serviceId: service.serviceId || 0,
            details: service.details,
            price: service.price,
            description: service.description || '',
          })),
        });
      } else {
        throw new Error(response.data?.message || "Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching appointment data:", err);
      toast.error("Failed to load appointment data");
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId, reset, calculateActualTotal, onClose]);

  const loadMasterServices = useCallback(async () => {
    try {
      setServicesError("");
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
      } else {
        throw new Error("Unexpected services response format");
      }

      const formattedServices = servicesData
        .filter((service: any) => !service.is_deleted)
        .map((service: any) => ({
          id: service.id,
          name: service.name || service.service_name || service.title || "Unnamed Service",
          description: service.description || '',
          price: service.price || "0.00",
          is_deleted: service.is_deleted || false
        }));

      if (formattedServices.length === 0) {
        throw new Error("No active services available");
      }

      setMasterServices(formattedServices);
    } catch (error) {
      const defaultMessage = "Could not load service options. You can still enter services manually.";
      const errorMessage = error instanceof Error ? error.message : defaultMessage;
      setServicesError(errorMessage);
      console.error("Services loading error:", error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await loadAppointmentData();
      await loadMasterServices();
    };
    fetchData();
  }, [loadAppointmentData, loadMasterServices]);

  const handleAddService = useCallback(() => {
    setServices(prev => [
      ...prev,
      {
        no: prev.length + 1,
        details: "",
        price: 0,
        description: "",
        isDropdownOpen: false,
        searchTerm: "",
        isManualEdit: true,
      },
    ]);
    setDeleteError("");
    setShowServiceErrors(false);
  }, []);

  const handleServiceSelect = useCallback((serviceNo: number) => {
    setSelectedServices(prev =>
      prev.includes(serviceNo) ? prev.filter(no => no !== serviceNo) : [...prev, serviceNo]
    );
  }, []);

  const handleServiceSelection = useCallback((index: number, masterService: Service) => {
    const newServices = [...services];
    newServices[index] = {
      ...services[index],
      serviceId: masterService.id,
      details: masterService.name || masterService.service_name || '',
      price: parseFloat(String(masterService.price)) || 0,
      description: masterService.description || '',
      isDropdownOpen: false,
      searchTerm: masterService.name || masterService.service_name || '',
      isManualEdit: false,
    };
    setServices(newServices);
    setActualTotal(calculateActualTotal(newServices, includeVAT));
    setDeleteError("");
    setValue(
      "services",
      newServices.map(s => ({
        serviceId: s.serviceId || 0,
        details: s.details,
        price: s.price,
        description: s.description || '',
      }))
    );
  }, [services, includeVAT, calculateActualTotal, setValue]);

  const handleDeleteServices = useCallback(() => {
    if (services.length === 0) {
      setDeleteError("Please add at least one service.");
      return;
    }

    if (selectedServices.length === 0) {
      setDeleteError("Please select at least one service to delete.");
      return;
    }

    setDeleteError("");
    const remainingServices = services.filter(
      service => !selectedServices.includes(service.no)
    );
    const reorderedServices = remainingServices.map((service, index) => ({
      ...service,
      no: index + 1,
    }));
    setServices(reorderedServices);
    setSelectedServices([]);
    setActualTotal(calculateActualTotal(reorderedServices, includeVAT));
    setShowServiceErrors(false);
  }, [services, selectedServices, includeVAT, calculateActualTotal]);

  const getFilteredServices = useCallback((searchTerm: string) => {
    return masterServices.filter(
      service =>
        (service.name || service.service_name || '').toLowerCase().includes((searchTerm || "").toLowerCase()) &&
        !selectedServiceIds.includes(service.id) &&
        !service.is_deleted
    );
  }, [masterServices, selectedServiceIds]);

  const onSubmit = useCallback(async (data: AppointmentFormData) => {
    try {
      setIsSubmitting(true);
      setShowServiceErrors(true);

      // Check if there are any services with empty details
      const hasEmptyServiceDetails = services.some(s => !s.details.trim());
      if (services.length === 0 || hasEmptyServiceDetails) {
        setDeleteError("Please add valid services with details.");
        toast.error("Please add valid services with details.");
        return;
      }

      // Ensure form data is up to date with current services
      const updatedFormData = {
        ...data,
        services: services.map(s => ({
          serviceId: s.serviceId || 0,
          details: s.details,
          price: s.price,
          description: s.description || ''
        })),
      };

      const payload = {
        car_reg: (updatedFormData.car || "").trim().toUpperCase(),
        date: updatedFormData.date,
        time: updatedFormData.time || "",
        mileage: (updatedFormData.mileage || "").trim(),
        customer_name: (updatedFormData.customerName || "").trim(),
        customer_type: selectedCustomerType,
        services: services.map(s => ({
          id: s.serviceId || undefined,
          name: s.details,
          price: s.price,
          description: s.description || ''
        })),
        service_ids: services
          .filter(s => s.serviceId !== undefined)
          .map(s => s.serviceId!),
        prices: services.map(s => s.price),
        include_vat: includeVAT
      };

      const response = await apiAxios.patch(`/api/appointments/update/${appointmentId}/`, payload);

      if (response.data?.status === "success") {
        toast.success('Successfully updated the Booking ID');
        if (refreshData) {
          refreshData();
        }
        onClose();
      } else {
        throw new Error(response.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error(`Error updating appointment: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [services, selectedCustomerType, includeVAT, appointmentId, refreshData, onClose]);

  const handleCreateQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`http://217.154.63.73:8000/api/quote/${appointmentId}/`, '_blank');
  };

  const handleCreateInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`http://217.154.63.73:8000/api/invoice/${appointmentId}/`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-[#0000005e] bg-opacity-100 flex justify-center items-center z-50">
      <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-h-[90vh] overflow-y-auto max-w-full shadow-lg relative flex flex-col">
        {/* Close Button */}
        <div
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer"
        >
          <IoCloseCircle className="text-[28px] hover:text-red-600" />
        </div>

        {(isLoading || isSubmitting) && (
          <div className="absolute inset-0 bg-transparent bg-opacity-10 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
          </div>
        )}

        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-main uppercase">
            Edit Booking & Invoice
          </h2>
        </div>

        {servicesError && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
            {servicesError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">
                Type of Customer
              </label>
              <select
                disabled
                value={selectedCustomerType}
                onChange={(e) => setSelectedCustomerType(e.target.value)}
                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              >
                <option value="Walk In">Walk In</option>
                <option value="Existing Customer">Existing Customer</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Car reg<span className="text-red-500">*</span></label>
              <input
                {...register("car", {
                  setValueAs: (value) => value ? value.toUpperCase() : value
                })}
                type="text"
                placeholder="Car reg"
                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.toUpperCase();
                }}
              />
              {errors.car && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.car.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Date<span className="text-red-500">*</span></label>
              <input
                {...register("date")}
                type="date"
                placeholder="Date"
                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              />
              {errors.date && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">
                Customer Name<span className="text-red-500">*</span>
              </label>
              <input
                {...register("customerName")}
                type="text"
                placeholder="Customer Name"
                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              />
              {errors.customerName && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.customerName.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">Time</label>
              <input
                {...register("time")}
                type="time"
                placeholder="Time"
                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              />
              {errors.time && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.time.message}
                </span>
              )}
            </div>
            
            <div className="flex flex-col">
              <label className="mb-1 font-medium text-gray-700">
                Mileage
              </label>
              <input
                {...register("mileage")}
                type="text"
                placeholder="Mileage"
                className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
              />
              {errors.mileage && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.mileage.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mb-6">
            <button
              type="button"
              onClick={handleAddService}
              className="bg-main border font-semibold hover:text-main hover:bg-white hover:border-main text-white px-7 py-3 rounded"
            >
              Add Services
            </button>
            <button
              type="button"
              onClick={handleDeleteServices}
              className="bg-main border font-semibold hover:text-main hover:bg-white hover:border-main text-white px-7 py-3 rounded"
            >
              Delete
            </button>
          </div>

          {(deleteError || (showServiceErrors && errors.services)) && (
            <div className="text-red-500 mb-4 font-semibold">
              {deleteError || (showServiceErrors && errors.services?.message)}
            </div>
          )}

          <div className="h-auto bg-white rounded mb-6 border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-main text-white text-sm font-semibold sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-center">Select</th>
                  <th className="p-2 text-center">No.</th>
                  <th className="p-2">Services Details</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Price(£)</th>
                </tr>
              </thead>
              <tbody>
                {services.length > 0 ? (
                  services.map((service, index) => (
                    <tr key={index} className="relative hover:bg-gray-50">
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.no)}
                          onChange={() => handleServiceSelect(service.no)}
                          className="mx-auto cursor-pointer h-4 w-4"
                        />
                      </td>
                      <td className="p-2 text-center">{service.no}</td>
                      <td className="p-2">
                        <div className="relative">
                          <input
                            type="text"
                            className={`w-full p-1 border rounded text-sm ${showServiceErrors && !service.details ? 'border-red-500' : 'border-gray-300'
                              }`}
                            value={service.details}
                            onChange={(e) => {
                              const newServices = [...services];
                              newServices[index] = {
                                ...service,
                                details: e.target.value,
                                searchTerm: e.target.value,
                                isDropdownOpen: true,
                                isManualEdit: true,
                                serviceId: undefined
                              };
                              setServices(newServices);
                            }}
                            onFocus={() => {
                              const newServices = [...services];
                              newServices[index] = {
                                ...service,
                                isDropdownOpen: true
                              };
                              setServices(newServices);
                            }}
                            onBlur={() => {
                              setTimeout(() => {
                                const newServices = [...services];
                                newServices[index] = {
                                  ...service,
                                  isDropdownOpen: false
                                };
                                setServices(newServices);
                              }, 200);
                            }}
                            placeholder="Enter service details"
                          />
                          {service.isDropdownOpen && !service.serviceId && (
                            <div className="absolute z-50 bg-white border border-gray-300 rounded-md shadow-lg mt-1 w-full max-h-60 overflow-y-auto">
                              {masterServices.length === 0 ? (
                                <div className="p-2 text-gray-500">Loading services...</div>
                              ) : getFilteredServices(service.searchTerm || "").length > 0 ? (
                                getFilteredServices(service.searchTerm || "").map((masterService) => (
                                  <div
                                    key={masterService.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => handleServiceSelection(index, masterService)}
                                  >
                                    <span className="truncate">{masterService.name || masterService.service_name || 'Unnamed Service'}</span>
                                    <span className="text-gray-600 whitespace-nowrap">£{masterService.price}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="p-2 text-gray-500">No matching services found</div>
                              )}
                            </div>
                          )}
                          {showServiceErrors && !service.details && (
                            <div className="text-red-500 text-xs mt-1">
                              Service details are required
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          className="w-full p-1 border rounded text-sm border-gray-300"
                          value={service.description}
                          onChange={(e) => {
                            const newServices = [...services];
                            newServices[index] = {
                              ...service,
                              description: e.target.value
                            };
                            setServices(newServices);
                          }}
                          placeholder="Description (optional)"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className={`w-full p-1 border-2 rounded text-right border-acgrey`}
                          value={service.price}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          onBlur={(e) => {
                            const price = parseFloat(e.target.value) || 0;
                            handlePriceChange(index, price.toString());
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      No services added yet. Click "Add Services" to add services.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="flex flex-col items-center space-y-2">
              <label
                className="flex items-center space-x-2 font-semibold text-black cursor-pointer"
                style={{ marginBottom: "10px", marginLeft: "20px" }}
              >
                <input
                  type="checkbox"
                  checked={includeVAT}
                  onChange={(e) => {
                    setIncludeVAT(e.target.checked);
                    setActualTotal(calculateActualTotal(services, e.target.checked));
                  }}
                  className="form-checkbox h-4 w-4 text-main rounded border-gray-300"
                />
                <span>Include VAT @20%</span>
              </label>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-700">Estimate Total:</span>
                <input
                  type="text"
                  value={actualTotal}
                  placeholder="Estimate"
                  readOnly
                  className="border border-black px-3 py-2 rounded w-full focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6" style={{ marginTop: "20px" }}>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-all duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateQuote}
              className="bg-main text-white px-4 py-2 rounded hover:bg-white hover:text-main border hover:border-main"
            >
              Create Quote
            </button>
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className={`bg-main text-white px-4 py-2 rounded hover:bg-white hover:text-main border hover:border-main ${(isLoading || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Update Booking ID
            </button>
            <button
              type="button"
              onClick={handleCreateInvoice}
              className="bg-main text-white px-4 py-2 rounded hover:bg-white hover:text-main border hover:border-main"
            >
              Create Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
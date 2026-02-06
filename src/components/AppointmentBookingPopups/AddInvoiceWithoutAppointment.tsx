  import { Header } from "../Header";
  import { z } from "zod";
  import { useForm, type SubmitHandler } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";
  import { useState, useEffect } from "react";
  import { createAppointment } from "../../commonapicall/AppointmentBookingapis/AppointmentBookingapis";
  import { useNavigate } from "react-router-dom";
  import { apiAxios } from "../../commonapicall/api/apiUrl";
  import { toast } from "react-toastify";

  // ✅ Appointment validation schema
  const appointmentSchema = z.object({
    car: z.string({ required_error: "Car registration is required" }).nonempty("Car registration is required"),
    date: z.string({ required_error: "Date is required" }).nonempty("Date is required"),
    time: z.string(),
    mileage: z.string().optional(),
    customerName: z.string({ required_error: "Customer name is required" }).nonempty("Customer name is required"),
    customerType: z.string(),
    services: z.array(z.object({
      service: z.string().min(1, "Service is required"),
      price: z.number(),
      description: z.string().optional(),
    })).min(1, "At least one service is required"),
  });

  type AppointmentFormData = z.infer<typeof appointmentSchema>;

  interface Service {
    description: string;
    id: number;
    service_name: string;
    price: string;
    is_deleted: boolean;
  }

  interface ServiceRow {
    no: number;
    service?: string;
    price: number;
    description?: string;
    isDropdownOpen?: boolean;
    searchTerm?: string;
    isManualEdit?: boolean;
  }

  export const AddAppointmentBookingPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [masterServices, setMasterServices] = useState<Service[]>([]);
    const [services, setServices] = useState<ServiceRow[]>([]);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [actualTotal, setActualTotal] = useState("0.00");
    const [includeVAT, setIncludeVAT] = useState(false);
    const [deleteError, setDeleteError] = useState<string>("");
    const [] = useState(false);
    const [selectedCustomerType, setSelectedCustomerType] = useState("Walk In");
    const [createdAppointmentId, setCreatedAppointmentId] = useState<number | null>(null);
    const [serviceValidationError, setServiceValidationError] = useState<string>("");
    const isReadOnly = createdAppointmentId !== null;

    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
      trigger
    } = useForm<AppointmentFormData>({
      resolver: zodResolver(appointmentSchema),
      mode: "onChange",
      defaultValues: {
        customerType: "Walk In",
        services: [],
      },
    });

    const [isFetchingCustomer, setIsFetchingCustomer] = useState(false);
    const carReg = watch("car");
    const customerType = watch("customerType");

    useEffect(() => {
      const fetchCustomerByCarReg = async () => {
        if (
          (customerType === "Existing Customer" && carReg)) {
          try {
            setIsFetchingCustomer(true);
            const response = await apiAxios.post("/api/get_customer_by_car_reg/", { car_reg: carReg });

            if (response.data.status === "success") {
              setValue("customerName", response.data.data.customer_name, { shouldValidate: true });
              setValue("mileage", response.data.data.mileage ?? "", { shouldValidate: true });
              toast.success(response.data.message);
            } else {
              setValue("customerName", "", { shouldValidate: true });
              setValue("mileage", "", { shouldValidate: true });
              toast.error(response.data.message);
            }
          } catch (error) {
            console.error("Error fetching customer:", error);
            toast.error("Failed to fetch customer details");
            setValue("customerName", "", { shouldValidate: true });
            setValue("mileage", "", { shouldValidate: true });
          } finally {
            setIsFetchingCustomer(false);
          }
        }
      };

      const debounceTimer = setTimeout(fetchCustomerByCarReg, 1000);
      return () => clearTimeout(debounceTimer);
    }, [carReg, customerType, setValue]);

    useEffect(() => {
      loadServices();
    }, []);

    useEffect(() => {
      setValue(
        "services",
        services.map((s) => ({
          service: s.service || "",
          price: s.price ?? 0,
          description: s.description || ""
        }))
      );
    }, [services, setValue]);

    const loadServices = async () => {
      try {
        const response = await apiAxios.get("/api/services/dropdown/");
        if (response.data?.status === "success" && Array.isArray(response.data.data)) {
          setMasterServices(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    const calculateActualTotal = (servicesList: ServiceRow[], includeVat: boolean) => {
      const subtotal = servicesList.reduce((sum, service) => sum + (service.price ?? 0), 0);
      const total = includeVat ? subtotal * 1.2 : subtotal;
      return total.toFixed(2);
    };

    const handleAddService = async () => {
      const isFormValid = await trigger(["car", "date", "customerName", "time"]);
      if (!isFormValid) {
        toast.error("Please fill all required fields before adding a service.");
        return;
      }

      for (let i = 0; i < services.length; i++) {
        if (!services[i].service?.trim()) {
          toast.error(`Please fill valid Service for row ${i + 1}.`);
          return;
        }
      }

      setServiceValidationError("");
      setServices([
        ...services,
        {
          no: services.length + 1,
          service: "",
          price: 0,
          description: "",
          isDropdownOpen: false,
          searchTerm: "",
          isManualEdit: false
        },
      ]);
    };

    const handleServiceSelect = (serviceNo: number) => {
      setSelectedServices((prev) =>
        prev.includes(serviceNo) ? prev.filter((no) => no !== serviceNo) : [...prev, serviceNo]
      );
    };

    const handleServiceSelection = (index: number, masterService: Service) => {
      const newServices = [...services];
      newServices[index] = {
        ...services[index],
        service: masterService.service_name,
        price: parseFloat(masterService.price) || 0,
        description: masterService.description || "",
        isDropdownOpen: false,
        searchTerm: masterService.service_name,
        isManualEdit: false,
      };
      setServices(newServices);
      setActualTotal(calculateActualTotal(newServices, includeVAT));
      setDeleteError("");
    };

    const handleManualEdit = (index: number) => {
      const newServices = [...services];
      newServices[index] = {
        ...services[index],
        isManualEdit: true,
        isDropdownOpen: false,
        service: services[index].service || "",
        price: services[index].price ?? 0,
        description: services[index].description || ""
      };
      setServices(newServices);
    };

    const handleServiceChange = (index: number, value: string) => {
      const newServices = [...services];
      newServices[index] = {
        ...services[index],
        service: value,
        searchTerm: value,
        isDropdownOpen: value.length > 0 && !services[index].isManualEdit,
        price: services[index].price ?? 0,
      };
      setServices(newServices);
    };

    const handlePriceChange = (index: number, value: string) => {
      const priceValue = value === "" ? 0 : parseFloat(value) || 0;
      const newServices = [...services];
      newServices[index] = { ...services[index], price: priceValue };
      setServices(newServices);
      setActualTotal(calculateActualTotal(newServices, includeVAT));
    };

    const handleDeleteServices = () => {
      if (services.length === 0) {
        setDeleteError("Please add at least one service.");
        return;
      }
      if (selectedServices.length === 0) {
        setDeleteError("Please select at least one service to delete.");
        return;
      }

      setDeleteError("");
      const remainingServices = services.filter((service) => !selectedServices.includes(service.no));
      const reorderedServices = remainingServices.map((service, index) => ({ ...service, no: index + 1 }));
      setServices(reorderedServices);
      setSelectedServices([]);
      setActualTotal(calculateActualTotal(reorderedServices, includeVAT));
    };

    const getFilteredServices = (searchTerm: string) => {
      const selectedServicesList = services.filter((s) => s.service).map((s) => s.service);
      return masterServices.filter(
        (service) =>
          service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !selectedServicesList.includes(service.service_name)
      );
    };

    const handleDescriptionChange = (index: number, value: string) => {
      const newServices = [...services];
      newServices[index] = { ...services[index], description: value };
      setServices(newServices);
    };

    const validateServicesBeforeSubmit = () => {
      if (services.length === 0) {
        setServiceValidationError("At least one service is required");
        return false;
      }
      for (let i = 0; i < services.length; i++) {
        if (!services[i].service?.trim()) {
          setServiceValidationError(`Service is required for row ${i + 1}`);
          return false;
        }
      }
      return true;
    };

    const onSubmit: SubmitHandler<AppointmentFormData> = async (data) => {
      setDeleteError("");
      setIsLoading(true);

      if (!validateServicesBeforeSubmit()) {
        setIsLoading(false);
        return;
      }

      try {
        const requestData = {
          customer_name: data.customerName,
          customer_type: data.customerType,
          car_reg: data.car,
          mileage: data.mileage || "",
          date: data.date,
          time: data.time,
          services: data.services.map(s => ({
            service: s.service,
            price: s.price.toString(),
            description: s.description || ""
          }))
        };
        const result = await createAppointment(requestData);
        if (result.status === "success") {
          setCreatedAppointmentId(result.data.id);
          toast.success(`Booking ID Created Successfully`);
        }
      } catch (error) {
        console.error("Error saving appointment:", error);
        toast.error("Failed to create appointment");
      } finally {
        setIsLoading(false);
      }
    };


    return (
      <div className="min-h-screen bg-[#F3F4F6]">
        {isLoading && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
          </div>
        )}
        <Header />
        <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-h-[90vh] overflow-y-auto max-w-full shadow-lg relative flex flex-col mx-auto mt-10">
          <div className="flex items-center justify-center mb-6">
            <h2 className="text-2xl font-bold text-main uppercase">
              Add Booking & Invoice
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">
                  Type of Customer
                </label>
                <select
                  {...register("customerType",
                    {
                      onChange: (e) => {
                        setSelectedCustomerType(e.target.value)
                        setValue('customerType', e.target.value)
                        
                        if (e.target.value === "Walk In") {
                          setValue("customerName", "");
                        
                        }
                      }
                    }
                  )}
                  className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                  disabled={isFetchingCustomer || isReadOnly}
                >
                  <option value="Walk In">Walk In</option>
                  <option value="Existing Customer">Existing Customer</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 font-medium text-gray-700">Car reg<span className="text-red-500">*</span></label>
                <input
                  {...register("car")}
                  type="text"
                  placeholder="Car reg"
                  className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                  disabled={isReadOnly}
                  onChange={(e) => {
                    const upperValue = e.target.value.toUpperCase();
                    e.target.value = upperValue;
                    setValue("car", upperValue, { shouldValidate: true });
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
                  disabled={isReadOnly}
                />
                {errors.date && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.date.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col relative">
                <label className="mb-1 font-medium text-gray-700">
                  Customer Name<span className="text-red-500">*</span>
                </label>
                <input
                  {...register("customerName")}
                  type="text"
                  placeholder={isFetchingCustomer ? "Fetching customer..." : "Customer Name"}
                  className={`border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none ${isFetchingCustomer ? "opacity-70" : ""
                    }`}
                  disabled={isFetchingCustomer || selectedCustomerType === "Existing Customer"}
                />
                {isFetchingCustomer && (
                  <div className="absolute right-3 top-9">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-main"></div>
                  </div>
                )}
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
                  disabled={isReadOnly}
                />
                {errors.time && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.time.message}
                  </span>
                )}
              </div>
              <div className="flex flex-col relative">
                <label className="mb-1 font-medium text-gray-700">
                  Mileage
                </label>
                <input
                  {...register("mileage")}
                  type="text"
                  placeholder={isFetchingCustomer ? "Fetching Mileage..." : "Mileage"}
                  className={`border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none ${isFetchingCustomer ? "opacity-70" : ""
                    }`}
                  disabled={isFetchingCustomer || selectedCustomerType === "Existing Customer"}
                />
                {isFetchingCustomer && (
                  <div className="absolute right-3 top-9">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-main"></div>
                  </div>
                )}
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
                disabled={isReadOnly}
              >
                Add Services
              </button>
              <button
                type="button"
                onClick={handleDeleteServices}
                className="bg-main border font-semibold hover:text-main hover:bg-white hover:border-main text-white px-7 py-3 rounded"
                disabled={isReadOnly}
              >
                Delete
              </button>
            </div>

            {serviceValidationError && (
              <div className="text-red-500 font-semibold mb-4">
                {serviceValidationError}
              </div>
            )}
            {deleteError && (
              <div className="text-red-500 mb-4 font-semibold">{deleteError}</div>
            )}
            {errors.services && (
              <div className="text-red-500 mb-4 font-semibold">
                {errors.services.message}
              </div>
            )}

            <div className="h-auto bg-white rounded mb-6 border border-gray-200">
              <table className="w-full">
                <thead className="bg-main text-white text-sm font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="p-2 text-center">Select</th>
                    <th className="p-2 text-center">No.</th>
                    <th className="p-2">Services</th>
                    <th className="p-2">Description</th>
                    <th className="p-1 w-[100px]">Price(&pound;)</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={index} className="relative">
                      <td className="p-2 text-center">
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service.no)}
                          onChange={() => handleServiceSelect(service.no)}
                          className="mx-auto"
                          disabled={isReadOnly}
                        />
                      </td>
                      <td className="p-2 text-center">{service.no}</td>
                      <td className="p-2">
                        <div className="relative">
                          {service.isManualEdit ? (
                            <div className="flex flex-col">
                              <input
                                type="text"
                                className={`w-full p-1 border rounded text-sm ${errors.services?.[index]?.service ? "border-red-500" : ""
                                  }`}
                                value={service.service || ""}
                                onChange={(e) => handleServiceChange(index, e.target.value)}
                                onBlur={() => {
                                  const newServices = [...services];
                                  newServices[index].isDropdownOpen = false;
                                  setServices(newServices);
                                }}
                                disabled={isReadOnly}
                              />
                              {errors.services?.[index]?.service && (
                                <span className="text-red-500 text-xs mt-1">
                                  {errors.services[index]?.service?.message}
                                </span>
                              )}
                            </div>
                          ) : (
                            <>
                              <input
                                type="text"
                                className={`w-full p-1 border rounded text-sm ${errors.services?.[index]?.service ? "border-red-500" : ""
                                  }`}
                                value={service.searchTerm || ""}
                                placeholder="Search service..."
                                onChange={(e) => {
                                  const newServices = [...services];
                                  newServices[index] = {
                                    ...service,
                                    service: undefined,
                                    price: service.price,
                                    searchTerm: e.target.value,
                                    isDropdownOpen: true,
                                  };
                                  setServices(newServices);
                                  setActualTotal(
                                    calculateActualTotal(newServices, includeVAT)
                                  );
                                }}
                                onClick={() => {
                                  const newServices = [...services];
                                  newServices[index] = {
                                    ...service,
                                    isDropdownOpen: true,
                                  };
                                  setServices(newServices);
                                }}
                                onDoubleClick={() => handleManualEdit(index)}
                                disabled={isReadOnly}
                              />
                              {service.isDropdownOpen && (
                                <div className="absolute z-[1000] bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto min-w-[300px] left-0 top-full">
                                  {getFilteredServices(service.searchTerm || "").map(
                                    (masterService) => (
                                      <div
                                        key={masterService.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onMouseDown={(e) => {
                                          e.preventDefault();
                                          handleServiceSelection(index, masterService);
                                        }}
                                      >
                                        {masterService.service_name}
                                      </div>
                                    )
                                  )}
                                  <div
                                    className="p-2 hover:bg-gray-100 cursor-pointer text-blue-500"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleManualEdit(index);
                                    }}
                                  >
                                    
                                  </div>
                                </div>
                              )}
                              {errors.services?.[index]?.service && (
                                <span className="text-red-500 text-xs mt-1">
                                  {errors.services[index]?.service?.message}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          className="w-full p-1 border rounded text-sm"
                          value={service.description || ""}
                          onChange={(e) => handleDescriptionChange(index, e.target.value)}
                          placeholder="Enter description"
                          disabled={isReadOnly}
                        />
                      </td>
                      <td className="p-1">
                        <div className="flex flex-col w-[100px]">
                          <input
                            type="number"
                            className="w-full p-0.5 border border-black rounded text-right"
                            value={service.price}
                            onChange={(e) => handlePriceChange(index, e.target.value)}
                            disabled={isReadOnly}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {services.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-gray-500">
                        No services added yet
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
                  <span className="font-semibold text-gray-700">Estimate</span>
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
                onClick={() => navigate(-1)}
                className="bg-main text-white px-4 py-2 rounded hover:bg-white hover:text-main border hover:border-main flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              {createdAppointmentId && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  type="button"
                  className="bg-main text-white px-4 py-2 rounded hover:bg-white hover:text-main border hover:border-main"
                  href={`http://217.154.63.73:8000/api/quote/${createdAppointmentId}/`}
                >
                  Create Quote
                </a>
              )}
              {!createdAppointmentId && (
                <button
                  type="submit"
                  className="bg-main text-white px-4 py-2 rounded hover:bg-white hover:text-main border hover:border-main"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create Booking ID'}
                </button>
              )}
              {createdAppointmentId && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  type="button"
                  className="bg-main text-white px-4 py-2 rounded hover:bg-white hover:text-main border hover:border-main"
                  href={`http://217.154.63.73:8000/api/invoice/${createdAppointmentId}/`}
                >
                  Create Invoice
                </a>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  };
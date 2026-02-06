

import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { apiAxios } from "../../commonapicall/api/apiUrl";
import { toast } from "react-toastify";

/* ---------------- Schema ---------------- */
const schema = z.object({
  // OPTIONAL
  name: z.string().optional(),

  // REQUIRED
  invoice_date: z.string().min(1, "Invoice date is required"),

  customer_name: z.string().min(1, "Customer name is required"),

  vehicle_registration: z
    .string()
    .min(1, "Vehicle registration is required"),

  // OPTIONAL
  mileage: z.string().optional(),

  // REQUIRED: at least one service
  services: z
    .array(
      z.object({
        service: z.string().min(1, "Service is required"),
        price: z
          .number()
          .positive("Price must be greater than 0"),
        description: z.string().optional(),
      })
    )
    .min(1, "At least one service is required"),
});


interface ServiceRow {
  no: number;
  service?: string;
  description?: string;
  price: number;
  searchTerm?: string;
  isDropdownOpen?: boolean;
  isManualEdit?: boolean;
}


type FormData = z.infer<typeof schema>;

// interface ServiceRow {
//   no: number;
//   service: string;
//   price: number;
//   description?: string;
// }

interface Props {
  isOpen: boolean;
  onClose: () => void;
}



/* ---------------- Component ---------------- */
export const AddInvoiceWithoutAppointmentPopup = ({ isOpen, onClose }: Props) => {
  // const [services, setServices] = useState<ServiceRow[]>([]);
  const [includeVAT, setIncludeVAT] = useState(false);
  const [total, setTotal] = useState("0.00");
  const [loading, setLoading] = useState(false);

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [masterServices, setMasterServices] = useState<any[]>([]);


  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { services: [] },
  });

  /* ---------- Helpers ---------- */
  const calcTotal = (rows: ServiceRow[], vat: boolean) => {
    const sum = rows.reduce((a, b) => a + b.price, 0);
    return (vat ? sum * 1.2 : sum).toFixed(2);
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await apiAxios.get("/api/services/dropdown/");
        if (res.data?.status === "success") {
          setMasterServices(res.data.data);
        }
      } catch (err) {
        toast.error("Failed to load services");
      }
    };
    loadServices();
  }, []);

  const addServiceRow = () => {
    setServices(prev => [
      ...prev,
      {
        no: prev.length + 1,
        price: 0,
        searchTerm: "",
        isDropdownOpen: false,
        isManualEdit: false,
      },
    ]);
  };

  const getFilteredServices = (term: string) => {
    if (!term) return masterServices;
    return masterServices.filter(s =>
      s.service_name.toLowerCase().includes(term.toLowerCase())
    );
  };

  const handleServiceSelection = (index: number, master: any) => {
    const rows = [...services];
    rows[index] = {
      ...rows[index],
      service: master.service_name,
      price: Number(master.price),
      searchTerm: master.service_name,
      isDropdownOpen: false,
      isManualEdit: false,
    };
    setServices(rows);
  };

  const handleManualEdit = (index: number) => {
    const rows = [...services];
    rows[index].isManualEdit = true;
    rows[index].isDropdownOpen = false;
    setServices(rows);
  };

  const handleServiceChange = (index: number, value: string) => {
    const rows = [...services];
    rows[index].service = value;
    setServices(rows);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const rows = [...services];
    rows[index].description = value;
    setServices(rows);
  };

  const handlePriceChange = (index: number, value: string) => {
    const rows = [...services];
    rows[index].price = Number(value) || 0;
    setServices(rows);
  };

  const handleServiceSelect = (no: number) => {
    setSelectedServices(prev =>
      prev.includes(no)
        ? prev.filter(n => n !== no)
        : [...prev, no]
    );
  };

  useEffect(() => {
    setValue(
      "services",
      services.map(s => ({
        service: s.service || "",
        price: Number(s.price) || 0,
        description: s.description || "",
      })),
      { shouldValidate: false } // ⬅️ important
    );
  }, [services, setValue]);



  useEffect(() => {
    const sum = services.reduce(
      (acc, s) => acc + Number(s.price || 0),
      0
    );

    const final = includeVAT ? sum * 1.2 : sum;
    setTotal(final.toFixed(2));
  }, [services, includeVAT]);



  if (!isOpen) return null;



  const loadServices = async () => {
    try {
      const response = await apiAxios.get("/api/services/dropdown/");
      if (response.data?.status === "success") {
        setMasterServices(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      toast.error("Failed to load services");
    }
  };




  useEffect(() => {
    loadServices();
  }, []);


  const deleteSelectedServices = () => {
    setServices(prev =>
      prev
        .filter(s => !selectedServices.includes(s.no))
        .map((s, idx) => ({ ...s, no: idx + 1 }))
    );
    setSelectedServices([]);
  };


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        // booking_id: 'DIRECT-INVOICE',
        description: "",
        quantity: data.services.length,
        price: Number(total),
        vat: includeVAT ? 1 : 0,
        invoice_date: data.invoice_date,
        customer_name: data.customer_name,
        vehicle_registration: data.vehicle_registration,
        mileage: data.mileage || null,
        services: data.services.map(s => ({
          service: s.service,
          price: Number(s.price),
          description: s.description || "",
        })),
      };

      console.log("📦 Invoice Payload:", payload);

      const res = await apiAxios.post("api/appointmentinvoice/", payload);

      console.log("✅ FULL RESPONSE:", res);
      console.log("✅ RESPONSE DATA:", res.data);


      if (res.status === 201) {
        toast.success("Invoice created");
        onClose();
        
      } else {
        toast.error("Unexpected response from server");
      }


    } catch (e: any) {
      console.error("❌ AXIOS ERROR OBJECT:", e);

      console.error("❌ STATUS:", e.response?.status);
      console.error("❌ RESPONSE DATA:", e.response?.data);
      console.error("❌ RESPONSE HEADERS:", e.response?.headers);

      toast.error(
        e.response?.data?.message ||
        e.response?.data?.error ||
        "Unknown server error"
      );
    } finally {
      setLoading(false);
    }
  };




  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[900px] max-w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 relative">

        {/* Header */}
        <button onClick={onClose} className="flex items-center text-xl font-bold ms-auto absolute bg-black text-white px-2 rounded-full right-2 top-2">×</button>

        <div className="flex items-center justify-center mb-6">
          <h2 className="text-2xl font-bold text-main uppercase ">
            Add Invoice (No Appointment)
          </h2>

        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Info */}
          <div className="grid grid-cols-3 gap-4 mb-4 items-start">
            <div>
              <input
                {...register("name")}
                placeholder="Invoice Name"
                className="border px-3 py-3 rounded bg-aclightash w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="date"
                {...register("invoice_date")}
                className="border px-3 py-3 rounded bg-aclightash w-full"
              />
              {errors.invoice_date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.invoice_date.message}
                </p>
              )}
            </div>


            <div>
              <input
                {...register("customer_name")}
                placeholder="Customer Name"
                className="border px-3 py-3 rounded bg-aclightash w-full"
              />
              {errors.customer_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customer_name.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register("vehicle_registration")}
                placeholder="Vehicle Reg"
                className="border px-3 py-3 rounded bg-aclightash w-full"
              />
              {errors.vehicle_registration && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.vehicle_registration.message}
                </p>
              )}
            </div>

            <input {...register("mileage")} placeholder="Mileage" className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none" />
          </div>

          {/* Services */}
          {/* <table className="w-full border mb-4">
            <thead className="bg-main text-white">
              <tr>
                <th className="p-2">No</th>
                <th className="p-2">Service</th>
                <th className="p-2">Desc</th>
                <th className="p-2">Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={i}>
                  <td className="p-2 text-center">{s.no}</td>
                  <td className="p-2">
                    <input className="border p-1 w-full"
                      value={s.service}
                      onChange={e => updateService(i, "service", e.target.value)} />
                  </td>
                  <td className="p-2">
                    <input className="border p-1 w-full"
                      value={s.description || ""}
                      onChange={e => updateService(i, "description", e.target.value)} />
                  </td>
                  <td className="p-2">
                    <input type="number" className="border p-1 w-full text-right"
                      value={s.price}
                      onChange={e => updateService(i, "price", +e.target.value || 0)} />
                  </td>
                  <td>
                    <button type="button" onClick={() => deleteService(i)} className="text-red-500">✕</button>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr><td colSpan={5} className="text-center p-4 text-gray-400">No services</td></tr>
              )}
            </tbody>
          </table> */}

          <div className="flex justify-end gap-3 mb-3">
            <button
              type="button"
              onClick={addServiceRow}
              className="bg-main text-white px-4 py-2 rounded"
            >
              + Add Service
            </button>
            <button
              type="button"
              onClick={deleteSelectedServices}
              disabled={selectedServices.length === 0}
              className={`bg-main text-white px-4 py-2 rounded ${selectedServices.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
                }`}
            >
              Delete
            </button>

          </div>




          <div className="h-auto bg-white rounded mb-6 border border-gray-200">
            <table className="w-full">
              <thead className="bg-main text-white text-sm font-semibold sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-center">Select</th>
                  <th className="p-2 text-center">No.</th>
                  <th className="p-2">Service</th>
                  <th className="p-2">Description</th>
                  <th className="p-2 w-[120px] text-right">Price (£)</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className="relative border-b">
                    {/* Select */}
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.no)}
                        onChange={() => handleServiceSelect(service.no)}
                        className="cursor-pointer"
                      />
                    </td>

                    {/* No */}
                    <td className="p-2 text-center">{service.no}</td>

                    {/* Service */}
                    <td className="p-2 relative">
                      {service.isManualEdit ? (
                        <>
                          <input
                            type="text"
                            className={`w-full p-1 border rounded text-sm ${errors.services?.[index]?.service ? "border-red-500" : ""
                              }`}
                            value={service.service || ""}
                            onChange={(e) =>
                              handleServiceChange(index, e.target.value)
                            }
                            onBlur={() => {
                              const rows = [...services];
                              rows[index].isManualEdit = false;
                              setServices(rows);
                            }}
                          />
                          {errors.services?.[index]?.service && (
                            <span className="text-red-500 text-xs">
                              {errors.services[index]?.service?.message}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <input
                            type="text"
                            className={`w-full p-1 border rounded text-sm ${errors.services?.[index]?.service ? "border-red-500" : ""
                              }`}
                            placeholder="Search service..."
                            value={service.searchTerm || ""}
                            onChange={(e) => {
                              const rows = [...services];
                              rows[index] = {
                                ...service,
                                searchTerm: e.target.value,
                                isDropdownOpen: true,
                              };
                              setServices(rows);
                            }}
                            onClick={() => {
                              const rows = [...services];
                              rows[index].isDropdownOpen = true;
                              setServices(rows);
                            }}
                            onDoubleClick={() => handleManualEdit(index)}
                          />

                          {/* Dropdown */}
                          {service.isDropdownOpen && (
                            <div className="absolute left-0 top-full z-50 bg-white border rounded shadow-md max-h-48 overflow-y-auto w-full">
                              {getFilteredServices(service.searchTerm || "").map(
                                (master) => (
                                  <div
                                    key={master.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleServiceSelection(index, master);
                                    }}
                                  >
                                    {master.service_name}
                                  </div>
                                )
                              )}

                              {/* Manual Entry */}
                              <div
                                className="p-2 text-blue-500 hover:bg-gray-100 cursor-pointer"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  handleManualEdit(index);
                                }}
                              >
                                + Enter manually
                              </div>
                            </div>
                          )}

                          {errors.services?.[index]?.service && (
                            <span className="text-red-500 text-xs">
                              {errors.services[index]?.service?.message}
                            </span>
                          )}
                        </>
                      )}
                    </td>

                    {/* Description */}
                    <td className="p-2">
                      <input
                        type="text"
                        className="w-full p-1 border rounded text-sm"
                        placeholder="Description"
                        value={service.description || ""}
                        onChange={(e) =>
                          handleDescriptionChange(index, e.target.value)
                        }
                      />
                    </td>

                    {/* Price */}
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        className={`w-full p-1 border rounded text-right ${errors.services?.[index]?.price ? "border-red-500" : ""
                          }`}
                        value={service.price}
                        onChange={(e) =>
                          handlePriceChange(index, e.target.value)
                        }
                      />
                      {errors.services?.[index]?.price && (
                        <span className="text-red-500 text-xs block">
                          {errors.services[index]?.price?.message}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {services.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-400">
                      No services added
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {errors.services && (
            <p className="text-red-500 text-sm mt-2">
              {errors.services.message}
            </p>
          )}


          {/* Total */}
          <div className="flex justify-end items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={includeVAT}
                onChange={e => setIncludeVAT(e.target.checked)} />
              VAT 20%
            </label>
            <input readOnly value={total}
              className="border p-2 w-32 text-right font-semibold" />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="bg-main text-white px-6 py-2 rounded">
              {loading ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

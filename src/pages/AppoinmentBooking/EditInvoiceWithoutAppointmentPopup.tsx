import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { apiAxios } from "../../commonapicall/api/apiUrl";
import { toast } from "react-toastify";

/* ---------------- Schema ---------------- */
const schema = z.object({
  name: z.string().optional(),
  invoice_date: z.string().min(1, "Invoice date is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  vehicle_registration: z.string().min(1, "Vehicle registration is required"),
  mileage: z.string().optional(),
  services: z.array(
    z.object({
      service: z.string().min(1, "Service is required"),
      price: z.number().positive("Price must be greater than 0"),
      description: z.string().optional(),
    })
  ).min(1, "At least one service is required"),
});

type FormData = z.infer<typeof schema>;

interface ServiceRow {
  no: number;
  service?: string;
  description?: string;
  price: number;
  searchTerm?: string;
  isDropdownOpen?: boolean;
  isManualEdit?: boolean;
}

interface Props {
  isOpen: boolean;
  invoiceId: number | null;
  onClose: () => void;
  refreshData: () => void;
}

/* ---------------- Component ---------------- */
export const EditInvoiceWithoutAppointmentPopup = ({
  isOpen,
  invoiceId,
  onClose,
  refreshData,
}: Props) => {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [masterServices, setMasterServices] = useState<any[]>([]);
  const [includeVAT, setIncludeVAT] = useState(false);
  const [total, setTotal] = useState("0.00");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { services: [] },
  });

  /* ---------- Load dropdown services ---------- */
  useEffect(() => {
    apiAxios.get("/api/services/dropdown/")
      .then(res => setMasterServices(res.data?.data || []))
      .catch(() => toast.error("Failed to load services"));
  }, []);

  /* ---------- Load invoice details ---------- */
  useEffect(() => {
    if (!isOpen || !invoiceId) return;

    const loadInvoice = async () => {
      try {
        const res = await apiAxios.get(
          `/api/appointmentinvoice/${invoiceId}/`
        );
        const inv = res.data;

        setValue("name", inv.name || "");
        setValue("invoice_date", inv.invoice_date);
        setValue("customer_name", inv.customer_name);
        setValue("vehicle_registration", inv.vehicle_registration);
        setValue("mileage", inv.mileage || "");
        setIncludeVAT(inv.vat === 1);

        const rows: ServiceRow[] = inv.services.map(
          (s: any, i: number) => ({
            no: i + 1,
            service: s.service,
            description: s.description,
            price: Number(s.price),
            searchTerm: s.service,
          })
        );

        setServices(rows);
      } catch {
        toast.error("Failed to load invoice");
      }
    };

    loadInvoice();
  }, [isOpen, invoiceId, setValue]);

  /* ---------- Sync services to form ---------- */
  useEffect(() => {
    setValue(
      "services",
      services.map(s => ({
        service: s.service || "",
        price: Number(s.price) || 0,
        description: s.description || "",
      })),
      { shouldValidate: false }
    );
  }, [services, setValue]);

  /* ---------- Total ---------- */
  useEffect(() => {
    const sum = services.reduce((a, b) => a + Number(b.price || 0), 0);
    setTotal((includeVAT ? sum * 1.2 : sum).toFixed(2));
  }, [services, includeVAT]);

  if (!isOpen) return null;

  /* ---------- Helpers ---------- */
  const addServiceRow = () =>
    setServices(p => [...p, { no: p.length + 1, price: 0 }]);

  const deleteSelectedServices = () => {
    setServices(p =>
      p.filter(s => !selectedServices.includes(s.no))
        .map((s, i) => ({ ...s, no: i + 1 }))
    );
    setSelectedServices([]);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!invoiceId) return;

    setLoading(true);
    try {
      await apiAxios.put(
        `/api/appointmentinvoice/${invoiceId}/`,
        {
          name: data.name,
          quantity: data.services.length,
          price: Number(total),
          vat: includeVAT ? 1 : 0,
          invoice_date: data.invoice_date,
          customer_name: data.customer_name,
          vehicle_registration: data.vehicle_registration,
          mileage: data.mileage || null,
          services: data.services,
        }
      );

      toast.success("Invoice updated successfully");
      refreshData();
      onClose();
    } catch (e: any) {
      toast.error(
        e.response?.data?.message ||
        "Failed to update invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Service helpers ---------- */

// checkbox select
const handleServiceSelect = (no: number) => {
  setSelectedServices(prev =>
    prev.includes(no)
      ? prev.filter(n => n !== no)
      : [...prev, no]
  );
};

// service text change (manual)
const handleServiceChange = (index: number, value: string) => {
  const rows = [...services];
  rows[index].service = value;
  rows[index].searchTerm = value;
  setServices(rows);
};

// description change
const handleDescriptionChange = (index: number, value: string) => {
  const rows = [...services];
  rows[index].description = value;
  setServices(rows);
};

// price change
const handlePriceChange = (index: number, value: string) => {
  const rows = [...services];
  rows[index].price = Number(value);
  setServices(rows);
};

// enable manual edit
const handleManualEdit = (index: number) => {
  const rows = [...services];
  rows[index].isManualEdit = true;
  rows[index].isDropdownOpen = false;
  setServices(rows);
};

// dropdown filter
const getFilteredServices = (term: string) => {
  if (!term) return masterServices;
  return masterServices.filter((s: any) =>
    s.service_name.toLowerCase().includes(term.toLowerCase())
  );
};

// select service from dropdown
const handleServiceSelection = (index: number, master: any) => {
  const rows = [...services];
  rows[index] = {
    ...rows[index],
    service: master.service_name,
    searchTerm: master.service_name,
    price: Number(master.price || 0),
    isDropdownOpen: false,
    isManualEdit: false,
  };
  setServices(rows);
};


  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black text-white px-2 rounded-full"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-main text-center mb-6 uppercase">
          Edit Invoice (No Appointment)
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Same form UI as Add popup */}
          {/* 👉 Reuse the SAME JSX you already have below this line */}
          {/* Nothing changes visually */}
          {/* Only submit button text below */}

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


          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-main text-white px-6 py-2 rounded"
            >
              {loading ? "Updating..." : "Update Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

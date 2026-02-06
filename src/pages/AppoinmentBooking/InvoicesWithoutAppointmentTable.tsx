import React, { useEffect, useState } from "react";
import { MdDelete, MdDownload, MdRemoveRedEye } from "react-icons/md";
import axios from "axios";
import { Pagination } from "../../common/Pagination";
import { TableShimmer } from "../../components/Shimmer/TableShimmer";
import { IoCloseCircle } from "react-icons/io5";
import { EditInvoiceWithoutAppointmentPopup } from "./EditInvoiceWithoutAppointmentPopup";

interface Invoice {
  id: number;
  customer_name: string;
  vehicle_registration: string;
  invoice_date: string;
  price: string;
  vat: number;
}

export const InvoicesWithoutAppointmentTable = () => {
  const [data, setData] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalCount, setTotalCount] = useState(0);

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://217.154.63.73:8000/api/appointmentinvoice/",
        {
          params: {
            page: currentPage,
            page_size: itemsPerPage,
          },
        }
      );

      const results =
        res.data?.results?.data || // case: { results: { data: [] } }
        res.data?.results ||       // case: { results: [] }
        res.data ||                // case: []
        [];

      // setData(results);

      const sortedResults = [...results].sort(
        (a: Invoice, b: Invoice) => b.id - a.id
      );

      setData(sortedResults);

      setTotalCount(
        res.data?.count || results.length || 0
      );
    } catch (err) {
      console.error("Failed to fetch invoices", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchInvoices();
  }, [currentPage, itemsPerPage]);

  const handlePDF = async (id: number) => {
    const res = await axios.get(
      `http://217.154.63.73:8000/api/invoice/${id}/`,
      { responseType: "blob" }
    );

    const fileURL = URL.createObjectURL(new Blob([res.data]));
    window.open(fileURL, "_blank");
  };

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      setDeleteLoading(true);
      setError("");

      await axios.delete(
        `http://217.154.63.73:8000/api/appointmentinvoice/${selectedId}/`
      );

      // Refresh table data
      fetchInvoices();

      // Close popup
      setShowDeletePopup(false);
      setSelectedId(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete invoice. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const [showEditPopup, setShowEditPopup] = useState(false);
  // const [selectedId, setSelectedId] = useState<number | null>(null);


  return (
    <>


      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-main text-white">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">VEHICLE</th>
                <th className="px-6 py-3 text-left">CUSTOMER</th>
                <th className="px-6 py-3 text-left">DATE</th>
                <th className="px-6 py-3 text-left">VAT</th>
                <th className="px-6 py-3 text-left">TOTAL (£)</th>
                <th className="px-6 py-3 text-center">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableShimmer columnCount={7} />
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    No Invoices Found
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{item.id}</td>
                    <td className="px-6 py-4">
                      {item.vehicle_registration}
                    </td>
                    <td className="px-6 py-4">
                      {item.customer_name}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {item.invoice_date}
                    </td>
                    <td className="px-6 py-4">
                      {item.vat ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      £{item.price}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <ActionBtn
                          icon={<MdRemoveRedEye />}
                          onClick={() => {
                            setSelectedId(item.id);
                            setShowEditPopup(true);
                          }}
                        />
                        <ActionBtn
                          icon={<MdDownload />}
                          onClick={() => handlePDF(item.id)}
                        />
                        <ActionBtn
                          icon={<MdDelete />}
                          onClick={() => {
                            setSelectedId(item.id);
                            setShowDeletePopup(true);
                            setError("");
                          }}
                        />

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Showing 1 to {data.length} of {totalCount} results
          </p>

          <Pagination
            currentPage={currentPage}
            totalItems={totalCount}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(v) => {
              setItemsPerPage(v);
              setCurrentPage(1);
            }}
          />
        </div>


      </div>

  {showEditPopup && selectedId && (
  <EditInvoiceWithoutAppointmentPopup
    isOpen={showEditPopup}
    invoiceId={selectedId}
    onClose={() => {
      setShowEditPopup(false);
      setSelectedId(null);
    }}
    refreshData={fetchInvoices}
  />
)}



      {showDeletePopup && selectedId && (
        <div className="fixed inset-0 bg-[#0000005e] bg-opacity-100 flex justify-center items-center z-50">
          <div className="container mx-auto">
            <div className="relative bg-white rounded-[5px] w-4/12 mx-auto px-5 py-5">
              <div className="relative mb-10">
                <h2 className="text-2xl text-black font-semibold pb-3 border-b-2 border-gray-100">
                  Delete Booking & Invoice
                </h2>
                <div className="absolute inset-x-0 bottom-[-20px] mx-auto rounded-md w-full h-0.5"></div>
              </div>

              {/* Close Button */}
              <div
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedId(null);
                }}
                className="absolute top-5 right-5 w-fit cursor-pointer"
              >
                <IoCloseCircle className="text-[32px]" />
              </div>

              {/* Content */}
              <div className="text-center">
                <p className="text-lg text-black">
                  Are you sure you want to delete?
                </p>

                {error && (
                  <p className="text-sm text-red-600 mt-2">{error}</p>
                )}

                {/* Buttons */}
                <div className="pt-5">
                  <div className="flex items-center justify-center space-x-5">
                    {/* Cancel Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeletePopup(false);
                        setSelectedId(null);
                      }}
                      className="px-7 py-2.5 text-black rounded-sm font-semibold hover:bg-gray-200 cursor-pointer"
                    >
                      Cancel
                    </button>

                    {/* Submit Button */}
                    <button
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="bg-main text-lg text-white font-semibold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-white hover:text-main hover:border-main disabled:opacity-60"
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

/* ACTION BUTTON */
const ActionBtn = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-main text-white p-1 rounded-full hover:bg-white hover:text-main border border-main"
  >
    {icon}
  </button>
);

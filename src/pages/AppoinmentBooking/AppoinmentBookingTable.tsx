import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import {
  MdAdd,
  MdDelete,
  MdDownload,
  MdEmail,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdRemoveRedEye,
} from "react-icons/md";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pagination } from "../../common/Pagination";
import { TableShimmer } from "../../components/Shimmer/TableShimmer";
import { DeleteAppointmentBookingPopup } from "./DeleteAppointmentBookingPopup";
import { MailerPopup } from "./MailerAppointment";
import { EditAppointmentBookingPopup } from "./EditAppointmentBookingPopup";
import { AddAppointmentPopup } from "./AddAppointmentPopup";
import { AddInvoicePopup } from "./AddInvoicePopup";
import { AddInvoiceWithoutAppointmentPopup } from "./AddInvoiceWithoutAppointmentPopup";
import { AppointmentBooking } from "../../commonapicall/AppointmentBookingapis/AppointmentBookingapis";
import { HiOutlineCalendar, HiOutlineDocumentText, HiOutlineDocumentAdd } from "react-icons/hi";
import { InvoicesWithoutAppointmentTable } from "./InvoicesWithoutAppointmentTable";

interface Appointment {
  id: number;
  registration_number: string;
  customer_name: string;
  date: string;
  total_estimate: string;
}

type ActiveTab =
  | "appointments"
  | "invoices"
  | "invoicesWithoutAppointments";

export const AppoinmentBookingTable = () => {
  // const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState<ActiveTab>("appointments");

  const [data, setData] = useState<Appointment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalCount, setTotalCount] = useState(0);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showMailerPopup, setShowMailerPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);


  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showAddInvoicePopup, setShowAddInvoicePopup] = useState(false);
  const [showAddInvoiceWithoutApptPopup, setShowAddInvoiceWithoutApptPopup] = useState(false);


  /* ---------------- FETCH DATA ---------------- */
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await AppointmentBooking(
        currentPage,
        search.trim(),
        itemsPerPage.toString()
      );

      setData(response?.results?.data || []);
      setTotalCount(response?.count || 0);
    } catch (error) {
      console.error(error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, search, itemsPerPage, activeTab]);

  /* ---------------- PDF ---------------- */
  const handlePDF = async (
    id: number,
    type: "quote" | "invoice",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    const url =
      type === "quote"
        ? `/api/quote/${id}/`
        : `/api/invoice/${id}/`;

    const res = await axios.get(
      `http://217.154.63.73:8000${url}`,
      { responseType: "blob" }
    );

    const fileURL = URL.createObjectURL(new Blob([res.data]));
    window.open(fileURL, "_blank");
  };


  return (
    <div className="min-h-screen bg-[#f4f6f9] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= HEADER CARD ================= */}
        <div className="bg-white rounded-xl shadow-sm">

          {/* Tabs + Add */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex gap-3">
              {[
                ["appointments", "Appointments List"],
                ["invoices", "Invoices List"],
                ["invoicesWithoutAppointments", "Invoices Without Appointments"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as ActiveTab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium border
                    ${activeTab === key
                      ? "bg-main text-white border-main"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative">
              {/* Add Button */}
              <button
                onClick={() => setShowAddMenu((prev) => !prev)}
                // onMouseEnter={() => setShowAddMenu((prev) => !prev)}
                // onMouseLeave={() => setShowAddMenu((prev) => !prev)}
                className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
              >
                <MdAdd className="text-lg" />
                Add
                {showAddMenu ? (
                  <MdKeyboardArrowUp className="text-lg" />
                ) : (
                  <MdKeyboardArrowDown className="text-lg" />
                )}
              </button>

              {/* Dropdown */}
              {showAddMenu && (
                <div className="absolute right-0 mt-2 w-[300px] bg-white rounded-xl shadow-xl border z-50 overflow-hidden">

                  {/* Item 1 */}
                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      setShowAddPopup(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-a hover:bg-gray-50"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-600">
                      <HiOutlineCalendar className="text-xl" />
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      Add Appointment
                    </span>
                  </button>

                  <div className="h-px bg-gray-100" />

                  {/* Item 2 */}
                  <button
                    onClick={() => {
                      setShowAddMenu(false);
                      setShowAddInvoicePopup(true);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-4 hover:bg-gray-50"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <HiOutlineDocumentText className="text-xl" />
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      Add Invoice
                    </span>
                  </button>

                  <div className="h-px bg-gray-100" />

                  {/* Item 3 */}
                  <button
                    // onClick={() => {
                    //   setShowAddMenu(false);
                    //   setShowAddInvoiceWithoutApptPopup(true);
                    // }}
                    onClick={() => setShowAddInvoiceWithoutApptPopup(true)}
                    className="w-full flex items-center gap-2 px-4 py-4 hover:bg-gray-50"
                  >
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <HiOutlineDocumentAdd className="text-xl" />
                    </span>
                    <span className="text-sm font-medium text-start text-gray-800">
                      Add Invoice without Appointment
                    </span>
                  </button>
                </div>
              )}
            </div>



          </div>

          {/* Title + Search */}
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                All Records
              </h2>
              <p className="text-sm text-gray-500">
                View and manage selected category.
              </p>
            </div>

            <div className="relative w-[260px]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, Name or Car..."
                className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main"
              />
              <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        {/* ================= TABLE CARD ================= */}
        {activeTab === "appointments" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-main text-white">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">CAR</th>
                  <th className="px-6 py-3 text-left">CUSTOMER NAME</th>
                  <th className="px-6 py-3 text-left">DATE</th>
                  <th className="px-6 py-3 text-left">PRICE (£)</th>
                  <th className="px-6 py-3 text-center">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <TableShimmer columnCount={6} />
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      No Records Found
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedId(item.id);
                        setShowEditPopup(true);
                      }}
                    >
                      <td className="px-6 py-4">{item.id}</td>
                      <td className="px-6 py-4">
                        {item.registration_number}
                      </td>
                      <td className="px-6 py-4">
                        {item.customer_name}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {item.date}
                      </td>
                      <td className="px-6 py-4">
                        {item.total_estimate}
                      </td>

                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center gap-2">
                          <ActionBtn
                            icon={<MdEmail />}
                            onClick={() => {
                              setSelectedId(item.id);
                              setShowMailerPopup(true);
                            }}
                          />
                          <ActionBtn
                            icon={<MdDownload />}
                            onClick={(e) =>
                              handlePDF(item.id, "quote", e)
                            }
                          />
                          <ActionBtn
                            icon={<MdRemoveRedEye />}
                            onClick={() => {
                              setSelectedId(item.id);
                              setShowEditPopup(true);
                            }}
                          />
                          <ActionBtn
                            icon={<MdDelete />}
                            onClick={() => {
                              setSelectedId(item.id);
                              setShowDeletePopup(true);
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

          {/* Footer */}
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
        )}

{activeTab === "invoicesWithoutAppointments" && (
  <InvoicesWithoutAppointmentTable />
)}

      </div>

      {/* ================= POPUPS ================= */}
      {showDeletePopup && selectedId && (
        <DeleteAppointmentBookingPopup
          appointmentId={selectedId}
          onClose={() => setShowDeletePopup(false)}
          refreshData={fetchData}
        />
      )}

      {showMailerPopup && selectedId && (
        <MailerPopup
          appointmentId={selectedId}
          onClose={() => setShowMailerPopup(false)}
          refreshData={fetchData}
        />
      )}

      {showEditPopup && selectedId && (
        <EditAppointmentBookingPopup
          appointmentId={selectedId}
          onClose={() => {
            setShowEditPopup(false);
            setSelectedId(null);
          }}
          refreshData={fetchData}
        />
      )}

      {showAddPopup && (
        <AddAppointmentPopup
          onClose={() => setShowAddPopup(false)}
          refreshData={fetchData}
        />
      )}

      {showAddInvoicePopup && (
        <AddInvoicePopup
          onClose={() => setShowAddInvoicePopup(false)}
          refreshData={fetchData}
        />
      )}

      {showAddInvoiceWithoutApptPopup && (
        <AddInvoiceWithoutAppointmentPopup
          isOpen={showAddInvoiceWithoutApptPopup}
          onClose={() => setShowAddInvoiceWithoutApptPopup(false)}
        />

      )}
    </div>
  );
};

/* ================= ACTION BUTTON ================= */
const ActionBtn = ({
  icon,
  onClick,
}: {
  icon: React.ReactNode;
  onClick: (e?: any) => void;
}) => (
  <button
    onClick={onClick}
    className="bg-main text-white p-1 rounded-full ml-4 hover:text-main hover:bg-white hover:border-main border-1"
  >
    {icon}
  </button>
);
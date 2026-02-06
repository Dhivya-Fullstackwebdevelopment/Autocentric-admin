import React, { useEffect, useState } from "react";
import { MdDownload, MdEmail, MdRemoveRedEye, MdDelete } from "react-icons/md";
import { TableShimmer } from "../../components/Shimmer/TableShimmer";
import { Pagination } from "../../common/Pagination";
import { apiAxios } from "../../commonapicall/api/apiUrl";
import { InvoiceMailerPopup } from "./MailerInvoicelist";
import { EditInvoicePopup } from "./EditInvoicePopup";
import { DeleteInvoicePopup } from "./DeleteInvoicePopup";

interface Invoice {
    id: number;
    name: string;
    booking_id: string;
    customer_name: string;
    invoice_date: string | null;
    price: string;
    vehicle_registration: string | null;
}

export const InvoicesTable = ({ search, refreshKey }: { search: string, refreshKey: number; }) => {
    const [data, setData] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(8);
    const [totalCount, setTotalCount] = useState(0);
    const [showMailer, setShowMailer] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editInvoiceId, setEditInvoiceId] = useState<number | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [deleteInvoiceId, setDeleteInvoiceId] = useState<number | null>(null);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const response = await apiAxios.get(`api/invoice_new/`, {
                params: {
                    page: currentPage,
                    search: search,
                    limit: itemsPerPage
                }
            });
            const results = Array.isArray(response.data) ? response.data : response.data.results;
            const count = response.data.count || results.length;

            setData(results || []);
            setTotalCount(count || 0);
        } catch (error) {
            console.error("Error fetching invoices:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, [currentPage, search, itemsPerPage, refreshKey]);


    const handlePDF = async (
        id: number,
        e: React.MouseEvent
    ) => {
        e.stopPropagation();

        try {
            const res = await apiAxios.get(
                `/api/invoice_new/${id}/invoice_pdf`,
                { responseType: "blob" }
            );

            const fileURL = URL.createObjectURL(
                new Blob([res.data], { type: "application/pdf" })
            );

            window.open(fileURL, "_blank");
        } catch (error) {
            console.error("Failed to download invoice PDF", error);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-main text-white">
                            <tr>
                                <th className="px-6 py-3 text-left">ID</th>
                                <th className="px-6 py-3 text-left">REG NO</th>
                                <th className="px-6 py-3 text-left">CUSTOMER NAME</th>
                                <th className="px-6 py-3 text-left">DATE</th>
                                <th className="px-6 py-3 text-left">TOTAL (£)</th>
                                <th className="px-6 py-3 text-center">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <TableShimmer columnCount={6} />
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-10 text-center text-gray-500">
                                        No Invoices Found
                                    </td>
                                </tr>
                            ) : (
                                data.map((invoice) => (
                                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium ">
                                            {invoice.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            {invoice.vehicle_registration || "N/A"}
                                        </td>
                                        <td className="px-6 py-4">{invoice.customer_name}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {invoice.invoice_date || "Pending"}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {invoice.price}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <ActionBtn
                                                    icon={<MdEmail />}
                                                    onClick={() => {
                                                        setSelectedInvoiceId(invoice.id);
                                                        setShowMailer(true);
                                                    }}
                                                />
                                                <ActionBtn
                                                    icon={<MdDownload />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        void handlePDF(invoice.id, e);
                                                    }}
                                                />

                                                <ActionBtn
                                                    icon={<MdRemoveRedEye />}
                                                    onClick={() => {
                                                        setEditInvoiceId(invoice.id);
                                                        setShowEditPopup(true);
                                                    }}
                                                />
                                                <ActionBtn
                                                    icon={<MdDelete />}
                                                    onClick={() => {
                                                        setDeleteInvoiceId(invoice.id);
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

                <div className="px-6 py-4 flex justify-between items-center border-t">
                    <p className="text-sm text-gray-500">
                        Showing {data.length} of {totalCount} invoices
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
            {
                showMailer && selectedInvoiceId && (
                    <InvoiceMailerPopup
                        invoiceId={selectedInvoiceId}
                        onClose={() => {
                            setShowMailer(false);
                            setSelectedInvoiceId(null);
                        }}
                    />
                )
            }
            {showEditPopup && editInvoiceId && (
                <EditInvoicePopup
                    invoiceId={editInvoiceId}
                    onClose={() => {
                        setShowEditPopup(false);
                        setEditInvoiceId(null);
                    }}
                    refreshData={fetchInvoices}
                />
            )}
            {showDeletePopup && deleteInvoiceId && (
                <DeleteInvoicePopup
                    invoiceId={deleteInvoiceId}
                    onClose={() => {
                        setShowDeletePopup(false);
                        setDeleteInvoiceId(null);
                    }}
                    refreshData={fetchInvoices}
                />
            )}

        </>
    );
};

const ActionBtn = ({ icon, onClick }: { icon: React.ReactNode; onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) => (
    <button
        onClick={onClick}
        className="bg-main text-white p-1.5 rounded-full hover:bg-white hover:text-main border border-transparent hover:border-main transition-all"
    >
        {icon}
    </button>
);
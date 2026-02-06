import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { apiAxios } from "../../commonapicall/api/apiUrl";

interface DeleteInvoicePopupProps {
  onClose: () => void;
  invoiceId: number;
  refreshData?: () => void;
}

export const DeleteInvoicePopup: React.FC<DeleteInvoicePopupProps> = ({
  onClose,
  invoiceId,
  refreshData,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    try {
      await apiAxios.delete(`/api/invoice_new/${invoiceId}/`);
      refreshData?.();
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete invoice"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0000005e] flex justify-center items-center z-50">
      <div className="relative bg-white rounded-[5px] w-4/12 px-6 py-6">

        {/* Header */}
        <div className="mb-6 border-b pb-3">
          <h2 className="text-2xl font-semibold text-black">
            Delete Invoice
          </h2>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <IoCloseCircle className="text-[32px]" />
        </button>

        {/* Content */}
        <div className="text-center">
          <p className="text-lg">
            Are you sure you want to delete this invoice?
          </p>

          {error && (
            <p className="text-sm text-red-600 mt-3">{error}</p>
          )}

          <div className="pt-6 flex justify-center gap-5">
            <button
              onClick={onClose}
              className="px-7 py-2.5 font-semibold hover:bg-gray-200"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-main text-white font-semibold px-8 py-2 border rounded-sm hover:bg-white hover:text-main hover:border-main disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

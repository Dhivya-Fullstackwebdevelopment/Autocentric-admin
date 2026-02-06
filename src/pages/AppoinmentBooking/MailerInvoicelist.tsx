import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import { apiAxios } from "../../commonapicall/api/apiUrl";

interface InvoiceMailerPopupProps {
    onClose: () => void;
    invoiceId: number;
    refreshData?: () => void;
}

interface ApiResponse {
    success?: boolean;
    message?: string;
    error?: string;
}

interface FormErrors {
    to_address?: string;
    subject?: string;
}

export const InvoiceMailerPopup: React.FC<InvoiceMailerPopupProps> = ({
    onClose,
    invoiceId,
    refreshData,
}) => {
    const [formData, setFormData] = useState({
        to_address: "",
        subject: "",
        message: "",
        include_invoice: true,
        include_quote: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSending, setIsSending] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (!formData.to_address) {
            newErrors.to_address = "Recipient email is required";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Subject is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSend = async () => {
        if (!validateForm()) return;

        setIsSending(true);

        try {
            const response = await apiAxios.post(
                "api/billing/send-mail/",
                {
                    bill_id: invoiceId,
                    email_to: formData.to_address,
                    subject: formData.subject,
                    mail_message: formData.message,
                    include_invoice: true, // ✅ as per API
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data: ApiResponse = response.data;

            if (data.success === false || data.error) {
                throw new Error(data.error || data.message || "Failed to send email");
            }

            toast.success("Invoice email sent successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            refreshData?.();
            onClose();
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "Failed to send email"
            );
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0000005e] flex justify-center items-center z-50">
            <div className="container mx-auto">
                <div className="relative bg-white rounded-[5px] w-5/12 mx-auto px-5 py-5">

                    {/* Header */}
                    <div className="relative mb-6">
                        <h2 className="text-2xl text-black font-semibold pb-3 border-b-2 border-gray-100">
                            Send Invoice Email
                        </h2>
                    </div>

                    {/* Close Button */}
                    <div
                        onClick={onClose}
                        className="absolute top-5 right-5 w-fit cursor-pointer"
                    >
                        <IoCloseCircle className="text-[32px]" />
                    </div>

                    {/* Content */}
                    <div className="mt-4 space-y-4">
                        {/* To */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                To<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="to_address"
                                value={formData.to_address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-main"
                                placeholder="Recipient email address"
                            />
                            {errors.to_address && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.to_address}
                                </p>
                            )}
                        </div>

                        {/* Subject */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-main"
                                placeholder="Subject"
                            />
                            {errors.subject && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                name="message"
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-main"
                                placeholder="Email message"
                            />
                        </div>

                        {/* Radio Buttons */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    checked={formData.include_invoice}
                                    onChange={() =>
                                        setFormData((p) => ({
                                            ...p,
                                            include_invoice: true,
                                            include_quote: false,
                                        }))
                                    }
                                    className="h-4 w-4 text-main focus:ring-main border-gray-300"
                                />
                                <label className="ml-2 text-sm text-gray-700">
                                    Attach Invoice
                                </label>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="pt-6 flex justify-center space-x-5">
                            <button
                                onClick={onClose}
                                disabled={isSending}
                                className="px-7 py-2.5 font-semibold hover:bg-gray-200"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSend}
                                disabled={isSending}
                                className="bg-main text-lg text-white font-semibold border rounded-sm px-8 py-2 hover:bg-white hover:text-main hover:border-main disabled:opacity-50"
                            >
                                {isSending ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

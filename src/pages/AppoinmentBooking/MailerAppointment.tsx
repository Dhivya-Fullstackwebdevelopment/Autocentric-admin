// MailerPopup.tsx
import React, { useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { toast } from 'react-toastify'; // Import toast library

interface MailerPopupProps {
    onClose: () => void;
    appointmentId: number;
    refreshData?: () => void;
}

interface ApiResponse {
    success?: boolean;
    message?: string;
    error?: string;
}

interface FormErrors {
    to_address?: string;
    message?: string;
    subject?: string;
}

export const MailerPopup: React.FC<MailerPopupProps> = ({
    onClose,
    appointmentId,
    refreshData
}) => {
    const [formData, setFormData] = useState({
        to_address: '',
        message: '',
        subject: '',
        include_invoice: true,
        include_quote: false
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [, setApiError] = useState<string | null>(null);
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};

        // Email validation
        if (!formData.to_address) {
            newErrors.to_address = 'Recipient email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.to_address)) {
                newErrors.to_address = 'Please enter a valid email address';
            }
        }

        // Subject validation
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSend = async () => {
        setApiError(null);

        if (!validateForm()) {
            return;
        }

        setIsSending(true);

        try {
            const response = await fetch('http://217.154.63.73:8000/api/send-appointment-email/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    appointment_id: appointmentId,
                    to_address: formData.to_address,
                    message: formData.message,
                    subject: formData.subject,
                    include_invoice: formData.include_invoice,
                    include_quote: formData.include_quote
                }),
            });

            const data: ApiResponse = await response.json();

            // if (!response.ok) {
            //     throw new Error(data.error || data.message || 'Failed to send email');
            // }

            // Check if the API response indicates success
            if (data.success === false || data.error) {
                throw new Error(data.error || data.message || 'Failed to send email');
            }

            // Show success toast message
            toast.success('Email sent successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

            if (refreshData) {
                refreshData();
            }

            onClose();


        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[#0000005e] bg-opacity-100 flex justify-center items-center z-50">
            <div className="container mx-auto">
                <div className="relative bg-white overflow-y-auto rounded-[5px] w-5/12 mx-auto px-5 py-5">
                    <div className="relative mb-6">
                        <h2 className="text-2xl text-black font-semibold pb-3 border-b-2 border-gray-100">Send Email</h2>
                        <div className="absolute inset-x-0 bottom-[-20px] mx-auto rounded-md w-full h-0.5"></div>
                    </div>

                    {/* Close Button */}
                    <div
                        onClick={onClose}
                        className="absolute top-5 right-5 w-fit cursor-pointer"
                    >
                        <IoCloseCircle className="text-[32px]" />
                    </div>

                    {/* Content */}
                    <div className="mt-4">


                        <div className="space-y-4">
                            {/* To Field */}
                            <div>
                                <label htmlFor="to_address" className="block text-sm font-medium text-gray-700 mb-1">
                                    To<span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type="email"
                                    id="to_address"
                                    name="to_address"
                                    value={formData.to_address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-main"
                                    placeholder="Recipient email address"
                                />
                                {errors.to_address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.to_address}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                    Subject<span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-main"
                                    placeholder="Subject"
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                )}
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-main"
                                    placeholder="Email message"
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                )}
                            </div>

                            {/* Radio Buttons */}
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="include_invoice"
                                        name="attachment_type"
                                        value="invoice"
                                        checked={formData.include_invoice}
                                        onChange={() =>
                                            setFormData(prev => ({
                                                ...prev,
                                                include_invoice: true,
                                                include_quote: false,
                                            }))
                                        }
                                        className="h-4 w-4 text-main focus:ring-main border-gray-300"
                                    />
                                    <label htmlFor="include_invoice" className="ml-2 block text-sm text-gray-700">
                                        Attach Invoice
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="include_quote"
                                        name="attachment_type"
                                        value="quote"
                                        checked={formData.include_quote}
                                        onChange={() =>
                                            setFormData(prev => ({
                                                ...prev,
                                                include_invoice: false,
                                                include_quote: true,
                                            }))
                                        }
                                        className="h-4 w-4 text-main focus:ring-main border-gray-300"
                                    />
                                    <label htmlFor="include_quote" className="ml-2 block text-sm text-gray-700">
                                        Attach Quote
                                    </label>
                                </div>
                            </div>

                        </div>

                        {/* Buttons */}
                        <div className="pt-6 mt-4">
                            <div className="flex items-center justify-center space-x-5">
                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-7 py-2.5 text-black rounded-sm font-semibold hover:bg-gray-200 cursor-pointer"
                                    disabled={isSending}
                                >
                                    Cancel
                                </button>

                                {/* Send Button */}
                                <button
                                    onClick={handleSend}
                                    disabled={isSending}
                                    className="bg-main text-lg text-white font-semibold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-white hover:text-main hover:border-main disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSending ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
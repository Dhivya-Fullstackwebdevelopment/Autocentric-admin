import React, { useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import { DeleteCustomerInfo } from '../../commonapicall/CutomerInfoapis/CutomerInfoapis';

interface DeleteCustomerInfoPopupProps {
    closePopup: () => void;
    customerId: number; // Add customerId to identify which customer to delete
    refreshData: () => void; // Add refreshData to update the list after deletion
}

export const DeleteCustomerInfoPopup: React.FC<DeleteCustomerInfoPopupProps> = ({
    closePopup,
    customerId,
    refreshData,
}) => {
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setError(null);

        try {
            await DeleteCustomerInfo(customerId);
            refreshData(); // Refresh the customer list
            closePopup(); // Close the popup after successful deletion
        } catch (error: any) {
            setError(error.message);
        }
        // finally {
        //     setIsDeleting(false);
        // }
    };
    return (
        <div className="fixed inset-0 bg-[#0000005e] bg-opacity-100 flex justify-center items-center z-50">
            <div className="container mx-auto">
                <div className="relative bg-white rounded-[5px] w-4/12 mx-auto px-5 py-5">
                    <div className="relative mb-10">
                        <h2 className="text-2xl text-black font-semibold pb-3 border-b-2 border-gray-100 ">Delete Customer Info</h2>
                        <div className="absolute inset-x-0 bottom-[-20px] mx-auto rounded-md w-full h-0.5"></div>
                    </div>

                    {/* Close Button */}
                    <div
                        onClick={closePopup}
                        className="absolute top-5 right-5 w-fit cursor-pointer"
                    >
                        <IoCloseCircle className="text-[32px]" />
                    </div>

                    {/* Content */}
                    <div className="text-center">
                        <p className="text-lg text-black">
                            Are you sure you want to delete?
                        </p>

                       {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

                        {/* Buttons */}
                        <div className="pt-5">
                            <div className="flex items-center justify-center space-x-5">
                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    onClick={closePopup}
                                    className="px-7 py-2.5 text-black rounded-sm font-semibold hover:bg-gray-200 cursor-pointer"
                                >
                                    Cancel
                                </button>

                                {/* Submit Button */}
                                <button
                                    onClick={handleDelete}
                                    type="submit"
                                    className="bg-main text-lg text-white font-semibold border-[1px] rounded-sm px-8 py-2 cursor-pointer hover:bg-white hover:text-main hover:border-main"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
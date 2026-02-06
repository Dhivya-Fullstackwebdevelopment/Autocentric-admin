import React from "react";
import {IoMdClose } from "react-icons/io";

interface AddServiceMasterPopupProps {
    closePopup: () => void;
}

export const AddServiceMasterPopup: React.FC<AddServiceMasterPopupProps> = ({ closePopup }) => {
    return (
        <div className="fixed  inset-0 bg-acash bg-opacity-40 flex items-center justify-center z-50">
            {/* <div className="bg-white px-28 py-8 p-8 rounded-2xl w-[1000px] h-[80vh] max-w-full overflow-auto shadow-lg relative"> */}
            <div className="bg-white px-20 py-10 rounded-2xl w-[1000px] max-w-full max-h-screen overflow-auto shadow-lg relative flex flex-col">
                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="absolute top-3 right-3 text-gray-600 hover:text-black"
                >
                    <IoMdClose size={24} />
                </button>

                {/* Title and Add Service Master Button in Same Line */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-main uppercase">Add Service Master</h2>
                     <button className="bg-main font-semibold text-white px-4 py-2 rounded hover:text-main hover:bg-white border border-main">
                        Save Service Master
                    </button>
                </div>

                {/* Customer Form */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Car reg</label>
                        <input
                            type="text"
                            placeholder="Car reg"
                            className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Year</label>
                        <input
                            type="text"
                            placeholder="Year"
                            className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Fuel Type</label>
                        <input
                            type="text"
                            placeholder="FuelType"
                            className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Tax Status</label>
                        <input
                            type="text"
                            placeholder="Tax Status"
                            className="border border-aclightash px-3 py-3 rounded bg-aclightash focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Make</label>
                        <input
                            type="text"
                            placeholder="Make"
                            className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">Colour</label>
                        <input
                            type="text"
                            placeholder="Colour"
                            className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium text-gray-700">MOT Exp</label>
                        <input
                            type="text"
                            placeholder="MOT Exp"
                            className="border border-aclightash px-3 py-3 rounded bg-aclightash  focus:outline-none"
                        />
                    </div>
                </div>
            </div>
        </div >
    );
};

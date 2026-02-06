import React, { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
// import { Button } from "../../common/Button";
import { Pagination } from "../../common/Pagination";
//import { useNavigate } from "react-router-dom";
import { getVehicleList } from "../../commonapicall/Vehiclesapis/Vehiclesapis";
// import { MdDelete } from "react-icons/md";
// import { DeleteVehicle } from "./DeleteVehicle";
import { TableShimmer } from "../../components/Shimmer/TableShimmer";
// import { AddVehiclePopup } from "../../components/VehiclesPopups/AddVehiclesPopup";
// import { EditVehiclePopup } from "../../components/VehiclesPopups/EditVehiclePopup";

// Define the type for a vehicle
export interface Vehicle {
    id: number;
    customer_name: string;
    registration_number: string;
    tax_status: string | null;
    tax_due_date: string | null;
    mot_status: string | null;
    make: string | null;
    co2_emissions: string | null;
    engine_capacity: string | null;
    wheel_plan: string | null;
    year_of_manufacture: string | null;
    fuel_type: string | null;
    marked_for_export: string | null;
    colour: string | null;
    type_approval: string | null;
    date_of_last_v5_issued: string | null;
    revenue_weight: string | null;
    mot_expiry_date: string | null;
    month_of_first_registration: string | null;
    is_deleted: boolean;
}

export interface VehicleApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: {
        status: string;
        message: string;
        data: Vehicle[];
    };
}

export const VehicleInfoTable = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");
    // const [showDeleteVehiclePopup, setShowDeleteVehiclePopup] = useState(false);
    // const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [count, setCount] = useState<number>(1);
    const [vehicle, setVehicle] = useState<Vehicle[]>([])
    console.log("vehicle", vehicle)
    //const navigate = useNavigate()
    // const [showAddVehiclePopup, setShowAddVehiclePopup] = useState(false);
    // const [showEditVehiclePopup, setShowEditVehiclePopup] = useState(false);

    // const fetchVehicle = async () => {
    //     setLoading(true); // Start loading
    //     try {
    //         const data = await getVehicleList(currentPage, search.trim(), itemsPerPage.toString()) as VehicleApiResponse;

    //         console.log("Fetched Vehicles:", data?.results);
    //         setVehicle(data?.results?.data)
    //         setCount(data?.count || 1);
    //     } catch (err: any) {
    //         console.log(err.message || 'Something went wrong');
    //     }
    //     finally {
    //         setLoading(false); // End loading
    //     }
    // }

    const fetchVehicle = async () => {
    setLoading(true);
    try {
        console.log("Searching with params:", {
            page: currentPage,
            search: search.trim(),
            page_size: itemsPerPage.toString()
        });
        
        const data = await getVehicleList(currentPage, search.trim(), itemsPerPage.toString()) as VehicleApiResponse;
        
        console.log("Search results:", data?.results);
        setVehicle(data?.results?.data)
        setCount(data?.count || 1);
    } catch (err: any) {
        console.error("Search error:", err.message || 'Something went wrong');
    } finally {
        setLoading(false);
    }
}

    useEffect(() => {
        fetchVehicle();
    }, [currentPage, search, itemsPerPage])

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };


    // const openDeleteVehiclePopup = (customerId: number) => {
    //     setSelectedVehicleId(customerId);
    //     setShowDeleteVehiclePopup(true);
    // }

    // const closeDeleteVehiclePopup = () => {
    //     setShowDeleteVehiclePopup(false);
    //     setSelectedVehicleId(null);
    // }

    return (
        <div className="p-6">
            <div className="bg-white px-5 py-1 rounded-lg shadow-sm">
                {/* Header Section */}
                <div className="flex flex-wrap items-center justify-between pb-2 py-2 gap-y-3">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">Search</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        {/* <Button
                            buttonType="button"
                            buttonTitle="Add Vehicle"
                            //onClick={() => navigate("/vehicle/AddVehicleForm")}
                            onClick={() => setShowAddVehiclePopup(true)}
                            className="flex items-center gap-2 bg-main text-white border border-main rounded px-4 py-2 font-bold hover:text-main hover:bg-white transition-colors duration-200 cursor-pointer"
                        /> */}
                        {/* Search Input */}
                        <div className="relative w-[600px] max-sm:!w-auto">
                            <input
                                type="text"
                                value={search}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                placeholder="Search by any field in the table..."
                                className="w-full rounded-[5px] border-[1px] border-acgrey pl-2 pr-2 py-1.5 focus-within:outline-none"
                            />
                            <IoMdSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-acgrey text-[18px]" />
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full table-auto text-sm">
                        <thead className="bg-main text-left">
                            <tr className="bg-main text-left text-white whitespace-nowrap">
                                <th className="bg-main px-2 py-3">ID</th>
                                <th className="bg-main px-2 py-3">Registration Number</th>
                                <th className="bg-main px-2 py-3">Customer Name</th>
                                <th className="bg-main px-2 py-3">Engine Capacity</th>
                                <th className="bg-main px-2 py-3">Make</th>
                                <th className="bg-main px-2 py-3">Type Approval</th>
                                <th className="bg-main px-2 py-3">Wheel Plan</th>
                                <th className="bg-main px-2 py-3">Colour</th>
                                {/* <th className="bg-main px-2 py-3">Action</th> */}
                            </tr>
                        </thead>
                        <tbody className="whitespace-nowrap">
                            {loading ? (
                                <TableShimmer columnCount={9} />
                            ) : !vehicle || vehicle.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-8">
                                        <p className="text-center py-4">No Vehicles Found</p>
                                    </td>
                                </tr>
                            ) : (
                                vehicle.map((item) => (
                                    <tr key={item.id} className="border-b-2 border-acgrey cursor-pointer"
                                        //onClick={() => navigate(`/vehicle/EditVehicleForm/${item.id}`)}
                                        //onClick={() => setShowEditVehiclePopup(true)}
                                    >
                                        <td className="px-2 py-5">{item.id || "N/A"}</td>
                                        <td className="px-2 py-5">{item.registration_number || "N/A"}</td>
                                        <td className="px-2 py-5">{item.customer_name || "N/A"}</td>
                                        <td className="px-2 py-5">{item.engine_capacity || "N/A"}</td>
                                        <td className="px-2 py-5">{item.make || "N/A"}</td>
                                        <td className="px-2 py-5">{item.type_approval || "N/A"}</td>
                                        <td className="px-2 py-5">{item.wheel_plan || "N/A"}</td>
                                        <td className="px-2 py-5">{item.colour || "N/A"}</td>
                                        {/* <td className="px-2 py-5">
                                            <button className="bg-main text-white p-1 rounded-full ml-4 hover:text-main hover:bg-white hover:border-main border-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDeleteVehiclePopup(item.id);
                                                }}
                                            >
                                                <MdDelete className="text-xl cursor-pointer" />
                                            </button>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={count}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
                {/* {showDeleteVehiclePopup && selectedVehicleId && (
                    <DeleteVehicle
                        closePopup={closeDeleteVehiclePopup}
                        VehicleId={selectedVehicleId}
                        refreshData={fetchVehicle}
                    />
                )} */}
                {/* {showAddVehiclePopup && (
                    <AddVehiclePopup closePopup={() => setShowAddVehiclePopup(false)} />
                )}
                {showEditVehiclePopup && (
                    <EditVehiclePopup closePopup={() => setShowEditVehiclePopup(false)} />
                )} */}
            </div>
        </div>
    );
};

// import React, { useState } from "react";
// //import { FaRegCommentDots } from "react-icons/fa";
// import { IoMdSearch } from "react-icons/io";
// import { Button } from "../../common/Button";
// import { Pagination } from "../../common/Pagination";
// import { useNavigate } from "react-router-dom";
// import { ServiceDetails } from "../../commonapicall/ServiceDetailsapis/ServiceDetailsapis";
// import { MdDelete } from "react-icons/md";
// import { DeleteServicedetailsPopup } from "./Deleteservicedetailspopup";
// import { FaDownload } from "react-icons/fa";
// import { TableShimmer } from "../../components/Shimmer/TableShimmer";

// export interface ServiceDetaill {
//   id: number;
//   name: string;
//   price: number;
// }

// interface ServiceDetail {
//     id: number;
//     booking: number;
//     cars: number;
//     customer_name: string | null;
//     service_details: Array<{
//         id: number;
//         name: string;
//         price: number;
//     }>;
//     total_estimate: number;
//     actual_total: number | null;
//     image1: string | null;
//     image2: string | null;
//     image3: string | null;
//     image4: string | null;
//     is_deleted: boolean;
// }

// export interface AppointmentResults {
//   status: string;
//   message: string;
//   data: ServiceDetail[];
// }

// export interface AppointmentsResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: AppointmentResults;
// }

// export const ServiceDetailsInfoTable = () => {
//     const navigate = useNavigate();
//     const [currentPage, setCurrentPage] = React.useState(1);
//     const [itemsPerPage, setItemsPerPage] = React.useState(10);
//     const [search, setSearch] = React.useState("");
//     const [data, setData] = React.useState<ServiceDetail[]>([]);
//     const [showservicedetailsPopup, setShowservicedetailsPopup] = useState(false);
//     const [selectedservicedetailsId, setSelectedservicedetailsId] = useState<number | null>(null); 
//  const [totalCount, setTotalCount] = useState(0);
//  const [loading, setLoading] = useState(false);

 
//     const fetchData = async () => {
//           setLoading(true); // Start loading
//         try {
//             const response = await ServiceDetails(currentPage,search.trim(),itemsPerPage.toString()) as AppointmentsResponse;
//             // If data is directly in response
//             if (Array.isArray(response?.results?.data)) {
//                 setData(response?.results?.data);
//                  setTotalCount(response?.count || 1);
//             }
//             // If data is in response.data
//             else if (Array.isArray(response?.results?.data)) {
//                 setData(response?.results?.data);
//             }
//             // If data is in response.results.data
//             else if (response.results?.data) {
//                 setData(response.results.data);
//             }
//             else {
//                 setData([]);
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setData([]);
//         }
//         finally {
//         setLoading(false); // End loading
//     }
//     };

//        React.useEffect(() => {
//         fetchData();
//     }, [currentPage,search,itemsPerPage]);


//     const handlePageChange = (page: number) => {
//         setCurrentPage(page);
//     };

//     const handleItemsPerPageChange = (items: number) => {
//         setItemsPerPage(items);
//         setCurrentPage(1);
//     };

//      const openDeleteCustomerPopup = (serviceId: number) => {
//     setSelectedservicedetailsId(serviceId);
//     setShowservicedetailsPopup(true);
//   }

//   const closeservicedetailsPopup = () => {
//     setShowservicedetailsPopup(false);
//     setSelectedservicedetailsId(null);
//   }

//     const handleDownloadPDF = (id: number, e: React.MouseEvent) => {
//         e.stopPropagation(); // Prevent row navigation
//         const url = `http://217.154.63.73:8000/api/invoice/service/${id}/`;
//         window.open(url, '_blank');
//     };

//     return (
//         <div className="p-6">
//             <div className="bg-white px-5 py-1 rounded-lg shadow-sm">
//                 {/* Header Section */}
//                 <div className="flex flex-wrap items-center justify-between pb-2 py-2 gap-y-3">
//                     <div className="flex items-center">
//                         <span className="text-2xl font-bold">Invoice</span>
//                     </div>
//                     <div className="flex flex-wrap items-center gap-4">
//                         <Button
//                             onClick={() => navigate('/ServiceDetails/AddServiceDetailsPage')}
//                             buttonType="button"
//                             buttonTitle="Add Invoice"
//                             className="flex items-center gap-2 bg-main text-white border border-main rounded px-4 py-2 font-bold hover:text-main hover:bg-white transition-colors duration-200 cursor-pointer"
//                         />

//                         {/* Search Input */}
//                         <div className="relative w-[300px] max-sm:!w-auto">
//                             <input
//                                 type="text"
//                                 value={search}
//                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
//                                 placeholder="Search"
//                                 className="w-full rounded-[5px] border-[1px] border-acgrey pl-2 pr-2 py-1.5 focus-within:outline-none"
//                             />
//                             <IoMdSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-acgrey text-[18px]" />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Table */}
//                 <div className="w-full overflow-x-auto">
//                     <table className="w-full table-auto text-sm">
//                         <thead className="bg-main text-left">
//                             <tr className="bg-main text-left text-white whitespace-nowrap">
//                                 <th className="bg-main px-2 py-3">ID</th>
//                                 <th className="bg-main px-2 py-3">Booking</th>
//                                 <th className="bg-main px-2 py-3">Actual Total</th>
//                                 <th className="bg-main px-2 py-3">Cars</th>
//                                 <th className="bg-main px-2 py-3">Total Estimate</th>
//                                 <th className="bg-main px-2 py-3">Customer Name</th>
//                                   <th className="bg-main px-2 py-3">Action</th>
//                                 {/* <th className="bg-main px-2 py-3 sticky right-0 z-10 max-sm:!static">Actions</th> */}
//                             </tr>
//                         </thead>
//                         <tbody className="whitespace-nowrap">
//                             {
//                              loading ? (
//     <TableShimmer columnCount={7} />
//   ) :data.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={7} className="text-center py-8">
//                                         <p className="text-center py-4">No Invoice Found</p>
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 data.map((item) => (
//                                     <tr
//                                         onClick={() => navigate(`/ServiceDetails/EditServiceDetailsPage/${item.id}`)}
//                                         key={item.id}
//                                         className="border-b-2 border-acgrey hover:bg-gray-100 cursor-pointer"
//                                     >
//                                         <td className="px-2 py-5">{item.id || "N/A"}</td>
//                                         <td className="px-2 py-5">{item.booking || "N/A"}</td>
//                                         <td className="px-2 py-5">{item.actual_total || "N/A"}</td>
//                                         <td className="px-2 py-5">{item.cars || "N/A"}</td>
//                                         <td className="px-2 py-5">{item.total_estimate || "N/A"}</td>
//                                         <td className="px-2 py-5">{item.customer_name || "N/A"}</td>
//                                         <td className="px-2 py-5">
//                                             <button
//                                                 // onClick={openDeleteCustomerPopup}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation(); // Prevent row navigation
//                                                     openDeleteCustomerPopup(item.id);// Open the popup
//                                                 }}
//                                                 className="bg-main text-white p-1 rounded-full ml-4 hover:text-main hover:bg-white hover:border-main border-1">
//                                                 <MdDelete className="text-xl cursor-pointer" />
//                                             </button>
//                                             <button
//                                                 onClick={(e) => handleDownloadPDF(item.id, e)}
//                                                 className="bg-main text-white p-1 rounded-full ml-2 hover:text-main hover:bg-white hover:border-main border-1">
//                                                 <FaDownload className="text-xl cursor-pointer" />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <Pagination
//                     currentPage={currentPage}
//                     totalItems={totalCount}
//                     itemsPerPage={itemsPerPage}
//                     onPageChange={handlePageChange}
//                     onItemsPerPageChange={handleItemsPerPageChange}
//                 />
//                  {showservicedetailsPopup && selectedservicedetailsId && (
//                     <DeleteServicedetailsPopup
//                         closePopup={closeservicedetailsPopup}
//                         servicedetailsId={selectedservicedetailsId}
//                         refreshData={fetchData} // Pass the loadCustomers function to refresh data
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };





import React, { useState } from "react";
//import { FaRegCommentDots } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import { Button } from "../../common/Button";
import { Pagination } from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import { ServiceDetails } from "../../commonapicall/ServiceDetailsapis/ServiceDetailsapis";
import { MdDelete } from "react-icons/md";
import { DeleteServicedetailsPopup } from "./Deleteservicedetailspopup";
import { FaDownload } from "react-icons/fa";
import { TableShimmer } from "../../components/Shimmer/TableShimmer";

export interface ServiceDetaill {
    id: number;
    name: string;
    price: number;
}

interface ServiceDetail {
    id: number;
    booking: number;
    cars: number;
    customer_name: string | null;
    service_details: Array<{
        id: number;
        name: string;
        price: number;
    }>;
    total_estimate: number;
    actual_total: number | null;
    image1: string | null;
    image2: string | null;
    image3: string | null;
    image4: string | null;
    is_deleted: boolean;
    registration_number: string;
}

export interface AppointmentResults {
    status: string;
    message: string;
    data: ServiceDetail[];
}

export interface AppointmentsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: AppointmentResults;
}

export const ServiceDetailsInfoTable = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [itemsPerPage, setItemsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [data, setData] = React.useState<ServiceDetail[]>([]);
    const [showservicedetailsPopup, setShowservicedetailsPopup] = useState(false);
    const [selectedservicedetailsId, setSelectedservicedetailsId] = useState<number | null>(null);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);


    const fetchData = async () => {
        setLoading(true); // Start loading
        try {
            const response = await ServiceDetails(currentPage, search.trim(), itemsPerPage.toString()) as AppointmentsResponse;
            // If data is directly in response
            if (Array.isArray(response?.results?.data)) {
                setData(response?.results?.data);
                setTotalCount(response?.count || 1);
            }
            // If data is in response.data
            else if (Array.isArray(response?.results?.data)) {
                setData(response?.results?.data);
            }
            // If data is in response.results.data
            else if (response.results?.data) {
                setData(response.results.data);
            }
            else {
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        }
        finally {
            setLoading(false); // End loading
        }
    };

    React.useEffect(() => {
        fetchData();
    }, [currentPage, search, itemsPerPage]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    const openDeleteCustomerPopup = (serviceId: number) => {
        setSelectedservicedetailsId(serviceId);
        setShowservicedetailsPopup(true);
    }

    const closeservicedetailsPopup = () => {
        setShowservicedetailsPopup(false);
        setSelectedservicedetailsId(null);
    }

    const handleDownloadPDF = (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row navigation
        const url = `http://217.154.63.73:8000/api/invoice/service/${id}/`;
        window.open(url, '_blank');
    };

    return (
        <div className="p-6">
            <div className="bg-white px-5 py-1 rounded-lg shadow-sm">
                {/* Header Section */}
                <div className="flex flex-wrap items-center justify-between pb-2 py-2 gap-y-3">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold">Invoice</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <Button
                            onClick={() => navigate('/ServiceDetails/AddServiceDetailsPage')}
                            buttonType="button"
                            buttonTitle="Add Invoice"
                            className="flex items-center gap-2 bg-main text-white border border-main rounded px-4 py-2 font-bold hover:text-main hover:bg-white transition-colors duration-200 cursor-pointer"
                        />

                        {/* Search Input */}
                        <div className="relative w-[300px] max-sm:!w-auto">
                            <input
                                type="text"
                                value={search}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                placeholder="Search"
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
                                <th className="bg-main px-2 py-3">Booking</th>
                                <th className="bg-main px-2 py-3">Actual Total</th>
                                <th className="bg-main px-2 py-3">Car</th>
                                <th className="bg-main px-2 py-3">Total Estimate</th>
                                <th className="bg-main px-2 py-3">Customer Name</th>
                                <th className="bg-main px-2 py-3">Action</th>
                                {/* <th className="bg-main px-2 py-3 sticky right-0 z-10 max-sm:!static">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className="whitespace-nowrap">
                            {
                                loading ? (
                                    <TableShimmer columnCount={7} />
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-8">
                                            <p className="text-center py-4">No Invoice Found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item) => (
                                        <tr
                                            onClick={() => navigate(`/ServiceDetails/EditServiceDetailsPage/${item.id}`)}
                                            key={item.id}
                                            className="border-b-2 border-acgrey hover:bg-gray-100 cursor-pointer"
                                        >
                                            <td className="px-2 py-5">{item.id || "N/A"}</td>
                                            <td className="px-2 py-5">{item.booking || "N/A"}</td>
                                            <td className="px-2 py-5">{item.actual_total || "N/A"}</td>
                                            <td className="px-2 py-5">{item.registration_number || "N/A"}</td>
                                            <td className="px-2 py-5">{item.total_estimate || "N/A"}</td>
                                            <td className="px-2 py-5">{item.customer_name || "N/A"}</td>
                                            <td className="px-2 py-5">
                                                <button
                                                    // onClick={openDeleteCustomerPopup}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row navigation
                                                        openDeleteCustomerPopup(item.id);// Open the popup
                                                    }}
                                                    className="bg-main text-white p-1 rounded-full ml-4 hover:text-main hover:bg-white hover:border-main border-1">
                                                    <MdDelete className="text-xl cursor-pointer" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDownloadPDF(item.id, e)}
                                                    className="bg-main text-white p-1 rounded-full ml-2 hover:text-main hover:bg-white hover:border-main border-1">
                                                    <FaDownload className="text-xl cursor-pointer" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
                {showservicedetailsPopup && selectedservicedetailsId && (
                    <DeleteServicedetailsPopup
                        closePopup={closeservicedetailsPopup}
                        servicedetailsId={selectedservicedetailsId}
                        refreshData={fetchData} // Pass the loadCustomers function to refresh data
                    />
                )}
            </div>
        </div>
    );
};

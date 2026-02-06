import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { Button } from "../../common/Button";
import { Pagination } from "../../common/Pagination";
import { useNavigate } from "react-router-dom";
import { fetchServiceMaster } from "../../commonapicall/ServiceMasterapis.tsx/ServiceMasterapis";
import { MdDelete } from "react-icons/md";
import { DeleteServiceMaster } from "./DeleteServiceMaster";
import { TableShimmer } from "../../components/Shimmer/TableShimmer";

export interface ServiceMaster {
  id: number;
  service_name: string;
  price: string; // Changed to string based on API response
  is_deleted: boolean;
}

export interface ServiceData {
  status: string;
  message: string;
  data: ServiceMaster[];
}

export interface ServiceResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServiceData;
}
export const ServiceMasterInfoTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<ServiceMaster[]>([]);
  const [loading, setLoading] = useState(false);


  const [totalCount, setTotalCount] = useState(0);
  const [showDeleteServiceMasterPopup, setShowDeleteServiceMasterPopup] = useState(false);
  const [selectedServiceMasterId, setSelectedServiceMasterId] = useState<number | null>(null);
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const loadServices = async () => {
    setLoading(true); // Start loading
    try {
      const data = await fetchServiceMaster(currentPage, search.trim(), itemsPerPage.toString()) as ServiceResponse;
      setServices(data?.results?.data || []);
      // setFilteredServices(data);
      setTotalCount(data?.count || 1);
    } catch (err) {
      console.error("Failed to load services", err);
    }
    finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    loadServices();
  }, [currentPage, search, itemsPerPage]);



  const openDeleteServiceMasterPopup = (customerId: number) => {
    setSelectedServiceMasterId(customerId);
    setShowDeleteServiceMasterPopup(true);
  }

  const closeDeleteServiceMasterPopup = () => {
    setShowDeleteServiceMasterPopup(false);
    setSelectedServiceMasterId(null);
  }
  return (
    <div className="p-6">
      <div className="bg-white px-5 py-1 rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between pb-2 py-2 gap-y-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold">Services Master</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={() => navigate("/ServiceMaster/AddServicemasterPage")}
              buttonType="button"
              buttonTitle="Add Services Master"
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
            <thead className="bg-main text-left text-white">
              <tr>
                <th className="bg-main px-2 py-3">ID</th>
                <th className="bg-main px-2 py-3">Service Name</th>
                <th className="bg-main px-2 py-3">Price (£)</th>
                <th className="bg-main px-2 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">


              {loading ? (
                <TableShimmer columnCount={4} />
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    <p className="text-center py-4">No Services Master Found</p>
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service.id}
                    onClick={() => navigate(`/ServiceMaster/EditServicemasterPage/${service.id}`)}
                    className="border-b-2 border-acgrey hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="px-2 py-5">{service.id || "N/A"}</td>
                    <td className="px-2 py-5 hover:underline">{service.service_name || "N/A"}</td>
                    <td className="px-2 py-5">{service.price || "0"}</td>
                    <td className="px-2 py-5">
                      <button className="bg-main text-white p-1 rounded-full ml-4 hover:text-main hover:bg-white hover:border-main border-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteServiceMasterPopup(service.id);
                        }}
                      >
                        <MdDelete className="text-xl cursor-pointer" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />


        {showDeleteServiceMasterPopup && selectedServiceMasterId && (
          <DeleteServiceMaster
            closePopup={closeDeleteServiceMasterPopup}
            ServiceMasterId={selectedServiceMasterId}
            refreshData={loadServices}
          />
        )}
      </div>
    </div>
  );
};

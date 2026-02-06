import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { Button } from "../../common/Button";
import { Pagination } from "../../common/Pagination";
// import { useNavigate } from "react-router-dom";
import { fetchCustomerInfo } from "../../commonapicall/CutomerInfoapis/CutomerInfoapis";
import { MdDelete } from "react-icons/md";
import { DeleteCustomerInfoPopup } from "./DeleteCustomerInfopopup";
import { TableShimmer } from "../../components/Shimmer/TableShimmer";
// import { AddCustomerPopup } from "../../components/CustomerInfoPopups/AddCustomerInfopopup";
// import { EditCustomerPopup } from "../../components/CustomerInfoPopups/EditCustomerInfopopup";
import { useNavigate } from "react-router-dom";

export interface Customer {
  id: number;
  email: string;
  // first_name: string;
  // last_name: string;
  full_name:string
  phone_number: string;
  home_address: string;
  date: string;
  is_deleted: boolean;
}

export interface CustomersData {
  status: string;
  message: string;
  data: Customer[];
}

export interface CustomersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CustomersData;
}
export const CustomerInfoTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showDeleteCustomerPopup, setShowDeleteCustomerPopup] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null); // Track which customer is being deleted
  const [loading, setLoading] = useState(false);
  // const [showAddCustomerPopup, setShowAddCustomerPopup] = useState(false);
  // const [showEditCustomerPopup, setShowEditCustomerPopup] = useState(false);
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const loadCustomers = async () => {
    setLoading(true); // Start loading
    try {
      const data = await fetchCustomerInfo(currentPage, search.trim(), itemsPerPage.toString()) as CustomersResponse;

      setCustomers(data?.results?.data);
      setTotalCount(data.count);
    } catch (err) {
      console.error("Failed to load customers", err);
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [currentPage, search, itemsPerPage]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Formats as dd/mm/yyyy
  };

  // const handleRowClick = (customer: Customer) => {
  //   navigate(`/CustomerInfo/EditCustomerinfo/${customer.id}`, {
  //     state: { customerData: customer } // Pass the customer data via state
  //   });
  // };

  const openDeleteCustomerPopup = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setShowDeleteCustomerPopup(true);
  }

  const closeDeleteCustomerPopup = () => {
    setShowDeleteCustomerPopup(false);
    setSelectedCustomerId(null);
  }

  return (
    <div className="p-6">
      <div className="bg-white px-5 py-1 rounded-lg shadow-sm">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between pb-2 py-2 gap-y-3">
          <div className="flex items-center">
            <span className="text-2xl font-bold">Customer Information</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={() => navigate("/CustomerInfo/AddCustomerinfo")}
              //onClick={() => setShowAddCustomerPopup(true)}
              buttonType="button"
              buttonTitle="Add Customer"
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
                <th className="bg-main px-2 py-3">Date</th>
                <th className="bg-main px-2 py-3">Email Address</th>
                <th className="bg-main px-2 py-3">Full Name</th>
                <th className="bg-main px-2 py-3">Home Address</th>
                {/* <th className="bg-main px-2 py-3">Last Name</th> */}
                <th className="bg-main px-2 py-3">Phone Number</th>
                <th className="bg-main px-2 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              {loading ? (
                <TableShimmer columnCount={8} />
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8">
                    <p className="text-center py-4">No customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr

                    key={customer.id}
                    // onClick={() => handleRowClick(customer)}
                    onClick={() => navigate(`/CustomerInfo/EditCustomerinfo/${customer.id}`)}
                    className="border-b-2 border-acgrey hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="px-2 py-5">{customer.id || "N/A"}</td>
                    <td className="px-2 py-5">{formatDate(customer.date) || "N/A"}</td>
                    <td className="px-2 py-5">{customer.email || "N/A"}</td>
                    <td className="px-2 py-5">{customer.full_name || "N/A"}</td>
                    <td className="px-2 py-5">{customer.home_address || "N/A"}</td>
                    {/* <td className="px-2 py-5">{customer.last_name || "N/A"}</td> */}
                    <td className="px-2 py-5">{customer.phone_number || "N/A"}</td>
                    <td className="px-2 py-5">
                      <button
                        // onClick={openDeleteCustomerPopup}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row navigation
                          openDeleteCustomerPopup(customer.id);// Open the popup
                        }}
                        className="bg-main text-white p-1 rounded-full ml-4 hover:text-main hover:bg-white hover:border-main border-1">
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
        {showDeleteCustomerPopup && selectedCustomerId && (
          <DeleteCustomerInfoPopup
            closePopup={closeDeleteCustomerPopup}
            customerId={selectedCustomerId}
            refreshData={loadCustomers} // Pass the loadCustomers function to refresh data
          />
        )}
        {/* {showAddCustomerPopup && (
          <AddCustomerPopup closePopup={() => setShowAddCustomerPopup(false)} />
        )} */}
        {/* {showEditCustomerPopup && (
          <EditCustomerPopup closePopup={() => setShowEditCustomerPopup(false)} />
        )} */}
      </div>
    </div>
  );
};
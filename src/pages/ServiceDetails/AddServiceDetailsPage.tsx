// // AddServiceDetailsPage
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
// import { Header } from '../../components/Header';
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { createServiceDetails } from '../../commonapicall/ServiceDetailsapis/ServiceDetailsapis';
// import { apiAxios } from '../../commonapicall/api/apiUrl';
// // import React from 'react';

// interface Service {
//   id: number;
//   service_name: string;
//   price: string;
//   is_deleted: boolean;
// }

// interface ServiceRow {
//   no: number;
//   serviceId?: number;
//   details: string;
//   price: number;
//   isDropdownOpen?: boolean;
//   searchTerm?: string;
// }

// interface Booking {
//   id: number;
//   date: string;
//   time: string;
//   colour: string | null;
//   month: string;
//   total_estimate: string | null;
//   image1: string | null;
//   image2: string | null;
//   image3: string | null;
//   image4: string | null;
//   is_deleted: boolean;
//   car: number;
//   customer_name: string;
// }

// // Service details validation schema
// const serviceDetailsSchema = z.object({
//   booking: z.coerce.number().min(1, {
//     message: "Booking ID is required"
//   }),
//   car: z.coerce.number().min(1, {
//     message: "Car is required"
//   }),
//   customer_name: z.string({
//     required_error: "Customer name is required"
//   }).nonempty("Customer name is required"),
//   services: z.array(z.object({
//     serviceId: z.number(),
//     details: z.string(),
//     price: z.number()
//   })).min(1, "At least one service is required")
// });

// type ServiceDetailsFormData = z.infer<typeof serviceDetailsSchema>;

// export const AddServiceDetailsPage = () => {
//   const navigate = useNavigate();
//   const [totalEstimate, setTotalEstimate] = useState('0.00');
//   const [actualTotal, setActualTotal] = useState('0.00');
//   const [services, setServices] = useState<ServiceRow[]>([]);
//   const [masterServices, setMasterServices] = useState<Service[]>([]);
//   const [images, setImages] = useState<Array<{ no: number; image: string; fileName: string }>>([]);
//   const [selectedServices, setSelectedServices] = useState<number[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [deleteError, setDeleteError] = useState<string>('');
  
//   // Updated states for booking functionality
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [carNumber, setCarNumber] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm<ServiceDetailsFormData>({
//     resolver: zodResolver(serviceDetailsSchema)
//   });

//   useEffect(() => {
//     fetchData();
//     loadServices();
//   }, []);

//   useEffect(() => {
    
//     // Click outside handler
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//         // If no booking is selected and there's a search term, clear it
//         if (!selectedBooking && searchTerm) {
//           setSearchTerm('');
//           setCarNumber('');
//           setCustomerName('');
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [selectedBooking, searchTerm]);

//   const fetchData = async () => {
//     // try {
//     //   const response = await AppointmentBooking();
//     //   setBookings(response.data);
//     // } catch (error) {
//     //   console.error('Error fetching data:', error);
//     // }
//     try {
//       const response = await apiAxios.get('/api/appointments/dropdown/');
//       console.log('Appointments API Response:', response.data); // Debug log

//       if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
//         setBookings(response.data.data);
//       } else {
//         console.error('Unexpected appointments data structure:', response.data);
//         setBookings([]);
//       }
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       setBookings([]);
//     }
//   };

//   const loadServices = async () => {
//     try {
//         const response = await apiAxios.get('/api/services/dropdown/');
//       console.log('Services API Response:', response.data); // Debug log

//       if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
//         setMasterServices(response.data.data);
//       } else {
//         console.error('Unexpected services data structure:', response.data);
//         setMasterServices([]);
//       }
//     } catch (err) {
//       console.error('Error fetching services:', err);
//       setMasterServices([]);
//     }
//   };

//   const filteredBookings = bookings.filter(booking =>
//     booking.id.toString().includes(searchTerm)
//   );

//   const handleBookingSelect = (booking: Booking) => {
//     setSelectedBooking(booking);
//     setSearchTerm(booking.id.toString());
//     setIsDropdownOpen(false);

//     // Set car number and customer name from booking data
//     setCarNumber(booking.car.toString());
//     setCustomerName(booking.customer_name);

//     // Set form values and clear errors
//     setValue('booking', booking.id);
//     setValue('car', booking.car);
//     setValue('customer_name', booking.customer_name);
//     clearErrors(['booking', 'car', 'customer_name']);

//     // Set the total estimate if available
//     if (booking.total_estimate) {
//       setTotalEstimate(booking.total_estimate);
//     } else {
//       setTotalEstimate('0.00');
//     }
//   };

//   const handleAddService = () => {
//     setServices([...services, { 
//       no: services.length + 1, 
//       details: '', 
//       price: 0,
//       isDropdownOpen: false,
//       searchTerm: ''
//     }]);
//   };

//   // Add new function to calculate total price
//   const calculateActualTotal = (servicesList: ServiceRow[]) => {
//     const total = servicesList.reduce((sum, service) => sum + (service.price || 0), 0);
//     return total.toFixed(2);
//   };

//   const handleServiceSelect = (serviceNo: number) => {
//     setSelectedServices(prev => 
//       prev.includes(serviceNo) 
//         ? prev.filter(no => no !== serviceNo)
//         : [...prev, serviceNo]
//     );
//   };

//   // Update the service selection in dropdown to calculate total
//   const handleServiceSelection = (index: number, masterService: Service) => {
//     const newServices = [...services];
//     newServices[index] = {
//       ...services[index],
//       serviceId: masterService.id,
//       details: masterService.service_name,
//       price: parseFloat(masterService.price),
//       isDropdownOpen: false,
//       searchTerm: masterService.service_name
//     };
//     setServices(newServices);
//     setActualTotal(calculateActualTotal(newServices));
    
//     // Update form with current services and validate
//     const validServices = newServices
//       .filter(s => s.serviceId !== undefined)
//       .map(s => ({
//         serviceId: s.serviceId!,
//         details: s.details,
//         price: s.price
//       }));
//     setValue('services', validServices, { shouldValidate: true });
//   };

//   // Update delete services function to recalculate total
//   const handleDeleteServices = () => {
//     if (services.length === 0) {
//       setDeleteError('Please add at least one service.');
//       return;
//     }

//     if (selectedServices.length === 0) {
//       setDeleteError('Please select at least one service to delete.');
//       return;
//     }
//     setDeleteError('');
    
//     const remainingServices = services.filter(service => !selectedServices.includes(service.no));
//     const reorderedServices = remainingServices.map((service, index) => ({
//       ...service,
//       no: index + 1
//     }));
//     setServices(reorderedServices);
//     setSelectedServices([]);
//     setActualTotal(calculateActualTotal(reorderedServices));
//   };

//   // Add new function to filter services
//   const getFilteredServices = (searchTerm: string) => {
//     // Get all currently selected service IDs except for the current row being edited
//     const selectedServiceIds = services
//       .filter(s => s.serviceId !== undefined)
//       .map(s => s.serviceId);

//     // Filter services that match the search term and haven't been selected yet
//     return masterServices.filter(service => 
//       service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       !selectedServiceIds.includes(service.id)
//     );
//   };

//   const onSubmit = async () => {
//     setDeleteError('');
//     setIsLoading(true);
//     try {
//       // Validate services
//       if (services.length === 0) {
//         alert('Please add at least one service');
//         return;
//       }

//       const serviceIds = services
//         .filter(s => s.serviceId !== undefined)
//         .map(s => s.serviceId)
//         .filter(id => id !== undefined)
//         .join(',');
      
//       if (!serviceIds) {
//         alert('Please add at least one valid service');
//         return;
//       }

//       if (!selectedBooking) {
//         alert('Please select a booking');
//         return;
//       }

//       const formData = new FormData();

//       // Process images
//       for (let i = 0; i < 4; i++) {
//         const image = images[i];
//         if (image) {
//           try {
//             // Convert base64 to Blob
//             const base64Response = await fetch(image.image);
//             const blob = await base64Response.blob();
//             formData.append(`image${i + 1}`, blob, image.fileName);
//           } catch (error) {
//             console.error(`Error processing image ${i + 1}:`, error);
//           }
//         } else {
//           // Append empty file for missing images
//           formData.append(`image${i + 1}`, new Blob(), '');
//         }
//       }

//       const result = await createServiceDetails({
//         booking: selectedBooking.id,
//         car: parseInt(carNumber),
//         customer_name: customerName,
//         service_ids: serviceIds,
//         image1: formData.get('image1') as File,
//         image2: formData.get('image2') as File,
//         image3: formData.get('image3') as File,
//         image4: formData.get('image4') as File,
//         vat_amount: parseFloat((parseFloat(actualTotal) * 0.2).toFixed(2)),
//         total_payable: parseFloat((parseFloat(actualTotal) * 1.2).toFixed(2))
//       });
      
//       if (result.status === 'success') {
//         alert('Service details saved successfully');
//         navigate('/ServiceDetails');
//       } else {
//         console.error('Server error:', result.message);
//         alert(result.message || 'Failed to save service details');
//       }
//     } catch (error) {
//       console.error('Error saving service details:', error);
//       alert('Failed to save service details. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update form values when booking is selected
//   useEffect(() => {
//     if (selectedBooking) {
//       setValue('booking', selectedBooking.id);
//       setValue('car', parseInt(carNumber));
//       setValue('customer_name', customerName);
//     }
//   }, [selectedBooking, carNumber, customerName, setValue]);

//   // Update service_ids when services change
//   useEffect(() => {
//     // const serviceIds = services
//     //   .filter(s => s.serviceId !== undefined)
//     //   .map(s => s.serviceId)
//     //   .filter(id => id !== undefined)
//     //   .join(',');
    
//     // Update form with current services
//     const validServices = services
//       .filter(s => s.serviceId !== undefined)
//       .map(s => ({
//         serviceId: s.serviceId!,
//         details: s.details,
//         price: s.price
//       }));
//     setValue('services', validServices);
//   }, [services, setValue]);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {isLoading && (
//         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//         </div>
//       )}
//       <Header/>
//       <main className="p-6 min-h-screen overflow-x-hidden">
//         <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="flex justify-between items-center mb-6 text-xl font-bold border-b-2 border-armsgrey pb-3">
//             <h1 className="text-xl font-bold">Add Invoice</h1>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => navigate('/ServiceDetails')}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">Details</h2>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Booking ID <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     className="w-full p-2 border rounded"
//                     value={searchTerm}
//                     {...register('booking', {
//                       onChange: (e) => {
//                         const newValue = e.target.value;
//                         setSearchTerm(newValue);
//                         setIsDropdownOpen(true);
                        
//                         if (newValue === '') {
//                           setSelectedBooking(null);
//                           setCarNumber('');
//                           setCustomerName('');
//                           setValue('booking', 0);
//                           setValue('car', 0);
//                           setValue('customer_name', '');
//                         }
//                       }
//                     })}
//                     onClick={() => setIsDropdownOpen(true)}
//                     placeholder="Enter Booking ID"
//                   />
//                   {errors.booking && <p className="text-red-500 text-sm mt-1">{errors.booking.message}</p>}
//                   {isDropdownOpen && filteredBookings.length > 0 && (
//                     <div ref={dropdownRef} className="absolute z-10 w-full bg-white rounded-lg shadow p-4 max-h-48 overflow-y-auto">
//                       {filteredBookings.map((booking) => (
//                         <div
//                           key={booking.id}
//                           className="p-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => handleBookingSelect(booking)}
//                         >
//                           Booking #{booking.id}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Car <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded"
//                   value={carNumber}
//                   readOnly
//                   placeholder="Car ID will be auto-populated"
//                   {...register('car')}
//                 />
//                 {errors.car && <p className="text-red-500 text-sm mt-1">{errors.car.message}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Customer Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded"
//                   value={customerName}
//                   readOnly
//                   placeholder="Customer name will be auto-populated"
//                   {...register('customer_name')}
//                 />
//                 {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>}
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">Services</h2>
//             <div className="overflow-visible">
//               <table className="w-full relative">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="w-10 p-2"></th>
//                     <th className="w-16 p-2 text-left">No.</th>
//                     <th className="p-2 text-left">Services Details</th>
//                     <th className="w-32 p-2 text-right">Price</th>
//                     <th className="w-10 p-2"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {services.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="text-center py-4">No Data</td>
//                     </tr>
//                   ) : (
//                     services.map((service, index) => (
//                       <tr key={index} className="relative">
//                         <td className="p-2">
//                           <input 
//                             type="checkbox"
//                             checked={selectedServices.includes(service.no)}
//                             onChange={() => handleServiceSelect(service.no)}
//                           />
//                         </td>
//                         <td className="p-2">{service.no}</td>
//                         <td className="p-2">
//                           <div className="relative">
//                             <input
//                               type="text"
//                               className="w-full p-1 border rounded"
//                               value={service.searchTerm || ''}
//                               placeholder="Search service..."
//                               onChange={(e) => {
//                                 const newServices = [...services];
//                                 newServices[index] = {
//                                   ...service,
//                                   searchTerm: e.target.value,
//                                   isDropdownOpen: true
//                                 };
//                                 setServices(newServices);
//                               }}
//                               onClick={() => {
//                                 const newServices = [...services];
//                                 newServices[index] = {
//                                   ...service,
//                                   isDropdownOpen: true
//                                 };
//                                 setServices(newServices);
//                               }}
//                             />
//                             {service.isDropdownOpen && (
//                               <div className="absolute z-[1000] bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto min-w-[300px] left-0 top-full">
//                                 {getFilteredServices(service.searchTerm || '').map((masterService) => (
//                                   <div
//                                     key={masterService.id}
//                                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                                     onMouseDown={(e) => {
//                                       e.preventDefault();
//                                       handleServiceSelection(index, masterService);
//                                     }}
//                                   >
//                                     {masterService.service_name}
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="p-2">
//                           <input
//                             type="number"
//                             className="w-full p-1 border rounded text-right"
//                             value={service.price}
//                             readOnly
//                           />
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <button
//               type="button"
//               onClick={handleAddService}
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Add Services
//             </button>
//             {/* {selectedServices.length > 0 && ( */}
//             <button
//               type="button"
//               onClick={handleDeleteServices}
//               className="mt-4 px-4 py-2 bg-main text-white rounded hover:bg-white hover:text-main border-1 hover:border-main" style={{ marginLeft: '10px' }}
//             >
//               Delete
//             </button>
//             {deleteError && (
//               <p className="text-red-500 mt-2">{deleteError}</p>
//             )}
//             {/* )} */}
//             {/* Add error message display for services */}
//           {errors.services && <p className="text-red-500">{errors.services.message}</p>}
//             <div className="mt-4 flex gap-4">
//                 <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Total Estimate
//               </label>
//               <input
//                 type="text"
//                 className="w-48 p-2 border rounded text-right"
//                 value={totalEstimate}
//                 readOnly
//               />
//                 </div>
//                 <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Actual Total
//               </label>
//               <input
//                 type="text"
//                 className="w-48 p-2 border rounded text-right"
//                 value={actualTotal}
//                 readOnly
//               />
//                 </div>
//                 <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 VAT (20%)
//               </label>
//               <input
//                 type="text"
//                 className="w-48 p-2 border rounded text-right"
//                 value={(parseFloat(actualTotal) * 0.2).toFixed(2)}
//                 readOnly
//               />
//                 </div>
//                 <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Total Payable
//               </label>
//               <input
//                 type="text"
//                 className="w-48 p-2 border rounded text-right"
//                 value={(parseFloat(actualTotal) * 1.2).toFixed(2)}
//                 readOnly
//               />
//                 </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//               <div className="flex flex-col items-center justify-center">
//                 <svg 
//                   className="w-12 h-12 text-blue-500 mb-4" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24" 
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     strokeWidth="2" 
//                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                   />
//                 </svg>
//                 {/* <p className="mb-2 text-gray-700">Drag and drop your files here</p> */}
//                 {/* <p className="text-sm text-gray-500 mb-4">or</p> */}
//                 <button 
//                   type="button"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                   onClick={() => document.getElementById('fileInput')?.click()}
//                 >
//                   Browse Files
//                 </button>
//                 <input 
//                   id="fileInput"
//                   type="file" 
//                   className="hidden"
//                   multiple
//                   accept="image/*"
//                   onChange={(e) => {
//                     const files = e.target.files;
//                     if (files) {
//                       // Check if adding new files would exceed 4 images
//                       if (images.length + files.length > 4) {
//                         alert('You can only upload a maximum of 4 images');
//                         return;
//                       }
//                       const newImages = Array.from(files).map((file, index) => ({
//                         no: images.length + index + 1,
//                         image: URL.createObjectURL(file),
//                         fileName: file.name
//                       }));
//                       setImages([...images, ...newImages]);
//                     }
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Display uploaded images */}
//             {images.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
//                 <div className="grid grid-cols-4 gap-4">
//                   {images.map((img, index) => (
//                     <div key={index} className="relative group bg-white rounded-lg shadow p-2">
//                       <img
//                         src={img.image}
//                         alt={`Upload ${img.no}`}
//                         className="w-3/4 h-40 object-contain rounded-lg mb-2 mx-auto"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           const newImages = images.filter((_, i) => i !== index);
//                           setImages(newImages.map((img, i) => ({ ...img, no: i + 1 })));
//                         }}
//                         className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </button>
//                       <div className="flex items-center justify-between px-1">
//                         <p className="text-sm text-gray-600 truncate flex-1" title={img.fileName}>
//                           {img.fileName}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

          
//         </form>
//       </main>
//     </div>
//   );
// }



// // AddServiceDetailsPage
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
// import { Header } from '../../components/Header';
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { createServiceDetails } from '../../commonapicall/ServiceDetailsapis/ServiceDetailsapis';
// import { apiAxios } from '../../commonapicall/api/apiUrl';
// // import React from 'react';

// interface Service {
//   id: number;
//   service_name: string;
//   price: string;
//   is_deleted: boolean;
// }

// interface ServiceRow {
//   no: number;
//   serviceId?: number;
//   details: string;
//   price: number;
//   isDropdownOpen?: boolean;
//   searchTerm?: string;
// }

// interface Booking {
//   id: number;
//   date: string;
//   time: string;
//   colour: string | null;
//   month: string;
//   total_estimate: string | null;
//   image1: string | null;
//   image2: string | null;
//   image3: string | null;
//   image4: string | null;
//   is_deleted: boolean;
//   car: number;
//   customer_name: string;
// }

// // Service details validation schema
// const serviceDetailsSchema = z.object({
//   booking: z.coerce.number().min(1, {
//     message: "Booking ID is required"
//   }),
//   car: z.coerce.number().min(1, {
//     message: "Car is required"
//   }),
//   customer_name: z.string({
//     required_error: "Customer name is required"
//   }).nonempty("Customer name is required"),
//   services: z.array(z.object({
//     serviceId: z.number(),
//     details: z.string(),
//     price: z.number()
//   })).min(1, "At least one service is required")
// });

// type ServiceDetailsFormData = z.infer<typeof serviceDetailsSchema>;

// export const AddServiceDetailsPage = () => {
//   const navigate = useNavigate();
//   const [totalEstimate, setTotalEstimate] = useState('0.00');
//   const [actualTotal, setActualTotal] = useState('0.00');
//   const [services, setServices] = useState<ServiceRow[]>([]);
//   const [masterServices, setMasterServices] = useState<Service[]>([]);
//   const [images, setImages] = useState<Array<{ no: number; image: string; fileName: string }>>([]);
//   const [selectedServices, setSelectedServices] = useState<number[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [deleteError, setDeleteError] = useState<string>('');
  
//   // Updated states for booking functionality
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
//   const [carNumber, setCarNumber] = useState('');
//   const [customerName, setCustomerName] = useState('');
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm<ServiceDetailsFormData>({
//     resolver: zodResolver(serviceDetailsSchema)
//   });

//   useEffect(() => {
//     fetchData();
//     loadServices();
//   }, []);

//   useEffect(() => {
    
//     // Click outside handler
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//         // If no booking is selected and there's a search term, clear it
//         if (!selectedBooking && searchTerm) {
//           setSearchTerm('');
//           setCarNumber('');
//           setCustomerName('');
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [selectedBooking, searchTerm]);

//   const fetchData = async () => {
//     // try {
//     //   const response = await AppointmentBooking();
//     //   setBookings(response.data);
//     // } catch (error) {
//     //   console.error('Error fetching data:', error);
//     // }
//     try {
//       const response = await apiAxios.get('/api/appointments/dropdown/');
//       console.log('Appointments API Response:', response.data); // Debug log

//       if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
//         setBookings(response.data.data);
//       } else {
//         console.error('Unexpected appointments data structure:', response.data);
//         setBookings([]);
//       }
//     } catch (error) {
//       console.error('Error fetching appointments:', error);
//       setBookings([]);
//     }
//   };

//   const loadServices = async () => {
//     try {
//         const response = await apiAxios.get('/api/services/dropdown/');
//       console.log('Services API Response:', response.data); // Debug log

//       if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
//         setMasterServices(response.data.data);
//       } else {
//         console.error('Unexpected services data structure:', response.data);
//         setMasterServices([]);
//       }
//     } catch (err) {
//       console.error('Error fetching services:', err);
//       setMasterServices([]);
//     }
//   };

//   const filteredBookings = bookings.filter(booking =>
//     booking.id.toString().includes(searchTerm)
//   );

//   const handleBookingSelect = (booking: Booking) => {
//     setSelectedBooking(booking);
//     setSearchTerm(booking.id.toString());
//     setIsDropdownOpen(false);

//     // Set car number and customer name from booking data
//     setCarNumber(booking.car.toString());
//     setCustomerName(booking.customer_name);

//     // Set form values and clear errors
//     setValue('booking', booking.id);
//     setValue('car', booking.car);
//     setValue('customer_name', booking.customer_name);
//     clearErrors(['booking', 'car', 'customer_name']);

//     // Set the total estimate if available
//     if (booking.total_estimate) {
//       setTotalEstimate(booking.total_estimate);
//     } else {
//       setTotalEstimate('0.00');
//     }
//   };

//   const handleAddService = () => {
//     setServices([...services, { 
//       no: services.length + 1, 
//       details: '', 
//       price: 0,
//       isDropdownOpen: false,
//       searchTerm: ''
//     }]);
//   };

//   // Add new function to calculate total price
//   const calculateActualTotal = (servicesList: ServiceRow[]) => {
//     const total = servicesList.reduce((sum, service) => sum + (service.price || 0), 0);
//     return total.toFixed(2);
//   };

//   const handleServiceSelect = (serviceNo: number) => {
//     setSelectedServices(prev => 
//       prev.includes(serviceNo) 
//         ? prev.filter(no => no !== serviceNo)
//         : [...prev, serviceNo]
//     );
//   };

//   // Update the service selection in dropdown to calculate total
//   const handleServiceSelection = (index: number, masterService: Service) => {
//     const newServices = [...services];
//     newServices[index] = {
//       ...services[index],
//       serviceId: masterService.id,
//       details: masterService.service_name,
//       price: parseFloat(masterService.price),
//       isDropdownOpen: false,
//       searchTerm: masterService.service_name
//     };
//     setServices(newServices);
//     setActualTotal(calculateActualTotal(newServices));
    
//     // Update form with current services and validate
//     const validServices = newServices
//       .filter(s => s.serviceId !== undefined)
//       .map(s => ({
//         serviceId: s.serviceId!,
//         details: s.details,
//         price: s.price
//       }));
//     setValue('services', validServices, { shouldValidate: true });
//   };

//   // Update delete services function to recalculate total
//   const handleDeleteServices = () => {
//     if (services.length === 0) {
//       setDeleteError('Please add at least one service.');
//       return;
//     }

//     if (selectedServices.length === 0) {
//       setDeleteError('Please select at least one service to delete.');
//       return;
//     }
//     setDeleteError('');
    
//     const remainingServices = services.filter(service => !selectedServices.includes(service.no));
//     const reorderedServices = remainingServices.map((service, index) => ({
//       ...service,
//       no: index + 1
//     }));
//     setServices(reorderedServices);
//     setSelectedServices([]);
//     setActualTotal(calculateActualTotal(reorderedServices));
//   };

//   // Add new function to filter services
//   const getFilteredServices = (searchTerm: string) => {
//     // Get all currently selected service IDs except for the current row being edited
//     const selectedServiceIds = services
//       .filter(s => s.serviceId !== undefined)
//       .map(s => s.serviceId);

//     // Filter services that match the search term and haven't been selected yet
//     return masterServices.filter(service => 
//       service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       !selectedServiceIds.includes(service.id)
//     );
//   };

//   const onSubmit = async () => {
//     setDeleteError('');
//     setIsLoading(true);
//     try {
//       // Validate services
//       if (services.length === 0) {
//         alert('Please add at least one service');
//         return;
//       }

//       const serviceIds = services
//         .filter(s => s.serviceId !== undefined)
//         .map(s => s.serviceId)
//         .filter(id => id !== undefined)
//         .join(',');
      
//       if (!serviceIds) {
//         alert('Please add at least one valid service');
//         return;
//       }

//       if (!selectedBooking) {
//         alert('Please select a booking');
//         return;
//       }

//       const formData = new FormData();

//       // Process images
//       for (let i = 0; i < 4; i++) {
//         const image = images[i];
//         if (image) {
//           try {
//             // Convert base64 to Blob
//             const base64Response = await fetch(image.image);
//             const blob = await base64Response.blob();
//             formData.append(`image${i + 1}`, blob, image.fileName);
//           } catch (error) {
//             console.error(`Error processing image ${i + 1}:`, error);
//           }
//         } else {
//           // Append empty file for missing images
//           formData.append(`image${i + 1}`, new Blob(), '');
//         }
//       }

//       const result = await createServiceDetails({
//         booking: selectedBooking.id,
//         car: parseInt(carNumber),
//         customer_name: customerName,
//         service_ids: serviceIds,
//         image1: formData.get('image1') as File,
//         image2: formData.get('image2') as File,
//         image3: formData.get('image3') as File,
//         image4: formData.get('image4') as File,
//         vat_amount: parseFloat((parseFloat(actualTotal) * 0.2).toFixed(2)),
//         total_payable: parseFloat((parseFloat(actualTotal) * 1.2).toFixed(2))
//       });
      
//       if (result.status === 'success') {
//         alert('Service details saved successfully');
//         navigate('/ServiceDetails');
//       } else {
//         console.error('Server error:', result.message);
//         alert(result.message || 'Failed to save service details');
//       }
//     } catch (error) {
//       console.error('Error saving service details:', error);
//       alert('Failed to save service details. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update form values when booking is selected
//   useEffect(() => {
//     if (selectedBooking) {
//       setValue('booking', selectedBooking.id);
//       setValue('car', parseInt(carNumber));
//       setValue('customer_name', customerName);
//     }
//   }, [selectedBooking, carNumber, customerName, setValue]);

//   // Update service_ids when services change
//   useEffect(() => {
//     // const serviceIds = services
//     //   .filter(s => s.serviceId !== undefined)
//     //   .map(s => s.serviceId)
//     //   .filter(id => id !== undefined)
//     //   .join(',');
    
//     // Update form with current services
//     const validServices = services
//       .filter(s => s.serviceId !== undefined)
//       .map(s => ({
//         serviceId: s.serviceId!,
//         details: s.details,
//         price: s.price
//       }));
//     setValue('services', validServices);
//   }, [services, setValue]);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {isLoading && (
//         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
//         </div>
//       )}
//       <Header/>
//       <main className="p-6 min-h-screen overflow-x-hidden">
//         <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="flex justify-between items-center mb-6 text-xl font-bold border-b-2 border-armsgrey pb-3">
//             <h1 className="text-xl font-bold">Add Invoice</h1>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => navigate('/ServiceDetails')}
//                 className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">Details</h2>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Booking ID <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     className="w-full p-2 border rounded"
//                     value={searchTerm}
//                     {...register('booking', {
//                       onChange: (e) => {
//                         const newValue = e.target.value;
//                         setSearchTerm(newValue);
//                         setIsDropdownOpen(true);
                        
//                         if (newValue === '') {
//                           setSelectedBooking(null);
//                           setCarNumber('');
//                           setCustomerName('');
//                           setValue('booking', 0);
//                           setValue('car', 0);
//                           setValue('customer_name', '');
//                         }
//                       }
//                     })}
//                     onClick={() => setIsDropdownOpen(true)}
//                     placeholder="Enter Booking ID"
//                   />
//                   {errors.booking && <p className="text-red-500 text-sm mt-1">{errors.booking.message}</p>}
//                   {isDropdownOpen && filteredBookings.length > 0 && (
//                     <div ref={dropdownRef} className="absolute z-10 w-full bg-white rounded-lg shadow p-4 max-h-48 overflow-y-auto">
//                       {filteredBookings.map((booking) => (
//                         <div
//                           key={booking.id}
//                           className="p-2 hover:bg-gray-100 cursor-pointer"
//                           onClick={() => handleBookingSelect(booking)}
//                         >
//                           Booking #{booking.id}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Car <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded"
//                   value={carNumber}
//                   readOnly
//                   placeholder="This field is auto-populated"
//                   {...register('car')}
//                 />
//                 {errors.car && <p className="text-red-500 text-sm mt-1">{errors.car.message}</p>}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Customer Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded"
//                   value={customerName}
//                   readOnly
//                   placeholder="Customer name will be auto-populated"
//                   {...register('customer_name')}
//                 />
//                 {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>}
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">Services</h2>
//             <div className="overflow-visible">
//               <table className="w-full relative">
//                 <thead>
//                   <tr className="bg-gray-50">
//                     <th className="w-10 p-2"></th>
//                     <th className="w-16 p-2 text-left">No.</th>
//                     <th className="p-2 text-left">Services Details</th>
//                     <th className="w-32 p-2 text-right">Price</th>
//                     <th className="w-10 p-2"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {services.length === 0 ? (
//                     <tr>
//                       <td colSpan={5} className="text-center py-4">No Data</td>
//                     </tr>
//                   ) : (
//                     services.map((service, index) => (
//                       <tr key={index} className="relative">
//                         <td className="p-2">
//                           <input 
//                             type="checkbox"
//                             checked={selectedServices.includes(service.no)}
//                             onChange={() => handleServiceSelect(service.no)}
//                           />
//                         </td>
//                         <td className="p-2">{service.no}</td>
//                         <td className="p-2">
//                           <div className="relative">
//                             <input
//                               type="text"
//                               className="w-full p-1 border rounded"
//                               value={service.searchTerm || ''}
//                               placeholder="Search service..."
//                               onChange={(e) => {
//                                 const newServices = [...services];
//                                 newServices[index] = {
//                                   ...service,
//                                   searchTerm: e.target.value,
//                                   isDropdownOpen: true
//                                 };
//                                 setServices(newServices);
//                               }}
//                               onClick={() => {
//                                 const newServices = [...services];
//                                 newServices[index] = {
//                                   ...service,
//                                   isDropdownOpen: true
//                                 };
//                                 setServices(newServices);
//                               }}
//                             />
//                             {service.isDropdownOpen && (
//                               <div className="absolute z-[1000] bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto min-w-[300px] left-0 top-full">
//                                 {getFilteredServices(service.searchTerm || '').map((masterService) => (
//                                   <div
//                                     key={masterService.id}
//                                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                                     onMouseDown={(e) => {
//                                       e.preventDefault();
//                                       handleServiceSelection(index, masterService);
//                                     }}
//                                   >
//                                     {masterService.service_name}
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="p-2">
//                           <input
//                             type="number"
//                             className="w-full p-1 border rounded text-right"
//                             value={service.price}
//                             readOnly
//                           />
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//             <button
//               type="button"
//               onClick={handleAddService}
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Add Services
//             </button>
//             {/* {selectedServices.length > 0 && ( */}
//             <button
//               type="button"
//               onClick={handleDeleteServices}
//               className="mt-4 px-4 py-2 bg-main text-white rounded hover:bg-white hover:text-main border-1 hover:border-main" style={{ marginLeft: '10px' }}
//             >
//               Delete
//             </button>
//             {deleteError && (
//               <p className="text-red-500 mt-2">{deleteError}</p>
//             )}
//             {/* )} */}
//             {/* Add error message display for services */}
//           {errors.services && <p className="text-red-500">{errors.services.message}</p>}
//             <div className="mt-4 flex gap-4">
//                 <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Total Estimate
//               </label>
//               <input
//                 type="text"
//                 className="w-48 p-2 border rounded text-right"
//                 value={totalEstimate}
//                 readOnly
//               />
//                 </div>
//                 <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Actual Total
//               </label>
//               <input
//                 type="text"
//                 className="w-48 p-2 border rounded text-right"
//                 value={actualTotal}
//                 readOnly
//               />
//                 </div>
//                 <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 VAT (20%)
//               </label>
//               <input
//                 type="text"
//                 className="w-48 p-2 border rounded text-right"
//                 value={(parseFloat(actualTotal) * 0.2).toFixed(2)}
//                 readOnly
//               />
//                 </div>
//                 <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Total Payable
//               </label>
//               <input
//                 type="text"
//                 className="w-48 p-2 border rounded text-right"
//                 value={(parseFloat(actualTotal) * 1.2).toFixed(2)}
//                 readOnly
//               />
//                 </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//               <div className="flex flex-col items-center justify-center">
//                 <svg 
//                   className="w-12 h-12 text-blue-500 mb-4" 
//                   fill="none" 
//                   stroke="currentColor" 
//                   viewBox="0 0 24 24" 
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                     strokeWidth="2" 
//                     d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                   />
//                 </svg>
//                 {/* <p className="mb-2 text-gray-700">Drag and drop your files here</p> */}
//                 {/* <p className="text-sm text-gray-500 mb-4">or</p> */}
//                 <button 
//                   type="button"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                   onClick={() => document.getElementById('fileInput')?.click()}
//                 >
//                   Browse Files
//                 </button>
//                 <input 
//                   id="fileInput"
//                   type="file" 
//                   className="hidden"
//                   multiple
//                   accept="image/*"
//                   onChange={(e) => {
//                     const files = e.target.files;
//                     if (files) {
//                       // Check if adding new files would exceed 4 images
//                       if (images.length + files.length > 4) {
//                         alert('You can only upload a maximum of 4 images');
//                         return;
//                       }
//                       const newImages = Array.from(files).map((file, index) => ({
//                         no: images.length + index + 1,
//                         image: URL.createObjectURL(file),
//                         fileName: file.name
//                       }));
//                       setImages([...images, ...newImages]);
//                     }
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Display uploaded images */}
//             {images.length > 0 && (
//               <div className="mt-6">
//                 <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
//                 <div className="grid grid-cols-4 gap-4">
//                   {images.map((img, index) => (
//                     <div key={index} className="relative group bg-white rounded-lg shadow p-2">
//                       <img
//                         src={img.image}
//                         alt={`Upload ${img.no}`}
//                         className="w-3/4 h-40 object-contain rounded-lg mb-2 mx-auto"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           const newImages = images.filter((_, i) => i !== index);
//                           setImages(newImages.map((img, i) => ({ ...img, no: i + 1 })));
//                         }}
//                         className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                       </button>
//                       <div className="flex items-center justify-between px-1">
//                         <p className="text-sm text-gray-600 truncate flex-1" title={img.fileName}>
//                           {img.fileName}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

          
//         </form>
//       </main>
//     </div>
//   );
// }


import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Header } from '../../components/Header';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createServiceDetails } from '../../commonapicall/ServiceDetailsapis/ServiceDetailsapis';
import { apiAxios } from '../../commonapicall/api/apiUrl';
// import React from 'react';

interface Service {
  id: number;
  service_name: string;
  price: string;
  is_deleted: boolean;
}

interface ServiceRow {
  no: number;
  serviceId?: number;
  details: string;
  price: number;
  isDropdownOpen?: boolean;
  searchTerm?: string;
}

interface Booking {
  id: number;
  date: string;
  time: string;
  colour: string | null;
  month: string;
  total_estimate: string | null;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  image4: string | null;
  is_deleted: boolean;
  car: number;
  customer_name: string;
  registration_number: string;
}

// Service details validation schema
const serviceDetailsSchema = z.object({
  booking: z.coerce.number().min(1, {
    message: "Booking ID is required"
  }),
  car: z.coerce.number().min(1, {
    message: "Car is required"
  }),
  customer_name: z.string({
    required_error: "Customer name is required"
  }).nonempty("Customer name is required"),
  services: z.array(z.object({
    serviceId: z.number(),
    details: z.string(),
    price: z.number()
  })).min(1, "At least one service is required")
});

type ServiceDetailsFormData = z.infer<typeof serviceDetailsSchema>;

export const AddServiceDetailsPage = () => {
  const navigate = useNavigate();
  const [totalEstimate, setTotalEstimate] = useState('0.00');
  const [actualTotal, setActualTotal] = useState('0.00');
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [masterServices, setMasterServices] = useState<Service[]>([]);
  const [images, setImages] = useState<Array<{ no: number; image: string; fileName: string }>>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string>('');
  
  // Updated states for booking functionality
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [carNumber, setCarNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, setValue, formState: { errors }, clearErrors } = useForm<ServiceDetailsFormData>({
    resolver: zodResolver(serviceDetailsSchema)
  });

  useEffect(() => {
    fetchData();
    loadServices();
  }, []);

  useEffect(() => {
    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        // If no booking is selected and there's a search term, clear it
        if (!selectedBooking && searchTerm) {
          setSearchTerm('');
          setCarNumber('');
          setCustomerName('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedBooking, searchTerm]);

  const fetchData = async () => {
    // try {
    //   const response = await AppointmentBooking();
    //   setBookings(response.data);
    // } catch (error) {
    //   console.error('Error fetching data:', error);
    // }
    try {
      const response = await apiAxios.get('/api/appointments/dropdown/');
      console.log('Appointments API Response:', response.data); // Debug log

      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
      } else {
        console.error('Unexpected appointments data structure:', response.data);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setBookings([]);
    }
  };

  const loadServices = async () => {
    try {
        const response = await apiAxios.get('/api/services/dropdown/');
      console.log('Services API Response:', response.data); // Debug log

      if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
        setMasterServices(response.data.data);
      } else {
        console.error('Unexpected services data structure:', response.data);
        setMasterServices([]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setMasterServices([]);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.id.toString().includes(searchTerm)
  );

  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
    setSearchTerm(booking.id.toString());
    setIsDropdownOpen(false);

    // Set car number and customer name from booking data
    setCarNumber(booking.car.toString());
    setCustomerName(booking.customer_name);
    setRegistrationNumber(booking.registration_number);

    // Set form values and clear errors
    setValue('booking', booking.id);
    setValue('car', booking.car);
    setValue('customer_name', booking.customer_name);
    clearErrors(['booking', 'car', 'customer_name']);

    // Set the total estimate if available
    if (booking.total_estimate) {
      setTotalEstimate(booking.total_estimate);
    } else {
      setTotalEstimate('0.00');
    }
  };

  const handleAddService = () => {
    setServices([...services, { 
      no: services.length + 1, 
      details: '', 
      price: 0,
      isDropdownOpen: false,
      searchTerm: ''
    }]);
  };

  // Add new function to calculate total price
  const calculateActualTotal = (servicesList: ServiceRow[]) => {
    const total = servicesList.reduce((sum, service) => sum + (service.price || 0), 0);
    return total.toFixed(2);
  };

  const handleServiceSelect = (serviceNo: number) => {
    setSelectedServices(prev => 
      prev.includes(serviceNo) 
        ? prev.filter(no => no !== serviceNo)
        : [...prev, serviceNo]
    );
  };

  // Update the service selection in dropdown to calculate total
  const handleServiceSelection = (index: number, masterService: Service) => {
    const newServices = [...services];
    newServices[index] = {
      ...services[index],
      serviceId: masterService.id,
      details: masterService.service_name,
      price: parseFloat(masterService.price),
      isDropdownOpen: false,
      searchTerm: masterService.service_name
    };
    setServices(newServices);
    setActualTotal(calculateActualTotal(newServices));
    
    // Update form with current services and validate
    const validServices = newServices
      .filter(s => s.serviceId !== undefined)
      .map(s => ({
        serviceId: s.serviceId!,
        details: s.details,
        price: s.price
      }));
    setValue('services', validServices, { shouldValidate: true });
  };

  // Update delete services function to recalculate total
  const handleDeleteServices = () => {
    if (services.length === 0) {
      setDeleteError('Please add at least one service.');
      return;
    }

    if (selectedServices.length === 0) {
      setDeleteError('Please select at least one service to delete.');
      return;
    }
    setDeleteError('');
    
    const remainingServices = services.filter(service => !selectedServices.includes(service.no));
    const reorderedServices = remainingServices.map((service, index) => ({
      ...service,
      no: index + 1
    }));
    setServices(reorderedServices);
    setSelectedServices([]);
    setActualTotal(calculateActualTotal(reorderedServices));
  };

  // Add new function to filter services
  const getFilteredServices = (searchTerm: string) => {
    // Get all currently selected service IDs except for the current row being edited
    const selectedServiceIds = services
      .filter(s => s.serviceId !== undefined)
      .map(s => s.serviceId);

    // Filter services that match the search term and haven't been selected yet
    return masterServices.filter(service => 
      service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedServiceIds.includes(service.id)
    );
  };

  const onSubmit = async () => {
    setDeleteError('');
    setIsLoading(true);
    try {
      // Validate services
      if (services.length === 0) {
        alert('Please add at least one service');
        return;
      }

      const serviceIds = services
        .filter(s => s.serviceId !== undefined)
        .map(s => s.serviceId)
        .filter(id => id !== undefined)
        .join(',');
      
      if (!serviceIds) {
        alert('Please add at least one valid service');
        return;
      }

      if (!selectedBooking) {
        alert('Please select a booking');
        return;
      }

      const formData = new FormData();

      // Process images
      for (let i = 0; i < 4; i++) {
        const image = images[i];
        if (image) {
          try {
            // Convert base64 to Blob
            const base64Response = await fetch(image.image);
            const blob = await base64Response.blob();
            formData.append(`image${i + 1}`, blob, image.fileName);
          } catch (error) {
            console.error(`Error processing image ${i + 1}:`, error);
          }
        } else {
          // Append empty file for missing images
          formData.append(`image${i + 1}`, new Blob(), '');
        }
      }

      const result = await createServiceDetails({
        booking: selectedBooking.id,
        car: parseInt(carNumber),
        customer_name: customerName,
        service_ids: serviceIds,
        image1: formData.get('image1') as File,
        image2: formData.get('image2') as File,
        image3: formData.get('image3') as File,
        image4: formData.get('image4') as File,
        vat_amount: parseFloat((parseFloat(actualTotal) * 0.2).toFixed(2)),
        total_payable: parseFloat((parseFloat(actualTotal) * 1.2).toFixed(2))
      });
      
      if (result.status === 'success') {
        alert('Service details saved successfully');
        navigate('/ServiceDetails');
      } else {
        console.error('Server error:', result.message);
        alert(result.message || 'Failed to save service details');
      }
    } catch (error) {
      console.error('Error saving service details:', error);
      alert('Failed to save service details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update form values when booking is selected
  useEffect(() => {
    if (selectedBooking) {
      setValue('booking', selectedBooking.id);
      setValue('car', parseInt(carNumber));
      setValue('customer_name', customerName);
    }
  }, [selectedBooking, carNumber, customerName, setValue]);

  // Update service_ids when services change
  useEffect(() => {
    // const serviceIds = services
    //   .filter(s => s.serviceId !== undefined)
    //   .map(s => s.serviceId)
    //   .filter(id => id !== undefined)
    //   .join(',');
    
    // Update form with current services
    const validServices = services
      .filter(s => s.serviceId !== undefined)
      .map(s => ({
        serviceId: s.serviceId!,
        details: s.details,
        price: s.price
      }));
    setValue('services', validServices);
  }, [services, setValue]);

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoading && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-main"></div>
        </div>
      )}
      <Header/>
      <main className="p-6 min-h-screen overflow-x-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6 text-xl font-bold border-b-2 border-armsgrey pb-3">
            <h1 className="text-xl font-bold">Add Invoice</h1>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => navigate('/ServiceDetails')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Booking ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={searchTerm}
                    {...register('booking', {
                      onChange: (e) => {
                        const newValue = e.target.value;
                        setSearchTerm(newValue);
                        setIsDropdownOpen(true);
                        
                        if (newValue === '') {
                          setSelectedBooking(null);
                          setCarNumber('');
                          setCustomerName('');
                          setRegistrationNumber('');
                          setValue('booking', 0);
                          setValue('car', 0);
                          setValue('customer_name', '');
                        }
                      }
                    })}
                    onClick={() => setIsDropdownOpen(true)}
                    placeholder="Enter Booking ID"
                  />
                  {errors.booking && <p className="text-red-500 text-sm mt-1">{errors.booking.message}</p>}
                  {isDropdownOpen && filteredBookings.length > 0 && (
                    <div ref={dropdownRef} className="absolute z-10 w-full bg-white rounded-lg shadow p-4 max-h-48 overflow-y-auto">
                      {filteredBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleBookingSelect(booking)}
                        >
                          Booking #{booking.id}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                 Car <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={registrationNumber}
                  readOnly
                  placeholder="This field is auto-populated"
                />
                {/* Hidden input for car ID for form submission */}
                <input type="hidden" {...register('car')} value={carNumber} />
                {errors.car && <p className="text-red-500 text-sm mt-1">{errors.car.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={customerName}
                  readOnly
                  placeholder="Customer name will be auto-populated"
                  {...register('customer_name')}
                />
                {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Services</h2>
            <div className="overflow-visible">
              <table className="w-full relative">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="w-10 p-2"></th>
                    <th className="w-16 p-2 text-left">No.</th>
                    <th className="p-2 text-left">Services Details</th>
                    <th className="w-32 p-2 text-right">Price(&pound;)</th>
                    <th className="w-10 p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">No Data</td>
                    </tr>
                  ) : (
                    services.map((service, index) => (
                      <tr key={index} className="relative">
                        <td className="p-2">
                          <input 
                            type="checkbox"
                            checked={selectedServices.includes(service.no)}
                            onChange={() => handleServiceSelect(service.no)}
                          />
                        </td>
                        <td className="p-2">{service.no}</td>
                        <td className="p-2">
                          <div className="relative">
                            <input
                              type="text"
                              className="w-full p-1 border rounded"
                              value={service.searchTerm || ''}
                              placeholder="Search service..."
                              onChange={(e) => {
                                const newServices = [...services];
                                newServices[index] = {
                                  ...service,
                                  searchTerm: e.target.value,
                                  isDropdownOpen: true
                                };
                                setServices(newServices);
                              }}
                              onClick={() => {
                                const newServices = [...services];
                                newServices[index] = {
                                  ...service,
                                  isDropdownOpen: true
                                };
                                setServices(newServices);
                              }}
                            />
                            {service.isDropdownOpen && (
                              <div className="absolute z-[1000] bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto min-w-[300px] left-0 top-full">
                                {getFilteredServices(service.searchTerm || '').map((masterService) => (
                                  <div
                                    key={masterService.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      handleServiceSelection(index, masterService);
                                    }}
                                  >
                                    {masterService.service_name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            className="w-full p-1 border rounded text-right"
                            value={service.price}
                            readOnly
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={handleAddService}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Services
            </button>
            {/* {selectedServices.length > 0 && ( */}
            <button
              type="button"
              onClick={handleDeleteServices}
              className="mt-4 px-4 py-2 bg-main text-white rounded hover:bg-white hover:text-main border-1 hover:border-main" style={{ marginLeft: '10px' }}
            >
              Delete
            </button>
            {deleteError && (
              <p className="text-red-500 mt-2">{deleteError}</p>
            )}
            {/* )} */}
            {/* Add error message display for services */}
          {errors.services && <p className="text-red-500">{errors.services.message}</p>}
            <div className="mt-4 flex gap-4">
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Estimate
              </label>
              <input
                type="text"
                className="w-48 p-2 border rounded text-right"
                value={totalEstimate}
                readOnly
              />
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Total
              </label>
              <input
                type="text"
                className="w-48 p-2 border rounded text-right"
                value={actualTotal}
                readOnly
              />
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                VAT (20%)
              </label>
              <input
                type="text"
                className="w-48 p-2 border rounded text-right"
                value={(parseFloat(actualTotal) * 0.2).toFixed(2)}
                readOnly
              />
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Payable
              </label>
              <input
                type="text"
                className="w-48 p-2 border rounded text-right"
                value={(parseFloat(actualTotal) * 1.2).toFixed(2)}
                readOnly
              />
                </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <svg 
                  className="w-12 h-12 text-blue-500 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {/* <p className="mb-2 text-gray-700">Drag and drop your files here</p> */}
                {/* <p className="text-sm text-gray-500 mb-4">or</p> */}
                <button 
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={() => document.getElementById('fileInput')?.click()}
                >
                  Browse Files
                </button>
                <input 
                  id="fileInput"
                  type="file" 
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      // Check if adding new files would exceed 4 images
                      if (images.length + files.length > 4) {
                        alert('You can only upload a maximum of 4 images');
                        return;
                      }
                      const newImages = Array.from(files).map((file, index) => ({
                        no: images.length + index + 1,
                        image: URL.createObjectURL(file),
                        fileName: file.name
                      }));
                      setImages([...images, ...newImages]);
                    }
                  }}
                />
              </div>
            </div>

            {/* Display uploaded images */}
            {images.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Uploaded Images</h3>
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group bg-white rounded-lg shadow p-2">
                      <img
                        src={img.image}
                        alt={`Upload ${img.no}`}
                        className="w-3/4 h-40 object-contain rounded-lg mb-2 mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = images.filter((_, i) => i !== index);
                          setImages(newImages.map((img, i) => ({ ...img, no: i + 1 })));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <div className="flex items-center justify-between px-1">
                        <p className="text-sm text-gray-600 truncate flex-1" title={img.fileName}>
                          {img.fileName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          
        </form>
      </main>
    </div>
  );
}



















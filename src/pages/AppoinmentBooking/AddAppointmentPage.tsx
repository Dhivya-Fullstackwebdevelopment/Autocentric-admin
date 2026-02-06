// // AddAppointmentPage
// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
// import { Header } from '../../components/Header';
// import { createAppointment, getVehicleById } from '../../commonapicall/AppointmentBookingapis/AppointmentBookingapis';
// import { z } from 'zod';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { apiAxios } from '../../commonapicall/api/apiUrl';

// // Appointment validation schema
// const appointmentSchema = z.object({
//   car: z.string({
//     required_error: "Car is required"
//   }),
//   date: z.string({
//     required_error: "Date is required"
//   }).nonempty("Date is required"),
//   time: z.string({
//     required_error: "Time is required"
//   }).nonempty("Time is required"),
//   // month: z.string().optional(),
//   services: z.array(z.object({
//     serviceId: z.number(),
//     details: z.string(),
//     price: z.number()
//   })).min(1, "At least one service is required")
// });

// type AppointmentFormData = z.infer<typeof appointmentSchema>;

// interface Vehicle {
//   id: number;
//   customer_name: string;
//   registration_number: string;
//   tax_status: string | null;
//   tax_due_date: string | null;
//   mot_status: string | null;
//   make: string | null;
//   co2_emissions: string | null;
//   engine_capacity: string | null;
//   wheel_plan: string | null;
//   year_of_manufacture: string | null;
//   fuel_type: string | null;
//   marked_for_export: string | null;
//   colour: string | null;
//   type_approval: string | null;
//   date_of_last_v5_issued: string | null;
//   revenue_weight: string | null;
//   mot_expiry_date: string | null;
//   month_of_first_registration: string | null;
//   is_deleted: boolean;
// }

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

// export const AddAppointmentPage = () => {
//   const navigate = useNavigate();
//   const [actualTotal, setActualTotal] = useState('0.00');
//   const [services, setServices] = useState<ServiceRow[]>([]);
//   const [masterServices, setMasterServices] = useState<Service[]>([]);
//   const [images, setImages] = useState<Array<{ no: number; image: string; fileName: string }>>([]);
//   const [selectedServices, setSelectedServices] = useState<number[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCameraLoading, setIsCameraLoading] = useState(false);
//   const [deleteError, setDeleteError] = useState<string>('');

//   // Vehicle states
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
//   const [customerName, setCustomerName] = useState('');
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [selectedTab, setSelectedTab] = useState('details');
//   const [vehicleDetails, setVehicleDetails] = useState<Vehicle | null>(null);

//   // Camera states
//   const [isCameraOpen, setIsCameraOpen] = useState(false);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);

//   const { register, handleSubmit, setValue, formState: { errors } } = useForm<AppointmentFormData>({
//     resolver: zodResolver(appointmentSchema),
//     mode: "onChange",
//     defaultValues: {
//       car: "",
//       date: "",
//       time: "",
//       // month: "",
//       services: []
//     }
//   });

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setIsDropdownOpen(false);
//         // If no vehicle is selected and there's a search term, clear it
//         if (!selectedVehicle && searchTerm) {
//           setSearchTerm('');
//           setCustomerName('');
//         }
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [selectedVehicle, searchTerm]);

//   useEffect(() => {
//     loadVehicles();
//     loadServices();
//   }, []);

//   // Camera effect
//   useEffect(() => {
//     if (isCameraOpen) {
//       const initCamera = async () => {
//         try {
//           setIsCameraLoading(true);
//           const constraints = {
//             video: {
//               width: { ideal: 1280 },
//               height: { ideal: 720 },
//               facingMode: "environment"
//             }
//           };

//           const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
//           setStream(mediaStream);
          
//           if (videoRef.current) {
//             videoRef.current.srcObject = mediaStream;
//             await videoRef.current.play();
//           }
//         } catch (err) {
//           console.error("Error accessing camera:", err);
//           alert("Camera access error. Check permissions and camera connection.");
//         } finally {
//           setIsCameraLoading(false);
//         }
//       };

//       initCamera();
//     } else {
//       // Cleanup stream when camera is closed
//       if (stream) {
//         stream.getTracks().forEach(track => track.stop());
//         setStream(null);
//       }
//     }
//   }, [isCameraOpen]);

//   const loadVehicles = async () => {
//     try {
//       const response = await apiAxios.get('/api/appointments/vehicles/');
//       console.log('Vehicles API Response:', response.data); // Debug log

//       if (response.data?.status === 'success' && Array.isArray(response.data.data)) {
//         setVehicles(response.data.data);
//       } else {
//         console.error('Unexpected vehicles data structure:', response.data);
//         setVehicles([]);
//       }
//     } catch (error) {
//       console.error('Error fetching vehicles:', error);
//       setVehicles([]);
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

//   const calculateActualTotal = (servicesList: ServiceRow[]) => {
//     const total = servicesList.reduce((sum, service) => sum + (service.price || 0), 0);
//     return total.toFixed(2);
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

//   const handleServiceSelect = (serviceNo: number) => {
//     setSelectedServices(prev =>
//       prev.includes(serviceNo)
//         ? prev.filter(no => no !== serviceNo)
//         : [...prev, serviceNo]
//     );
//   };

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

//   const filteredVehicles = vehicles.filter(vehicle =>
//     vehicle.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleVehicleSelect = async (vehicle: Vehicle) => {
//     setSelectedVehicle(vehicle);
//     setSearchTerm(vehicle.registration_number);
//     setCustomerName(vehicle.customer_name);
//     setIsDropdownOpen(false);

//     try {
//       const details = await getVehicleById(vehicle.id);
//       setVehicleDetails(details);
//     } catch (error) {
//       console.error("Failed to fetch vehicle details:", error);
//     }
//   };

//   const captureImage = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       const video = videoRef.current;
//       const canvas = document.createElement('canvas');
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
      
//       const ctx = canvas.getContext('2d');
//       if (ctx) {
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
//         // Convert to data URL
//         const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
//         const fileName = `Camera_Image_${new Date().toISOString().replace(/:/g, '-')}.jpg`;
        
//         setImages(prev => [
//           ...prev, 
//           { 
//             no: prev.length + 1, 
//             image: imageUrl, 
//             fileName 
//           }
//         ]);
//       }
//     }
//     setIsCameraOpen(false);
//   };

//   const closeCamera = () => {
//     setIsCameraOpen(false);
//   };

//   const onSubmit = async (data: AppointmentFormData) => {
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

//       // Create FormData object
//       const formData = new FormData();
//       formData.append('car', selectedVehicle!.id.toString());
//       formData.append('date', data.date);
//       formData.append('time', data.time);
//       // formData.append('month', data.month);
//       formData.append('service_ids', serviceIds);

//       // Handle image uploads
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

//       const result = await createAppointment({
//         car: selectedVehicle!.id,
//         date: data.date,
//         time: data.time,
//         service_ids: serviceIds,
//         image1: formData.get('image1') as File,
//         image2: formData.get('image2') as File,
//         image3: formData.get('image3') as File,
//         image4: formData.get('image4') as File
//       });
      
//       if (result.status === 'success') {
//         alert('Appointment saved successfully');
//         navigate('/AppoinmentBookingTable');
//       } else {
//         console.error('Server error:', result.message);
//         alert(result.message || 'Failed to save appointment');
//       }
//     } catch (error) {
//       console.error('Error saving appointment:', error);
//       alert('Failed to save appointment. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Update form values when vehicle is selected
//   useEffect(() => {
//     if (selectedVehicle) {
//       setValue('car', selectedVehicle.id.toString());
//     }
//   }, [selectedVehicle, setValue]);

//   // Update service_ids when services change
//   useEffect(() => {
//     const serviceIds = services
//       .filter(s => s.serviceId !== undefined)
//       .map(s => s.serviceId)
//       .filter(id => id !== undefined)
//       .join(',');
//     console.log("serviceIds", serviceIds);
    
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
//       <Header />
//       <main className="p-6">
//         <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6">
//           <div className="flex justify-between items-center mb-6 text-xl font-bold border-b-2 border-acgrey pb-3 mt-6">
//             <h2 className="text-2xl font-bold">Add Appointment Booking</h2>
//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => navigate('/AppoinmentBookingTable')}
//                 className="px-6 py-2 text-black font-semibold rounded hover:bg-gray-100"
//               >
//                 Back
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-main font-semibold text-white rounded hover:bg-white hover:text-main border-1 hover:border-main"
//               >
//                 Save
//               </button>
//             </div>
//           </div>

//           {/* Tab Navigation */}
//           <div className="flex border-b border-gray-200 mb-6">
//             <button
//               className={`py-2 px-4 mr-2 ${
//                 selectedTab === 'details'
//                   ? 'border-b-2 border-main text-main font-semibold'
//                   : 'text-gray-500 hover:text-main'
//               }`}
//               onClick={() => setSelectedTab('details')}
//               type="button"
//             >
//               Details
//             </button>
//             <button
//               className={`py-2 px-4 ${
//                 selectedTab === 'car'
//                   ? 'border-b-2 border-main text-main font-semibold'
//                   : 'text-gray-500 hover:text-main'
//               }`}
//               onClick={() => setSelectedTab('car')}
//               type="button"
//             >
//               Car Details
//             </button>
//           </div>

//           {/* Tab Content */}
//           {selectedTab === 'details' && (
//             <div>
//             <div className="mb-6">
//                 <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Car <span className="text-red-500">*</span>
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
//                       value={searchTerm}
//                       placeholder="Search registration number..."
//                       onChange={(e) => {
//                         const newValue = e.target.value;
//                         setSearchTerm(newValue);
//                         setIsDropdownOpen(true);
//                         if (newValue === '') {
//                           setCustomerName('');
//                           setSelectedVehicle(null);
//                           setValue('car', '', { shouldValidate: true });
//                         }
//                       }}
//                       onClick={() => setIsDropdownOpen(true)}
//                       autoComplete="off"
//                     />
//                     {errors.car && (
//                       <p className="text-red-500 text-sm mt-1">{errors.car.message}</p>
//                     )}
//                     {isDropdownOpen && (
//                       <div
//                         ref={dropdownRef}
//                         className="absolute z-[1000] bg-white border rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto min-w-[300px] left-0 top-full"
//                       >
//                         {filteredVehicles.length === 0 ? (
//                           <div className="p-2 text-gray-500">No vehicles found</div>
//                         ) : (
//                           filteredVehicles.map((vehicle) => (
//                             <div
//                               key={vehicle.id}
//                               className="p-2 hover:bg-gray-100 cursor-pointer"
//                               onMouseDown={() => handleVehicleSelect(vehicle)}
//                             >
//                               {vehicle.registration_number} - {vehicle.customer_name}
//                             </div>
//                           ))
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Customer Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={customerName}
//                     onChange={(e) => setCustomerName(e.target.value)}
//                     readOnly
//                   />
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="date"
//                     className={`w-full p-2 border border-acgrey rounded`}
//                     {...register('date', {
//                       onChange: (e) => {
//                         setValue('date', e.target.value, { shouldValidate: true });
//                       }
//                     })}
//                   />
//                   {errors.date && <p className="text-red-500">{errors.date.message}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Time <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="time"
//                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
//                     {...register('time', {
//                       onChange: (e) => {
//                         setValue('time', e.target.value, { shouldValidate: true });
//                       }
//                     })}
//                   />
//                   {errors.time && <p className="text-red-500">{errors.time.message}</p>}
//                 </div>
//                 {/* <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Month <span className="text-red-500">*</span>
//                   </label>
//                   <select 
//                     className="mt-1 block w-full border-2 border-acgrey rounded px-3 py-2 focus-within:outline-none"
//                     {...register('month', {
//                       onChange: (e) => {
//                         setValue('month', e.target.value, { shouldValidate: true });
//                       }
//                     })}
//                   >
//                     <option value="">Select Month</option>
//                     <option value="1">January</option>
//                     <option value="2">February</option>
//                     <option value="3">March</option>
//                     <option value="4">April</option>
//                     <option value="5">May</option>
//                     <option value="6">June</option>
//                     <option value="7">July</option>
//                     <option value="8">August</option>
//                     <option value="9">September</option>
//                     <option value="10">October</option>
//                     <option value="11">November</option>
//                     <option value="12">December</option>
//                   </select>
//                   {errors.month && <p className="text-red-500">{errors.month.message}</p>}
//                 </div> */}
//               </div>
//             </div>

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
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {services.length === 0 ? (
//                     <tr>
//                       <td colSpan={4} className="text-center py-4 text-gray-500">No Data</td>
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
//                             className="w-full p-1 border-2 border-acgrey rounded text-right"
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
//               className="mt-4 px-4 py-2 bg-main text-white rounded hover:bg-white hover:text-main border-1 hover:border-main"
//             >
//               Add Services
//             </button>
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
//             {errors.services && <p className="text-red-500">{errors.services.message}</p>}
//             <div className="mt-4 flex gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Total Estimate
//                 </label>
//                 <input
//                   type="text"
//                   className="w-48 p-2 border-2 border-acgrey rounded text-right"
//                   value={actualTotal}
//                   readOnly
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-4">Upload Files</h2>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//               <div className="flex flex-col items-center justify-center">
//                 <svg
//                   className="w-12 h-12 text-main mb-4"
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
//                 <div className="flex gap-4">
//                   <button
//                     type="button"
//                     className="px-4 py-2 bg-main text-white rounded hover:bg-white hover:text-main border-1 hover:border-main focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                     onClick={() => document.getElementById('fileInput')?.click()}
//                   >
//                     Browse Files
//                   </button>
//                   <button
//                     type="button"
//                     className="px-4 py-2 bg-main text-white rounded hover:bg-white hover:text-main border-1 hover:border-main focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                     onClick={() => setIsCameraOpen(true)}
//                   >
//                     <div className="flex items-center">
//                       <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                       </svg>
//                       Capture Image
//                     </div>
//                   </button>
//                 </div>
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

//             {/* Camera Modal */}
//             {isCameraOpen && (
//               <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//                 <div className="bg-white rounded-lg p-6 w-full max-w-md">
//                   <div className="flex justify-between items-center mb-4">
//                     <h3 className="text-xl font-bold">Capture Image</h3>
//                     <button
//                       type="button"
//                       onClick={closeCamera}
//                       className="text-gray-500 hover:text-gray-700"
//                     >
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
                  
//                   {isCameraLoading ? (
//                     <div className="h-64 flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-main"></div>
//                       <p className="ml-4">Initializing camera...</p>
//                     </div>
//                   ) : (
//                     <>
//                       <video 
//                         ref={videoRef} 
//                         autoPlay 
//                         playsInline 
//                         muted
//                         className="w-full h-auto bg-black rounded-lg mb-4 max-h-[60vh]"
//                       />
                      
//                       <div className="flex justify-center">
//                         <button
//                           type="button"
//                           onClick={captureImage}
//                           className="px-6 py-3 bg-main text-white rounded-lg hover:bg-blue-600 flex items-center text-lg"
//                         >
//                           <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
//                           </svg>
//                           Capture Photo
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}

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
//           </div>
//           )}
//           {selectedTab === 'car' && (
//             <div className="mb-6">
//               <div className="grid grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Tax Status
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.tax_status || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Engine Capacity
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.engine_capacity || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Type Approval
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.type_approval || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Tax Due Date
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.tax_due_date || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Co2 Emissions
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.co2_emissions || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Date Of Last V5 Issued
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.date_of_last_v5_issued || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     MOT Status
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.mot_status || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Fuel Type
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.fuel_type || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Revenue Weight
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.revenue_weight || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Make
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.make || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Marked For Export
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.marked_for_export || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     MOT Expiry Date
//                   </label>
//                   <input
//                     type="date"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.mot_expiry_date || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Wheel Plan
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.wheel_plan || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Colour
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.colour || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Year Of Manufacture
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.year_of_manufacture || ''}
//                     readOnly
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Month Of First Registration
//                   </label>
//                   <input
//                     type="text"
//                     className="w-full p-2 border-2 border-acgrey rounded"
//                     value={vehicleDetails?.month_of_first_registration || ''}
//                     readOnly
//                   />
//                 </div>
//               </div>
//             </div>
//           )}
//         </form>
//       </main>
//     </div>
//   );
// };
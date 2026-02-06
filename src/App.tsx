import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { WelcomePage } from './components/WelcomePage'
import { CustomerInfo } from './pages/CustomerInfo';
import { Vehicles } from './pages/Vehicles';
import { ServiceMaster } from './pages/ServiceMaster';
import { ServiceDetails } from './pages/ServiceDetails';
import { AppoinmentBooking } from './pages/AppointmentBooking';
// import { AddCustomerPage } from './pages/CustomerInfo/AddCustomerInfo';
import { AddServicemasterPage } from './pages/ServicesMaster.tsx/AddServiceMaster';
// import { AddAppointmentPage } from './pages/AppoinmentBooking/AddAppointmentPage';
import { VehicleAddForm } from './pages/Vehicles/AddVehicleForm';
import { ResetPassWord } from './components/Header/ResetPassWord';
import { LoginForm } from './components/Login/loginpage';
import { AddServiceDetailsPage } from './pages/ServiceDetails/AddServiceDetailsPage';
// import { EditCustomerPage } from './pages/CustomerInfo/EditCustomerInfo';
import { EditServicemasterPage } from './pages/ServicesMaster.tsx/EditServiceMaster';
import { EditVehicleForm } from './pages/Vehicles/EditVehicleForm';
import { EditAppointmentBookingPage } from './pages/AppoinmentBooking/EditAppointmentBookingPage';
import { EditServiceDetailsPage } from './pages/ServiceDetails/EditServiceDetailsPage';
import { AddCustomerInfoPage } from './components/CustomerInfoPopups/AddCustomerInfopopup';
import { EditCustomerInfoPage } from './components/CustomerInfoPopups/EditCustomerInfopopup';
import { AddAppointmentBookingPage } from './components/AppointmentBookingPopups/AddAppointmentBookingPopup';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/WelcomePage" element={<WelcomePage />} />
        <Route path="/CustomerInfo" element={<CustomerInfo />} />
        {/* <Route path="/CustomerInfo/AddCustomerinfo" element={<AddCustomerPage />} />
        <Route path="/CustomerInfo/EditCustomerinfo/:id" element={<EditCustomerPage />} /> */}
        <Route path="/CustomerInfo/AddCustomerinfo" element={<AddCustomerInfoPage />} />
        <Route path="/CustomerInfo/EditCustomerinfo/:id" element={<EditCustomerInfoPage />} />
        <Route path='/vehicle' element={<Vehicles />} />
        <Route path='/ServiceMaster' element={<ServiceMaster />} />
        <Route path='/ServiceMaster/AddServicemasterPage' element={<AddServicemasterPage />} />
        <Route path='/ServiceDetails/AddServiceDetailsPage' element={<AddServiceDetailsPage />} />
        <Route path='/ServiceDetails' element={<ServiceDetails />} />
        <Route path='/AppoinmentBookingTable' element={<AppoinmentBooking />} />
        <Route path='/AppoinmentBookingTable/AddAppointmentBooking' element={<AddAppointmentBookingPage />} />
        {/* <Route path='/AppoinmentBookingTable/EditAppointmentBooking/:id' element={<EditAppointmentBookingPage />} /> */}
        <Route path="/AppoinmentBookingTable/EditAppointmentBookingPage/:id" element={<EditAppointmentBookingPage />} />
        {/* <Route path='/AppoinmentBookingTable/AddAppointmentPage' element={<AddAppointmentPage />} /> */}
        <Route path='/vehicle/AddVehicleForm' element={<VehicleAddForm />} />
        <Route path='/ResetPassWord' element={<ResetPassWord />} />
        <Route path='/ServiceMaster/EditServicemasterPage/:id' element={<EditServicemasterPage />} />
        <Route path='/vehicle/EditVehicleForm/:id' element={<EditVehicleForm />} />
        <Route path='/AppoinmentBookingTable/EditAppointmentBookingPage/:id' element={<EditAppointmentBookingPage />} />
        <Route path='/ServiceDetails/EditServiceDetailsPage/:id' element={<EditServiceDetailsPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
export default App

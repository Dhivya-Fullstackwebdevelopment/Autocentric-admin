// components/Dashboard/Dashboard.tsx
//import {Header} from "../components/Header"

import { Header } from "../components/Header";
import { CustomerInfoTable } from "./CustomerInfo/CustomerInfoTable";

export const CustomerInfo = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <CustomerInfoTable/>
    </div>
  );
}

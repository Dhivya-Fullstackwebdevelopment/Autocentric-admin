import { FaCar, FaClipboardList, FaTools, FaUsers } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export type Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export interface DashboardMetrics {
  customer_count: number;
  service_count: number;
  vehicle_count: number;
  current_open_appointments: number;
  invoice_count_this_year_by_month: {
    [month: string]: number; // or use `Record<Month, number>` for stricter typing
  };
}

export interface DashboardResponse {
  status: string;
  message: string;
  data: DashboardMetrics;
  count: DashboardMetrics | null
}
interface CountCardsProps {
  count: DashboardMetrics | null;
}
export const CountCards: React.FC<CountCardsProps> = ({ count }) => {
  const navigate = useNavigate();

  const cardData = [
    { 
      title: "Customers Count", 
      count: count?.customer_count, 
      color: "red", 
      icons: <FaUsers className="inline-block text-xl" />,
      path: "/CustomerInfo"
    },
    { 
      title: "Service Count", 
      count: count?.service_count, 
      color: "blue", 
      icons: <FaTools className="inline-block text-xl" />,
      path: "/ServiceMaster"
    },
    { 
      title: "Vehicle Count", 
      count: count?.vehicle_count, 
      color: "green", 
      icons: <FaCar className="inline-block text-xl" />,
      path: "/vehicle"
    },
    { 
      title: "Current Open Appointments", 
      count: count?.current_open_appointments, 
      color: "yellow", 
      icons: <FaClipboardList className="inline-block text-xl" />,
      path: "/AppoinmentBookingTable"
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cardData.map((card, index) => (
        <div 
          key={index} 
          className={`bg-white shadow-md rounded-md p-4 border-b-4 text-${card.color}-600 cursor-pointer hover:shadow-lg transition-shadow duration-200`}
          onClick={() => navigate(card.path)}
        >
          <h3 className={`text-2xl font-bold text-${card.color}-600`}>{card.count}</h3>
          <p className="text-sm text-gray-700">{card.title}</p>
          <div className={`text-${card.color}-600 text-right`}>
            {card.icons}
          </div>
        </div>
      ))}
    </div>
  )
}

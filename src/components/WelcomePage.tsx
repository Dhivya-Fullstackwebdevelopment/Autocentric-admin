// src/pages/WelcomePage.tsx
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { CountCards, type DashboardMetrics, type DashboardResponse } from '../pages/DashBoard/CountCards';
import { InvoiceBarChart } from '../pages/DashBoard/MonthChart';
import { apiAxios } from '../commonapicall/api/apiUrl';

export const WelcomePage: React.FC = () => {

   const[count,setCount]=useState<DashboardMetrics | null>(null)
  
   useEffect(() => {
      const fetchCount = async () => {
        try {
          const response = await apiAxios.get<DashboardResponse>('/api/dashboard-counts/');
        
          setCount(response.data.data);
        } catch (error) {
          console.error('Error fetching dashboard count:', error);
        }
      };
      fetchCount();
    }, []);
  
  return (
    <>
      <Header />
       
       <section className="pt-10 px-4 pb-20 bg-gray-50 w-full">
      <div className='mb-3'>
          <h1 className="text-5xl text-main font-bold  pb-7  text-center">
          Dashboard
        </h1>
      </div>
        <div className="max-w-6xl mx-auto">
          <CountCards count={count} />
          <InvoiceBarChart count={count}/>
        </div>
      </section>
      
    </>
  );
};

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import type { DashboardMetrics } from './CountCards';

interface CountCardsProps {
  count: DashboardMetrics | null;
}

export const InvoiceBarChart: React.FC<CountCardsProps> = ({count}) => {

    const staticData = [
  { month: 'January', count:count?.invoice_count_this_year_by_month.January },
  { month: 'February', count: count?.invoice_count_this_year_by_month.February},
  { month: 'March', count: count?.invoice_count_this_year_by_month.March},
  { month: 'April', count: count?.invoice_count_this_year_by_month.April },
  { month: 'May', count: count?.invoice_count_this_year_by_month.May },
  { month: 'June', count:count?.invoice_count_this_year_by_month.June },
];

  return (
    <div className="bg-white shadow-md rounded-md p-6  mt-8">
      <h2 className="text-xl text-main font-semibold text-center mb-4">Invoice Count</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={staticData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#006db7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

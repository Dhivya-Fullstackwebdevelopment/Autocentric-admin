import React from 'react'
import { Header } from '../components/Header'
import { AppoinmentBookingTable } from './AppoinmentBooking/AppoinmentBookingTable'


export const AppoinmentBooking: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <AppoinmentBookingTable />
      </div>
    </>
  )
}

import React from 'react'
import { Header } from '../components/Header'
import { VehicleInfoTable } from './Vehicles/VehiclesTable'

export const Vehicles: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <VehicleInfoTable />
      </div>
    </>
  )
}

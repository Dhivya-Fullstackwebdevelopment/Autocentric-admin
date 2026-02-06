import React from 'react'
import { Header } from '../components/Header'
import { ServiceMasterInfoTable } from './ServicesMaster.tsx/ServiceMasterTable'

export const ServiceMaster: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <ServiceMasterInfoTable />
      </div>
    </>
  )
}

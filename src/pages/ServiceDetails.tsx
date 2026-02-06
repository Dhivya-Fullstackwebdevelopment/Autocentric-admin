import React from 'react'
import { Header } from '../components/Header'
import { ServiceDetailsInfoTable } from './ServiceDetails/ServiceDetailsTable'

export const ServiceDetails:React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header/>
        <ServiceDetailsInfoTable/>
    </div>
    </>
  )
}

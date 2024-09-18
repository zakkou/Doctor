import React from 'react'
import { Link } from "react-router-dom";
import PaymentTable from '../../components/PaymentTable'
const Payment = () => {
  return (
    <div>
      <Link to="/payment-receipt" className="btn" style={{marginTop:"20px"}}>Ajouter </Link>
      <PaymentTable/>
    </div>
  )
}

export default Payment
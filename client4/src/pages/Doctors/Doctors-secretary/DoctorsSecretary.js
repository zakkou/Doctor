import React from 'react'
import { Link } from "react-router-dom";
import SecretaryTable from '../../../components/SecretaryTable';
const DoctorsSecretary = () => {
  return (
    <div>
      <Link to="add-secretary" className="btn" style={{marginTop:"20px"}}>Ajouter une sécretaire</Link>
      <SecretaryTable />
    </div>
  )
}

export default DoctorsSecretary
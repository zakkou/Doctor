import React from 'react';

import { Link } from 'react-router-dom';
import PrescriptionTable from '../../components/PrescriptionTable';
const Prescreption = () => {
  return (
    <div>
      {/* <h1>Réservation de rendez-vous</h1> */}
        <Link to="/dashboard/add-prescription" className="btn" style={{marginTop:"20px"}}>Ajouter une ordonnance </Link>
       <PrescriptionTable/>
      {/* <AppointmentForm />   */}
    </div>
  );
};

export default Prescreption; 
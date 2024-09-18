import React from 'react';

import { Link } from 'react-router-dom';
import AppointmentTable from '../components/AppointmentTable';
const AppointmentPage = () => {
  return (
    <div>
      {/* <h1>Réservation de rendez-vous</h1> */}
        <Link to="/dashboard/add-appointment" className="btn" style={{marginTop:"20px"}}>Ajouter un rendez-vous </Link>
       <AppointmentTable/>
      {/* <AppointmentForm />   */}
    </div>
  );
};

export default AppointmentPage; 
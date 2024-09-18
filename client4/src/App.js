import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AppointmentPage from './pages/AppointmentPage'; // Import de la page de rendez-vous
import PaymentReceiptPage from './pages/PaymentReceiptPage'; // Import de la page du reçu

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Payment from './pages/Sectretary/Payment';
import DoctorsSecretary from './pages/Doctors/Doctors-secretary/DoctorsSecretary';
import AddSecretary from './pages/Doctors/Doctors-secretary/AddSecretay';
import Dashboard from './pages/Dashboard';
import AppointmentForm from "./components/forms/AppointmentForm"
import PrescriptionPage from './pages/PrescriptionPage';
import Prescreption from './pages/Doctors/Prescreption';
import Calendar from './pages/Calendar';
import EditSecretary from './pages/Doctors/Doctors-secretary/EditSecretary';
import EditAppointment from './pages/EditAppointment';
import EditPayment from './pages/EditPayment';
import EditPrescription from './pages/EditPrescription';
import "./App.css"
function App() {
  return (
    <>
    
        <Router>
          <Navbar />
          <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard/appointment" element={<AppointmentPage />} />  {/* Route vers la page de rendez-vous */}
            <Route path="/payment-receipt" element={<PaymentReceiptPage />} />  {/* Route vers la page du reçu */}
            <Route path="/dashboard/add-prescription" element={<PrescriptionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/secretary" element={<DoctorsSecretary />} />
            <Route path="/dashboard/secretary/edit-secretary/:id" element={<EditSecretary />} />
            <Route path="/dashboard/paiement/edit-payment/:id" element={<EditPayment />} />
            <Route path="/dashboard/ordonnance/edit-prescription/:id" element={<EditPrescription />} />
            <Route path="/dashboard/appointment/edit-appointment/:id" element={<EditAppointment />} />
            <Route path="/dashboard/secretary/add-secretary" element={<AddSecretary />} />
            <Route path="/dashboard/paiement" element={<Payment />} />
            <Route path="/dashboard/ordonnance" element={<Prescreption />} />
            <Route path="/dashboard/calendrier" element={<Calendar />} />
            <Route path="/dashboard/add-appointment" element={<AppointmentForm />} />
          </Routes>
          </div>
        </Router>
     
      <Footer />
    </>


  );
}

export default App;

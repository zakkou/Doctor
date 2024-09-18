import React, { useState, useEffect  } from 'react';
import jsPDF from 'jspdf';
import '../assets/styles/PaymentReceiptForm.css'; // Assure-toi que le chemin du fichier est correct
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';

import { API_URL } from "../env"; 
import { useDispatch, useSelector } from 'react-redux'; 

const EditPayment = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { state } = useLocation();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const doctorId = user.user._secretary.doctorId;
  const token = user.token;
  useEffect(() => {
   
    if (state) {
      setValue('doctorName', state.doctorName);  // Remplir le champ "name"
      setValue('patientName', state.patientName);
      setValue('date', state.date);
      setValue('amountPaid', state.amountPaid); // Remplir le champ "email"
      setValue('paymentDetails', state.paymentDetails);
    }
  }, [state, setValue]);
  const [errorMessage, setErrorMessage] = useState(null);


 

  const onSubmit = async (data) => {
   
    try {
      const response = await axios.put(`${API_URL}/api/edit-payment/${state._id}`, data, {
        headers: {
          Authorization: `${token}`,
        }
      });
      if (response.status === 201) {
        navigate('/dashboard/paiement');
      }
    } catch (error) {
      console.log('err:,e',error)
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite lors de l'inscription.");
    } finally {
      navigate('/dashboard/paiement');
    }
  };

  return (
    <div className="form-container">
      <h2>Remplir le reçu de paiement</h2>
      <form className="payment-receipt-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="doctorName">Nom du docteur</label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            {...register("doctorName")}
            placeholder="Entrez le nom du docteur"
          />
        </div>

        <div className="form-group">
          <label htmlFor="patientName">Nom du patient</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            {...register("patientName")}
            placeholder="Entrez le nom du patient"
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            {...register("date")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amountPaid">Montant payé (€)</label>
          <input
            type="number"
            id="amountPaid"
            name="amountPaid"
            {...register("amountPaid")}
            placeholder="Entrez le montant payé"
          />
        </div>

        <div className="form-group">
          <label htmlFor="paymentDetails">Détails du paiement</label>
          <textarea
            id="paymentDetails"
            name="paymentDetails"
            {...register("paymentDetails")}
            placeholder="Détails supplémentaires sur le paiement"
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn--primary">
          Confirmer 
        </button>
      </form>
    </div>
  );
};

export default EditPayment;


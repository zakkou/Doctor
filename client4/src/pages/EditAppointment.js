import React, { useState , useEffect } from 'react';
import '../assets/styles/AppointmentForm.css'; // Assure-toi que le chemin du fichier est correct
import { API_URL } from "../env"; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';

const EditAppointment = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { state } = useLocation();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const doctorId = user?._secretary?.doctorId ?? user?.user?._id;
  const [errorMessage, setErrorMessage] = useState(null);
  const token = user.token;
  useEffect(() => {
    if (state) {
      setValue('doctorName', state.doctorName);  
      setValue('patientName', state.patientName);
      setValue('appointmentDate', state.appointmentDate); 
      setValue('appointmentTime', state.appointmentTime); 
      setValue('description', state.description);
    }
  }, [state, setValue]);
  const onSubmit = async (data) => {
    const formData = { ...data, doctorId };
    
    try {
      const response = await axios.put(`${API_URL}/api/editReservation/${state._id}`, formData, {
        headers: {
          Authorization: `${token}`,
        }
      });
      if (response.status === 201) {
        // Redirigez l'utilisateur vers la page de connexion ou autre page après inscription
      
        navigate('/dashboard/appointment');
      }
    } catch (error) {
      console.log('err:,e',error)
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite lors de l'inscription.");
    } finally {
      navigate('/dashboard/appointment');
    }
   
    // Ici, tu peux ajouter une logique pour envoyer les données à une base de données ou API.
  };

  return (
    <div className="form-container">
      <h2>Réserver un rendez-vous</h2>
      <form className="appointment-form" onSubmit={handleSubmit(onSubmit)}>
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
          <label htmlFor="appointmentDate">Date du rendez-vous</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            {...register("appointmentDate")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="appointmentTime">Heure du rendez-vous</label>
          <input
            type="time"
            id="appointmentTime"
            name="appointmentTime"
            {...register("appointmentTime")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            {...register("description")}
            placeholder="Détails du rendez-vous"
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn--primary">
          Confirmer le rendez-vous
        </button>
      </form>
    </div>
  );
};

export default EditAppointment;
 
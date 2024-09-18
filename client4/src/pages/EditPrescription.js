import React, { useState, useEffect } from 'react';
import '../assets/styles/PrescriptionForm.css'; // Assure-toi que le chemin du fichier est correct
import { API_URL } from "../env";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from 'axios';

const EditPrescription = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { state } = useLocation();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const doctorId = user?._secretary?.doctorId ?? user?.user?._id;
  const [errorMessage, setErrorMessage] = useState(null);
  const token = user.token;


  useEffect(() => {
    // Pré-remplir les champs du formulaire avec les données envoyées dans le state
    if (state) {
      setValue('doctorName', state.doctorName);  // Remplir le champ "name"
      setValue('patientName', state.patientName);
      setValue('date', state.date);
      setValue('medications', state.medications); // Remplir le champ "email"
    }
  }, [state, setValue]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`${API_URL}/api/editPrescription/${state._id}`, data, {
        headers: {
          Authorization: `${token}`,
        }
      });
      if (response.status === 201) {
        // Redirigez l'utilisateur vers la page de connexion ou autre page après inscription

        navigate('/dashboard/ordonnance');
      }
    } catch (error) {
      console.log('err:,e', error)
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite lors de l'inscription.");
    } finally {

      navigate('/dashboard/ordonnance');
    }
    // Génère le PDF après la confirmation
  };

  return (
    <div className="form-container">
      <h2>Modifier l'ordonnance</h2>
      <form className="prescription-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="doctorName">Nom du docteur</label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            placeholder="Entrez le nom du docteur"
            {...register("doctorName")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="patientName">Nom du patient</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            placeholder="Entrez le nom du patient"
            {...register("patientName")}
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
          <label htmlFor="medications">Médicaments</label>
          <textarea
            id="medications"
            name="medications"
            placeholder="Listez les médicaments ici"
            rows="5"
            {...register("medications")}
          />
        </div>

        <button type="submit" className="btn btn--primary">
          Confirmer
        </button>
      </form>
    </div>
  );
};

export default EditPrescription;


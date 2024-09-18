import React, { useState } from 'react';
import '../../assets/styles/AppointmentForm.css'; // Assure-toi que le chemin du fichier est correct
import axios from 'axios';
import { API_URL } from "../../env"; 
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const AppointmentForm = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const doctorId = user?.user?._secretary?.doctorId ?? user?.user?._id;
  // React.useEffect(()=>{
  // console.log("user:",user)
  // console.log("user?.user?._secretary?.doctorId:",user?.user?._secretary?.doctorId)
  // console.log("doctorId:",doctorId)
  // },[])
  const [errorMessage, setErrorMessage] = useState(null);
  const token = user.token;
  const [formData, setFormData] = useState({
    doctorName: '',
    patientName: '',
    appointmentDate: '', 
    appointmentTime: '', 
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();
    const data = { ...formData, doctorId };
    
    try {
      const response = await axios.post(`${API_URL}/api/add-reservation`, data, {
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
      alert(`Rendez-vous confirmé pour le ${formData.appointmentDate} à ${formData.appointmentTime}`);
      navigate('/dashboard/appointment');
    }
   
    // Ici, tu peux ajouter une logique pour envoyer les données à une base de données ou API.
  };

  return (
    <div className="form-container">
      <h2>Réserver un rendez-vous</h2>
      <form className="appointment-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="doctorName">Nom du docteur</label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            placeholder="Entrez le nom du docteur"
          />
        </div>

        <div className="form-group">
          <label htmlFor="patientName">Nom du patient</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            placeholder="Entrez le nom du patient"
          />
        </div>

        <div className="form-group">
          <label htmlFor="appointmentDate">Date du rendez-vous</label>
          <input
            type="date"
            id="appointmentDate"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="appointmentTime">Heure du rendez-vous</label>
          <input
            type="time"
            id="appointmentTime"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
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

export default AppointmentForm;
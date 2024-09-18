import React, { useState } from 'react';
import jsPDF from 'jspdf';
import '../../assets/styles/PrescriptionForm.css'; // Ensure the path is correct
import { API_URL } from "../../env";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const PrescriptionForm = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const doctorId = user?.user?._secretary?.doctorId ?? user?.user?._id;
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading
  const token = user.token;
  const [formData, setFormData] = useState({
    doctorName: '',
    patientName: '',
    date: '',
    symptoms: '',
    medications: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Ordonnance Médicale', 20, 20);
    doc.setFontSize(12);
    doc.text(`Docteur : ${formData.doctorName}`, 20, 40);
    doc.text(`Patient : ${formData.patientName}`, 20, 50);
    doc.text(`Date : ${formData.date}`, 20, 60);
    doc.text('Médicaments :', 20, 70);
    doc.text(`${formData.medications}`, 20, 80);

    // Save the PDF file
    doc.save(`ordonnance_${formData.patientName}.pdf`);
  };

  const handleFetchMedications = async () => {
    setLoading(true); // Set loading to true before the request
    try {
      // Send symptoms to FastAPI for prediction
      const response = await axios.get(`http://127.0.0.1:8000/med/?symptoms=${encodeURIComponent(formData.symptoms)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Update medications with the response from the model
        setFormData({
          ...formData,
          medications: response.data.description, // Ensure the response contains 'description'
        });
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      doctorName: formData.doctorName,
      patientName: formData.patientName,
      date: formData.date,
      symptoms: formData.symptoms.split(',').map(symptom => symptom.trim()), // Convert symptoms to array
      doctorId: doctorId,
    };

    try {
      // Send symptoms to FastAPI for prediction
      const response = await axios.post(`${API_URL}/predict`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        // Fill medications with the response from the model
        setFormData({
          ...formData,
          medications: response.data.description, // Ensure the response contains 'description'
        });
        navigate('/dashboard/ordonnance'); // Redirect after submission
      }
    } catch (error) {
      console.error('Error during prediction:', error);
      setErrorMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      generatePDF(); // Generate PDF after submission
    }
  };

  return (
    <div className="form-container">
      <h2>Remplir l'ordonnance</h2>
      <form className="prescription-form" onSubmit={handleSubmit}>
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
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="symptoms">Symptômes</label>
          <textarea
            id="symptoms"
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            placeholder="Entrez les symptômes (séparés par des virgules) pour prédire la maladie et recommander des médicaments"
            rows="5"
          />
        </div>

        <button
          type="button"
          onClick={handleFetchMedications}
          className="btn btn--secondary"
        >
          Obtenir les Médicaments
        </button>

        <div className="form-group">
          <label htmlFor="medications">Médicaments</label>
          <textarea
            id="medications"
            name="medications"
            value={formData.medications}
            placeholder="Listez les médicaments"
            rows="5"
            readOnly // User cannot modify medications, filled by API response
          />
        </div>

        <button type="submit" className="btn btn--primary">
          Confirmer et générer le PDF
        </button>

        {errorMessage && <p className="error">{errorMessage}</p>}
        {loading && <p className="loading">Loading...</p>} {/* Display loading message */}
      </form>
    </div>
  );
};

export default PrescriptionForm;

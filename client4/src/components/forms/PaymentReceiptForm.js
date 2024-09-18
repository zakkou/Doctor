import React, { useState } from 'react';
import jsPDF from 'jspdf';
import '../../assets/styles/PaymentReceiptForm.css'; // Assure-toi que le chemin du fichier est correct
import axios from 'axios';
import { API_URL } from "../../env"; 
import { useDispatch, useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
const PaymentReceiptForm = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const doctorId = user.user._secretary.doctorId;
  const token = user.token;
  const [formData, setFormData] = useState({
    doctorName: '',
    patientName: '',
    date: '',
    amountPaid: '',
    paymentDetails: '',
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reçu de Paiement', 20, 20);
    doc.setFontSize(12);
    doc.text(`Docteur : ${formData.doctorName}`, 20, 40);
    doc.text(`Patient : ${formData.patientName}`, 20, 50);
    doc.text(`Date : ${formData.date}`, 20, 60);
    doc.text(`Montant payé : ${formData.amountPaid} dt`, 20, 70);
    doc.text('Détails du paiement :', 20, 80);
    doc.text(`${formData.paymentDetails}`, 20, 90);

    // Sauvegarde le fichier PDF
    doc.save(`recu_paiement_${formData.patientName}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData, doctorId };
    console.log('form:', formData);
    // // Génère le PDF après confirmation
    try {
      const response = await axios.post(`${API_URL}/api/add-payment`, data, {
        headers: {
          Authorization: `${token}`,
        }
      });
      if (response.status === 201) {
        // Redirigez l'utilisateur vers la page de connexion ou autre page après inscription
        generatePDF();
        navigate('/dashboard/paiement');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite lors de l'inscription.");
    } finally {
      generatePDF();
      navigate('/dashboard/paiement');
    }
  };

  return (
    <div className="form-container">
      <h2>Remplir le reçu de paiement</h2>
      <form className="payment-receipt-form" onSubmit={handleSubmit}>
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
          <label htmlFor="amountPaid">Montant payé (DT)</label>
          <input
            type="number"
            id="amountPaid"
            name="amountPaid"
            value={formData.amountPaid}
            onChange={handleChange}
            placeholder="Entrez le montant payé"
          />
        </div>

        <div className="form-group">
          <label htmlFor="paymentDetails">Détails du paiement</label>
          <textarea
            id="paymentDetails"
            name="paymentDetails"
            value={formData.paymentDetails}
            onChange={handleChange}
            placeholder="Détails supplémentaires sur le paiement"
            rows="4"
          />
        </div>

        <button type="submit" className="btn btn--primary">
          Confirmer et générer le PDF
        </button>
      </form>
    </div>
  );
};

export default PaymentReceiptForm;
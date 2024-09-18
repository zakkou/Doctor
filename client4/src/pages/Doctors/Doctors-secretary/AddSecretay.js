import React, { useState } from 'react';
import '../../../assets/styles/RegisterForm.css';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../../../env"; // Assurez-vous que l'API_URL est bien configurée
import { SpinnerCircularSplit } from "spinners-react";
import { useDispatch, useSelector } from 'react-redux';
const AddSecretary = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const doctorId = user.user._id;
  const token = user.token;
 
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(null);

    const formData = { ...data, doctorId };
    try {
      const response = await axios.post(`${API_URL}/api/add-secretary`, formData, {
        headers: {
          Authorization: `${token}`,
        }
      });
      if (response.status === 201) {
        // Redirigez l'utilisateur vers la page de connexion ou autre page après inscription
        navigate('/dashboard/secretary');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite lors de l'inscription.");
    } finally {
      setLoading(false);
      navigate('/dashboard/secretary');
    }
  };

  return (
    <div className="form-container">
      <h2>Ajouter une secrétaire</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">Nom complet</label>
          <input
            type="text"
            id="name"
            placeholder="Entrez votre nom complet"
            {...register("name", { required: "Le nom complet est requis" })}
          />
          {errors.name && <span className="error-text">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Entrez votre email"
            {...register("email", {
              required: "L'email est requis",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "L'email n'est pas valide"
              }
            })}
          />
          {errors.email && <span className="error-text">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            placeholder="Entrez votre mot de passe"
            {...register("password", {
              required: "Le mot de passe est requis",
              minLength: { value: 6, message: "Le mot de passe doit contenir au moins 6 caractères" }
            })}
          />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirmez votre mot de passe"
            {...register("confirmPassword", {
              required: "La confirmation du mot de passe est requise",
              validate: (value, { password }) => value === password || "Les mots de passe ne correspondent pas"
            })}
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? <SpinnerCircularSplit size={24} thickness={180} speed={100} color="rgba(57, 172, 231, 1)" /> : "S'inscrire"}
        </button>
      </form>

    </div>
  );
};

export default AddSecretary
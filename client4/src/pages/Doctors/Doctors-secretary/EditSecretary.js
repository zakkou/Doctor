import React, { useState, useEffect } from 'react';
import '../../../assets/styles/RegisterForm.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../../../env"; 
import { SpinnerCircularSplit } from "spinners-react";
import { useSelector } from 'react-redux';

const EditSecretary = () => {
  const { state } = useLocation(); // Récupère les données envoyées via navigate ou Link
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const token = user.token;

  useEffect(() => {
    // Pré-remplir les champs du formulaire avec les données envoyées dans le state
    if (state) {
      setValue('name', state.name);  // Remplir le champ "name"
      setValue('email', state.email); // Remplir le champ "email"
    }
  }, [state, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.put(`${API_URL}/api/editSecretary/${state._id}`, data, {
        headers: {
          Authorization: `${token}`,
        }
      });
      if (response.status === 201) {
        // Redirection après la modification réussie
        navigate('/dashboard/secretary');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite lors de la modification.");
    } finally {
      setLoading(false);
      navigate('/dashboard/secretary')
    }
  };

  return (
    <div className="form-container">
      <h2>Modifier</h2>

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
              validate: (value, { password }) => value === password || "Les mots de passe ne correspondent pas"
            })}
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? <SpinnerCircularSplit size={24} thickness={180} speed={100} color="rgba(57, 172, 231, 1)" /> : "Modifier"}
        </button>
      </form>
    </div>
  );
};

export default EditSecretary;

import React, { useState } from 'react';
import '../../assets/styles/LoginForm.css'; 
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../../env"; // Assurez-vous que l'API_URL est bien configurée
import { SpinnerCircularSplit } from "spinners-react";
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/store';
const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post(`${API_URL}/api/login`, data);
      if (response.status === 200) {
        // Enregistrer le token d'authentification si nécessaire
        dispatch(setUser(response.data));

        // Rediriger vers une page protégée après connexion
        navigate('/dashboard');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || "Une erreur s'est produite lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Connexion</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
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
            {...register("password", { required: "Le mot de passe est requis" })}
          />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </div>

        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? <SpinnerCircularSplit size={24} thickness={180} speed={100} color="rgba(57, 172, 231, 1)" /> : "Se Connecter"}
        </button>
      </form>

      <p>Vous n'avez pas de compte ? <Link to="/register">Créer un compte</Link></p>
    </div>
  );
};

export default LoginForm;

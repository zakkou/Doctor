import React from 'react'
import {useNavigate,Link} from 'react-router-dom'
import "../assets/styles/Doctor.css"
import { useSelector } from 'react-redux';
const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.user);
  

  return (
    <div className="container-doctor">
    <div className="content">
      <h1>Bienvenue sur <span>BestHealthCare</span></h1>
      <p>Choisissez une action ci-dessous :</p>
      <div className="menu-doctor">
        {user.role === 'doctor' && (
          <>
            <Link to="/dashboard/ordonnance" className="btn">Ordonnance</Link>
            <Link to="/dashboard/appointment" className="btn">Rendez-vous</Link>
            <Link to="/dashboard/calendrier" className="btn">Calendrier</Link>
            {/* <Link to="/assistant" className="btn">Assistant</Link> */}
            <Link to="/dashboard/secretary" className="btn">Sécretaire</Link>
          </>
        )}
        {user.role === 'secretary' && (
          <>
            <Link to="/dashboard/appointment" className="btn">Rendez-vous</Link>
            <Link to="/dashboard/calendrier" className="btn">Calendrier</Link>
            <Link to="/dashboard/paiement" className="btn">Paiement</Link>
          </>
        )}
      </div>
    </div>
  </div>
  )
}

export default Dashboard
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from '../redux/store';
import NotificationIcon from '../assets/NotificationIcon';
const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.user);
  const location = useLocation(); // Obtient le chemin actuel
  const { pathname } = location;
  const shouldHaveBorderBottom = pathname !== '/';




  const handleSignOut = () => {
    // Implement your sign-out logic here
    dispatch(clearUser());
    navigate('/login');
  };
  const goTODashboard = () => {
    navigate('/dashboard')
  }



  return (
    <div className={`nav ${shouldHaveBorderBottom ? 'nav-border-bottom' : ''}`}>
      <nav >

        <div onClick={() => navigate('/')} className="nav__logo">BestHealthCare</div>

        {user ? <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn" onClick={goTODashboard} >Dashboard</button>
          <button className="btn" onClick={handleSignOut}>Se Deconnecter</button>
         <div>
            <NotificationIcon />
          </div>

        </div> :
          <button className="btn" onClick={() => navigate('/login')}>Se Connecter</button>
        }

      </nav >
    </div>
  )
}

export default Navbar
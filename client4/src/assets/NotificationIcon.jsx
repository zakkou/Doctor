import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { API_URL } from "../env";

const NotificationIcon = () => {
  const { user } = useSelector((state) => state.user);
  const token = user.token;
  const doctorId = user?._secretary?.doctorId ?? user?.user?._id;
  // État pour gérer les notifications et l'affichage du dropdown
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); 

  // Fonction pour afficher/masquer le dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      // Appel pour marquer les notifications comme lues lorsqu'on ouvre le dropdown
      markNotificationsAsRead();
    }
  };
  const unreadCount = notifications.filter(notification => !notification.seen).length;
  // Fonction pour marquer les notifications comme lues
  const markNotificationsAsRead = () => {
    console.log("toke: ", token);
    if (doctorId) {
      axios.patch(`${API_URL}/api/clear/${doctorId}`,{}, {
        headers: {
          Authorization: `${token}`,
        }
      })
        .then(() => {
          // Mettre à jour les notifications en local après avoir marqué comme lues
          setNotifications(prevNotifications => 
            prevNotifications.map(notification => ({
              ...notification,
              seen: true
            }))
          );
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour des notifications:", error);
        });
    }
  };

  // Utiliser useEffect pour récupérer les notifications quand le composant est monté
  useEffect(() => {
    if (doctorId) {
      // Appel Axios pour récupérer les notifications par l'ID de l'utilisateur
      axios.get(`${API_URL}/api/get-notification/${doctorId}`, {
        headers: {
          Authorization: `${token}`,
        }
      })
        .then((response) => {
          setNotifications(response.data.notifications); // Mettre à jour l'état avec les notifications reçues
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des notifications:", error);
        });
    }
  }, [user]);

  return (
    <div className="notification-container">
      {/* Icône de notification avec cercle pour le nombre */}
      <div className="notification-icon" onClick={toggleDropdown}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="none"
          viewBox="0 0 24 24"
          style={{ cursor: 'pointer' }}
        >
          <path
            fill="#ff7171"
            d="M20.4 16.33c-.28.75-.87 1.32-1.64 1.58-1.08.36-2.19.63-3.31.82-.11.02-.22.04-.33.05-.18.03-.36.05-.54.07-.22.03-.45.05-.68.07-.63.05-1.25.08-1.88.08-.64 0-1.28-.03-1.91-.09-.27-.02-.53-.05-.79-.09l-.44-.06c-.11-.02-.22-.03-.33-.05-1.11-.18-2.21-.45-3.28-.81-.8-.27-1.41-.84-1.68-1.57-.27-.72-.17-1.56.26-2.28l1.13-1.88c.24-.41.46-1.2.46-1.68V8.63c0-3.63 2.95-6.58 6.58-6.58 3.62 0 6.57 2.95 6.57 6.58v1.86c0 .48.22 1.27.47 1.68l1.13 1.88c.41.7.49 1.52.21 2.28z"
            opacity="0.4"
          ></path>
          <path
            fill="#292D32"
            d="M12 10.76a.76.76 0 01-.76-.76V6.9a.76.76 0 111.52 0V10c-.01.42-.35.76-.76.76zM14.83 20.01A3.014 3.014 0 0112 22c-.79 0-1.57-.32-2.12-.89-.32-.3-.56-.7-.7-1.11.13.02.26.03.4.05.23.03.47.06.71.08.57.05 1.15.08 1.73.08.57 0 1.14-.03 1.7-.08.21-.02.42-.03.62-.06l.49-.06z"
          ></path>
        </svg>
        {/* Badge pour afficher le nombre de notifications */}
        {unreadCount > 0 && (
          <span className="notification-count">{unreadCount}</span>
        )}
      
      </div>

      {/* Dropdown des notifications */}
      {showDropdown && (
        <div className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className="notification-item">
                {notification.notification} {/* Afficher le texte de la notification */}
              </div>
            ))
          ) : (
            <div className="notification-item">Aucune notification</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;

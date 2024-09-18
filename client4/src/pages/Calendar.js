import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_URL } from "../env";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);
  const token = user.token;
  const doctorId = user?.user?._secretary?.doctorId ?? user?.user?._id;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllReservation/${doctorId}`, {
          headers: {
            Authorization: `${token}`,
          }
        });

        // Transformer les données pour le calendrier
        const appointments = response.data.map(appointment => {
          const [hours, minutes] = appointment.appointmentTime.split(':'); // Diviser appointmentTime en heures et minutes

          // Créer l'objet Date en combinant la date et l'heure
          const appointmentStart = new Date(appointment.appointmentDate);
          appointmentStart.setHours(hours, minutes);

          // Créer un objet de fin pour les rendez-vous (ex. +1 heure de rendez-vous)
          const appointmentEnd = new Date(appointmentStart);
          appointmentEnd.setHours(appointmentStart.getHours() + 1); // Ajouter une heure pour l'heure de fin

          return {
            title: `${appointment.patientName} - ${appointment.description}`,
            start: appointmentStart,
            end: appointmentEnd,
          };
        });

        setEvents(appointments);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, [doctorId, token]);

  return (
    <div>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default Calendar;

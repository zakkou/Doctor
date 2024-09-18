const Reservation = require("../models/Reservation");
const Notification = require("../models/Notification");
const Secretary = require("../models/Secretary");
const User = require("../models/User");
const moment = require('moment');
exports.editReservation = (req, res) => {
  const { id } = req.params; // ID de la réservation à modifier
  const { appointmentDate, appointmentTime, description, patientName, doctorName, doctorId } = req.body;

  // Trouver la réservation par ID
  Reservation.findOne({ _id: id })
    .then((reservation) => {
      if (!reservation) {
        return res.status(404).json({ message: "Réservation non trouvée." });
      }

      // Mettre à jour les informations si elles sont fournies
      reservation.appointmentDate = appointmentDate || reservation.appointmentDate;
      reservation.appointmentTime = appointmentTime || reservation.appointmentTime;
      reservation.description = description || reservation.description;
      reservation.patientName = patientName || reservation.patientName;
      reservation.doctorName = doctorName || reservation.doctorName;

      // Sauvegarder les modifications
      return reservation.save();
    })
    .then((updatedReservation) => {
      const formattedDate = moment(updatedReservation.appointmentDate).format('DD/MM/YYYY');

      // Trouver l'utilisateur actuel
      return User.findById(req.user.id).then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Si l'utilisateur est un docteur, envoyer une notification aux secrétaires associés
        if (user._doctor) {
          return Secretary.find({ doctorId: doctorId }).then((secretaries) => {
            if (secretaries.length === 0) {
              return res.status(404).json({ message: "Aucun secrétaire trouvé pour ce docteur." });
            }

            // Envoyer une notification à chaque secrétaire
            const notifications = secretaries.map((secretary) => {
              return User.findOne({ _secretary: secretary._id }).then((secretaryUser) => {
                if (secretaryUser) {
                  const notification = new Notification({
                    notification: `Un rendez-vous a été modifié au ${formattedDate} à ${updatedReservation.appointmentTime}`,
                    _secretary: secretaryUser._id,
                 
                  });
                  return notification.save();
                }
              });
            });

            // Attendre que toutes les notifications soient sauvegardées
            return Promise.all(notifications)
              .then(() => res.status(200).json({ message: "Notifications envoyées aux secrétaires." }))
              .catch((err) => res.status(500).json({ message: "Erreur lors de l'envoi des notifications.", err }));
          });
        }

        // Si l'utilisateur est un secrétaire, envoyer une notification au docteur
        if (user._secretary) {
          const notification = new Notification({
            notification: `Un rendez-vous a été modifié au ${formattedDate} à ${updatedReservation.appointmentTime}`,
            _doctor: doctorId,
          
          });

          return notification
            .save()
            .then(() => res.status(200).json({ message: "Notification envoyée au docteur." }))
            .catch((err) => res.status(500).json({ message: "Erreur lors de l'envoi de la notification.", err }));
        }

        return res.status(400).json({ message: "Rôle utilisateur non reconnu." });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: "Erreur lors de la mise à jour de la réservation.", err });
    });
};


exports.deleteReservation = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête
    const deletedReservation = await Reservation.findByIdAndDelete(id); // Supprimer l'Reservation par son ID

    if (!deletedReservation) {
      return res.status(404).json({ message: 'Reservation non trouvée' });
    }

    return res.status(200).json({ message: 'Reservation supprimée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de la reservation :", error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de la Reservation' });
  }
};


exports.addReservation = (req, res) => {
  const { appointmentDate, appointmentTime, description, patientName, doctorName, doctorId } = req.body;

  // Étape 1 : Récupérer l'utilisateur connecté
  User.findById(req.user.id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      // Étape 2 : Créer la réservation
      const reservation = new Reservation({
        appointmentDate,
        appointmentTime,
        description,
        patientName,
        doctorName,
        _doctor: doctorId
      });

      reservation
        .save()
        .then((result) => {
          const formattedDate = moment(result.appointmentDate).format('DD/MM/YYYY');

          // Étape 3 : Envoyer la notification en fonction du rôle
          if (user._doctor) {
            Secretary.find({ doctorId: doctorId })
              .then(secretaries => {
                if (secretaries.length === 0) {
                  return res.status(404).json({ message: 'Aucun secrétaire trouvé pour ce docteur.' });
                }
                secretaries.forEach(secretary => {
                  console.log('secretary:', secretary._id); // Log correct ici
                  User.findOne({ _secretary: secretary._id }) // Utiliser findOne pour un seul utilisateur
                    .then(user => {
                      if (user) {
                        const notification = new Notification({
                          notification: "Vous avez un nouveau rendez-vous le " + formattedDate,
                          _secretary: user._id,
                        });
                        notification.save()
                          .then(() => console.log('Notification enregistrée pour user:', user._id))
                          .catch(err => console.error('Erreur lors de la sauvegarde de la notification:', err));
                      } else {
                        console.log('Aucun utilisateur trouvé pour ce secrétaire:', secretary._id);
                      }
                    })
                    .catch(err => {
                      console.error('Erreur lors de la recherche de l\'utilisateur secrétaire:', err);
                    });
                });

                // Envoyer la réponse après que toutes les notifications aient été traitées
                res.status(200).json({ message: "Notifications envoyées aux secrétaires." });
              })
              .catch(err => res.status(500).json({ message: 'Erreur lors de la récupération des secrétaires.', err }));
          }


          else if (user._secretary) {
            const notification = new Notification({
              notification: "Vous avez un nouveau rendez-vous le " + formattedDate,
              _doctor: doctorId,
            });
            notification
              .save()
              .then(() => res.status(200).json(result))
              .catch(err => res.status(500).json({ message: 'Erreur lors de la création de la notification.', err }));
          } else {
            res.status(400).json({ message: "Rôle utilisateur non reconnu." });
          }
        })
        .catch(err => res.status(500).json({ message: 'Erreur lors de la sauvegarde de la réservation.', err }));
    })
    .catch(err => res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur.', err }));
};



// Fonction pour obtenir tous les paiements par doctorId
exports.getReservationByDoctor = (req, res) => {
  const { doctorId } = req.params;  // Récupère le doctorId à partir des paramètres de la requête
  console.log('doc:', doctorId)
  Reservation.find({ _doctor: doctorId })
    .populate("_doctor") // Facultatif : pour peupler les informations du docteur
    .then((reservations) => {

      if (!reservations || reservations.length === 0) {
        return res.status(404).json({ message: "Aucun paiement trouvé pour ce docteur" });
      }
      res.json(reservations);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des paiements", error: err });
    });
};

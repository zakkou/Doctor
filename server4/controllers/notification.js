const Notification = require("../models/Notification");

exports.clearNotification = (req, res) => {
  console.log('clear')
  const userId = req.params.id; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

  // Mettre à jour toutes les notifications non lues (seen: false) pour cet utilisateur
  Notification.updateMany(
    {
      $or: [{ _doctor: userId }, { _secretary: userId }], // Cherche les notifications où _doctor ou _secretary correspond à userId
      seen: false // Seulement les notifications non vues
    },
    { $set: { seen: true } } // Mettre à jour le champ 'seen' à true
  )
    .then((result) => {
      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "Aucune notification non lue trouvée pour cet utilisateur." });
      }
      res.status(200).json({ message: `Toutes les notifications non lues pour l'utilisateur ${userId} ont été marquées comme lues.` });
    })
    .catch((error) => {
      console.error('Erreur lors de la mise à jour des notifications:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour des notifications.' });
    });
}; 

exports.getNotification = (req, res) => {
  const userId = req.params.id; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête
 
 Notification.find({
  $or: [{ _doctor: userId }, { _secretary: userId }]
})
    .sort({ createdAt: -1 }) // Tri des notifications par date de création (les plus récentes en premier)
    .limit(10) // Limiter le résultat à 10 notifications
    .then((notifications) => {
      if (!notifications || notifications.length === 0) {
        return res.status(404).json({ message: 'Aucune notification trouvée pour cet utilisateur.' });
      }
      res.status(200).json({ notifications });
    })
    .catch((error) => {
      console.error('Erreur lors de la récupération des notifications:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des notifications.' });
    });
};


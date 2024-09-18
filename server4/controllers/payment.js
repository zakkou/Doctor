const Payment = require("../models/Payment");

exports.editPayment = (req, res) => {
  const { id } = req.params; // L'ID du paiement à modifier
  const { doctorName,patientName, amountPaid, paymentDetails, date } = req.body;

  // Trouver le paiement par ID
  Payment.findOne({ _id: id })
    .then((payment) => {
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Mettre à jour les informations si elles sont fournies
      payment.doctorName = doctorName || payment.doctorName;
      payment.patientName = patientName || payment.patientName;
      payment.amountPaid = amountPaid || payment.amountPaid;
      payment.paymentDetails = paymentDetails || payment.paymentDetails;
      payment.date = date || payment.date;

      // Sauvegarder les modifications
      payment.save()
        .then((updatedPayment) => {
          res.status(200).json({
            message: "Payment updated successfully",
            payment: updatedPayment, // Retourner les informations mises à jour
          });
        })
        .catch((err) => {
          res.status(500).json({ error: "Error updating payment details" });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
};

exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête
    const deletedPayment = await Payment.findByIdAndDelete(id); // Supprimer l'Payment par son ID

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment non trouvée' });
    }

    return res.status(200).json({ message: 'Payment supprimée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de la Payment :", error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de la Payment' });
  }
};



exports.addPayment = (req, res) => {

  const { patientName, amountPaid, paymentDetails,doctorName, doctorId, date } = req.body;
 
  const payment = new Payment({
    doctorName,
    patientName,
    amountPaid,
    paymentDetails,
    date,
    paymentDoctor: doctorId
  });
  payment
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err); 
    });
};



// Fonction pour obtenir tous les paiements par doctorId
exports.getPaymentsByDoctor = (req, res) => { 
  const { doctorId } = req.params;  // Récupère le doctorId à partir des paramètres de la requête
  console.log('doc:', doctorId)
  Payment.find({ paymentDoctor: doctorId })
    .populate("paymentDoctor") // Facultatif : pour peupler les informations du docteur
    .then((payments) => {
      console.log('payments:', payments)
      if (!payments || payments.length === 0) { 
        return res.status(404).json({ message: "Aucun paiement trouvé pour ce docteur" });
      }
      res.json(payments);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des paiements", error: err });
    });
};


const Prescription = require("../models/Prescription");

exports.editPrescription = (req, res) => {
  const { id } = req.params; // ID de la prescription à modifier
  const { date, medications, patientName, doctorName } = req.body;

  // Trouver la prescription par ID
  Prescription.findOne({ _id: id })
    .then((prescription) => {
      if (!prescription) {
        return res.status(404).json({ message: "Prescription not found" });
      }

      // Mettre à jour les informations si elles sont fournies
      prescription.date = date || prescription.date;
      prescription.medications = medications || prescription.medications;
      prescription.patientName = patientName || prescription.patientName;
      prescription.doctorName = doctorName || prescription.doctorName;

      // Sauvegarder les modifications
      prescription.save()
        .then((updatedPrescription) => {
          res.status(200).json({
            message: "Prescription updated successfully",
            prescription: {
              id: updatedPrescription._id,
              date: updatedPrescription.date,
              medications: updatedPrescription.medications,
              patientName: updatedPrescription.patientName,
              doctorName: updatedPrescription.doctorName,
              doctorId: updatedPrescription._doctor, // Optionnel, si vous voulez retourner ce champ
            },
          });
        })
        .catch((err) => {
          res.status(500).json({ error: "Error updating prescription details" });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
};

exports.deletePrescription = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête
    const deletedPrescription = await Prescription.findByIdAndDelete(id); // Supprimer l'ordonnance par son ID

    if (!deletedPrescription) {
      return res.status(404).json({ message: 'Ordonnance non trouvée' });
    }

    return res.status(200).json({ message: 'Ordonnance supprimée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ordonnance :", error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de l\'ordonnance' });
  }
};
exports.addPrescription = (req, res) => {

  const { date, medications, patientName, doctorName,doctorId } = req.body;

  const prescription = new Prescription({
    date,
    medications,
    patientName,
    doctorName,
    _doctor: doctorId
  });
  prescription
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => { 
      res.status(500).json(err); 
    });
};



// Fonction pour obtenir tous les paiements par doctorId
exports.getPrescriptionByDoctor = (req, res) => {  
  const { doctorId } = req.params;  // Récupère le doctorId à partir des paramètres de la requête
  console.log('doc:', doctorId)
  Prescription.find({ _doctor: doctorId })
    .populate("_doctor") // Facultatif : pour peupler les informations du docteur
    .then((prescriptions) => {
      
      if (!prescriptions || prescriptions.length === 0) { 
        return res.status(404).json({ message: "Aucun paiement trouvé pour ce docteur" });
      }
      res.json(prescriptions);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de la récupération des paiements", error: err });
    });
};

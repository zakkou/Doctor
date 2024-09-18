const Secretary = require("../models/Secretary");
const User = require("../models/User");

exports.deleteSecretary = async (req, res) => {
  try {
    const { id } = req.params; // Récupérer l'ID depuis les paramètres de la requête
   console.log("iddd:,",id)
    const deletedSecretary = await User.findByIdAndDelete(id); // Supprimer l'Secretary par son ID

    if (!deletedSecretary) {
      return res.status(404).json({ message: 'Secretary non trouvée' });
    }

    return res.status(200).json({ message: 'Secretary supprimée avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de la Secretary :", error);
    return res.status(500).json({ message: 'Erreur lors de la suppression de la Secretary' });
  }
};

exports.editSecretary = (req, res) => {
  const { id } = req.params;
  const { name, password, email } = req.body;

  // Trouver l'utilisateur correspondant à cette secrétaire
  User.findOne({ _id: id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Secretary not found" });
      }

      // Mettre à jour le nom et l'email si fournis
      user.name = name || user.name;
      user.email = email || user.email;

      // Vérifier si un nouveau mot de passe a été fourni
      if (password) {
        // Hacher le nouveau mot de passe et sauvegarder l'utilisateur
        bcrypt.hash(password, 12)
          .then((hashedPassword) => {
            user.password = hashedPassword;
            return user.save();
          })
          .then((updatedUser) => {
            res.status(200).json({
              message: "Secretary updated successfully",
              user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
              },
            });
          })
          .catch((err) => {
            res.status(500).json({ error: "Error updating user details" });
          });
      } else {
        // Si aucun mot de passe n'est fourni, sauvegarder simplement les autres champs
        user.save()
          .then((updatedUser) => {
            res.status(200).json({
              message: "Secretary updated successfully",
              user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
              },
            });
          })
          .catch((err) => {
            res.status(500).json({ error: "Error updating user details" });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Server error" });
    });
};
exports.getAllsec = (req, res) => {
  const doctorId = req.params.doctorId; // ID du médecin passé en paramètre

  // Trouver tous les secrétaires en fonction du doctorId
  Secretary.find({ doctorId: doctorId })
    .then((secretaries) => {
      // Extraire les ObjectId des secrétaires trouvés
      const secretaryIds = secretaries.map(secretary => secretary._id);

      // Rechercher les utilisateurs qui ont ces secrétaires associés
      User.find({ _secretary: { $in: secretaryIds } })
        .populate('_secretary')  // Peupler les données du secrétaire
        .then((users) => {
          res.status(200).json(users);
        })
        .catch((err) => {
          res.status(401).json({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(401).json({ error: err.message });
    });
};


const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Secretary = require("../models/Secretary");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.AddSecretary=(req,res)=>{
  const { name, password, email,doctorId } = req.body;

  User.findOne({ email: email })

  .then((savedUser) => {
    if (savedUser) {
      res.status(401).json("user is already exist");
    } else {
      const secretary = new Secretary({
        doctorId: doctorId,
      });
      secretary.save()
      .then((secretary)=>{
        bcrypt
        .hash(password, 12)
        .then((hashp) => {
          const user = new User({
            name,
            email,
            password: hashp,
            _secretary: secretary._id,
          });
          user.save();
        })
      })
     

        .then((user) => {
          res.status(200).json({ message: "register succesfully" });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  })

  .catch((err) => {
    res.status(400).json(err);
  });
}
exports.Signup = (req, res) => {
  const { name, password, email,speciality } = req.body;

  User.findOne({ email: email })

    .then((savedUser) => {
      if (savedUser) {
        res.status(401).json("user is already exist");
      } else {
        const doctor = new Doctor({
          speciality: speciality,
        });
        doctor.save()
        .then((doctor)=>{
          bcrypt
          .hash(password, 12)
          .then((hashp) => {
            const user = new User({
              name,
              email,
              password: hashp,
              _doctor: doctor._id,
            });
            user.save();
          })
        })
       

          .then((user) => {
            res.status(200).json({ message: "register succesfully" });
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      }
    })

    .catch((err) => {
      res.status(400).json(err);
    });
};


exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .populate("_doctor")
    .populate("_secretary")
    .then((user) => {
      if (!user) {
        return res.status(404).json("Email Or Password incorrect");
      }
      // if (user._doctor) {
      //   return res.status(404).json({ email: "Email not found" });
      // }

      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            jwt.sign({ id: user._id }, process.env.JWT_SECRET, (err, token) => {
              if (err) throw err;
              if (user._doctor) {
                res.json({
                  user,
                  role: "doctor",
                  loggedIn: true,
                  token: "Bearer " + token,
                });
              }
              else if (user._secretary) {
                res.json({
                  user,
                  role: "secretary",
                  docId:user._secretary.doctorId,
                  loggedIn: true,
                  token: "Bearer " + token,
                  hello:"world"
                });
              }
              else
                res.json({
                  user,
                  role: "patient",
                  loggedIn: true,
                  token: "Bearer " + token,
                });
            });
          } else {
            return res.status(400).json("Email Or Password incorrect");
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
/* -------------------------------------------------------------------------- */
/*                                  GET USER                                  */
/* -------------------------------------------------------------------------- */

exports.getUser = (req, res) => {
  User.findOne({ _id: req.user.id })
    .select("-password")
    .populate("_doctor")
    .then((user) => {
      if (user._doctor) {
        return res.json({
          user,
          role: "doctor",
          loggedIn: true,
        });
      }
      return res.json({
        user,
        role: "patient",
        loggedIn: true,
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.getAllUser = (req, res) => {
  User.find()
    .populate("_doctor")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(401).json(err);
    });
};

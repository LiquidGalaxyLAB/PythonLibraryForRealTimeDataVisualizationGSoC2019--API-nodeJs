const express = require('express');
const {
  Donor, validateDonor
} = require('../models/donor.model.js');
const bcrypt = require('bcrypt');


// Create and Save a new Donor
exports.create = (req, res) => {

  //Validate donor
  const {
    error
  } = validateDonor(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
      Donor.findOne({
        email: req.body.email
      }).exec(function(err, donor) {
        if (donor) {
          return res.status(500).send({
            message: "There is already a user with this email address."
          });
        } else {
          // Create a Donor
          const donor = new Donor({
            completeName: req.body.completeName,
            email: req.body.email,
            donationType: req.body.donationType,
            helpType: req.body.helpType,
            location: req.body.location,
            city: req.body.city
          });
          // Save Donor in the database
          donor.save()
            .then(data => {
              res.send(data);
            }).catch(err => {
              return res.status(500).send({
                message: err.message ||
                  "Some error occurred while creating the Donor user profile."
              });
            });
        }
      });
    }
};


// Find a single donor with a donorId
exports.findOne = (req, res) => {
  Donor.findById(req.params.donorId)
    .then(donor => {
      if (!donor) {
        return res.status(404).send({
          message: "Donor not found with id " + req.params.donorId
        });
      }
      res.send(donor);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Donor not found with id " + req.params.donorId
        });
      }
      return res.status(500).send({
        message: "Error retrieving donor with id " + req.params.donorId
      });
    });
};


// Find all donors by city
exports.findAllByCity = (req, res) => {
  Donor.find({
      city: req.params.city
    })
    .then(donor => {
      if (!donor) {
        return res.status(404).send({
          message: "Donor not found with city " + req.params.city
        });
      }
      res.send(donor);
    }).catch(err => {
      if (err.kind === 'Donor') {
        return res.status(404).send({
          message: "Donor not found with city" + req.params.city
        });
      }
      return res.status(500).send({
        message: "Error retrieving donors with city " + req.params.city
      });
    });
};


// Retrieve and return all donors from the database.
exports.findAll = (req, res) => {
  Donor.find()
    .then(donor => {
      res.send(donor);
    }).catch(err => {
      res.status(500).send({
        message: err.message ||
          "Some error occurred while retrieving donors."
      });
    });
};


// Delete a donor with the specified donorId in the request
exports.delete = (req, res) => {
  Donor.findByIdAndRemove(req.params.donorId)
    .then(donor => {
      if (!donor) {
        return res.status(404).send({
          message: "Donor not found with id " + req.params.donorId
        });
      }
      res.send({
        message: "Donor deleted successfully!"
      });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "Donor not found with id " + req.params.donorId
        });
      }
      return res.status(500).send({
        message: "Could not delete donor with id " + req.params.donorId
      });
    });
//    Donor.deleteMany({}, function(err){
//       });
};



// Update a donor identified by the donorId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.completeName) {
    return res.status(400).send({
      message: "Donor name can not be empty"
    });
  }

  // Find donor and update it with the request body
  Donor.findByIdAndUpdate(req.params.donorId, {
    location: req.body.location,
    city: req.body.city,
    email: req.body.email,
    donationType: req.body.donationType,
    helpType: req.body.helpType
    }, {
      new: true
    })
    .then(donor => {
      if (!donor) {
        return res.status(404).send({
          message: "Donor not found with id " + req.params.donorId
        });
      }
      res.send(donor);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Donor not found with id " + req.params.donorId
        });
      }
      return res.status(500).send({
        message: "Error updating donor with id " + req.params.donorId
      });
    });
};

const express = require("express");
const { MongoDriverError } = require("mongodb");
const mongoose = require("mongoose");
const router = express.Router();
const Director = require("../models/director");

//1. GET
router.get("/", (req, res, next) => {
  Director.find({})
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "All directors returned",
      });
    })
    .catch((err) => {
      console.error(error);
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

//2. POST
router.post("/", (req, res, next) => {
  res.json({
    message: "Directors - POST",
  });
});

//3. GET by ID
router.get("/:directorId", (req, res, next) => {
  const directorId = req.params.directorId;
  Director.findById(directorId)
    .select("name _id")
    .exec()
    .then((director) => {
        if(!director){
            console.log(director)
            return res.status(404).json({
                message: "Director Not Found"
            })
        }
      res.status(201).json({
        director: director,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

//4. PATCH
router.patch("/:directorId", (req, res, next) => {
  const directorId = req.params.directorId;
  res.json({
    message: "Directors - PATCH",
    id: directorId,
  });
});

//5. DELETE by Id
router.delete("/:directorId", (req, res, next) => {
  const directorId = req.params.directorId;

  Director.deleteOne({
    _id: directorId,
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Director Deleted",
        request: {
          method: "GET",
          url: "http://localhost:3000/directors/" + directorId,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

module.exports = router;

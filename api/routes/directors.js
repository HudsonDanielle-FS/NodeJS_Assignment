const express = require("express");
const { MongoDriverError } = require("mongodb");
const mongoose = require("mongoose");
const router = express.Router();
const Director = require("../models/director");
const Messages = require("../../messages/messages");

//1. GET
router.get("/", (req, res, next) => {
  Director.find()
    .select("-__v")
    .populate("movie", "title director")
    .exec()
    .then((result) => {
      res.status(200).json({
        message: Messages.all_directors_returned,
        director: result,
        metadata: {
          method: req.method,
          host: req.hostname,
        },
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
  Director.find({
    movie: req.body.movie,
    name: req.body.name,
  })
    .select("-__v")
    .populate("movie", "title director")
    .exec()
    .then((result) => {
      console.log(result);
      if (result.length > 0) {
        return res.status(406).json({
          message: Messages.director_cataloged,
        });
      }
      const newDirector = new Director({
        _id: mongoose.Types.ObjectId(),
        movie: req.body.movie,
        name: req.body.name,
      });
      // Write to the db
      newDirector
        .save()
        .then((result) => {
          console.log(result);
          res.status(200).json({
            message: Messages.director_saved,
            director: {
              movie: result.movie,
              name: result.name,
              id: result._id,
              metadata: {
                method: req.method,
                host: req.hostname,
              },
            },
          });
        })
        .catch((err) => {
          console.error(err.message);
          res.status(500).json({
            error: {
              message: err.message,
              status: err.status,
            },
          });
        });
    });
});

//3. GET by ID
router.get("/:directorId", (req, res, next) => {
  const directorId = req.params.directorId;
  Director.findById(directorId)
    .select("-__v")
    .populate("movie", "title director")
    .exec()
    .then((director) => {
      if (!director) {
        console.log(director);
        return res.status(404).json({
          message: Messages.director_not_found,
        });
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

//4. PATCH by ID
router.patch("/:directorId", (req, res, next) => {
  const directorId = req.params.directorId;

  const updatedDirector = {
    movie: req.body.movie,
    name: req.body.name,
  };

  Director.updateOne(
    { _id: directorId },
    {
      $set: updatedDirector,
    }
  )
    .select("-__v")
    .populate("movie", "title director")
    .exec()
    .then((director) => {
        if (!director) {
            console.log(director);
            return res.status(404).json({
              message: Messages.director_not_found,
            });
          }
      return res.status(200).json({
        message: Messages.director_updated,
        director: {
            movie: updatedDirector.movie,
            name: updatedDirector.name,
            id: directorId
        },
        metadata: {
          method: req.method,
          host: req.hostname,
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

//5. DELETE by Id
router.delete("/:directorId", (req, res, next) => {
  const directorId = req.params.directorId;

  Director.deleteOne({
    _id: directorId,
  })
    .select("-__v")
    .populate("movie", "title director")
    .exec()
    .then((director) => {
        if (!director) {
            console.log(director);
            return res.status(404).json({
              message: Messages.director_not_found,
            });
          }
      res.status(200).json({
        message: Messages.director_deleted,
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

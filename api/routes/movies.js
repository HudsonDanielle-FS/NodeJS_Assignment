const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Movie = require('../models/movie');

//1. GET MovieS
router.get('/', (req, res, next) => {
    Movie.find()
        .then(result => {
            res.status(200).json({
                message: "Get Movie",
                movie: {
                    title: result.title,
                    director: result.director,
                    id: result._id
                },
                metadata: {
                    host: req.hostname,
                    method: req.method
                }           
            });
    })
    .catch(err => {
        console.error(err.message);
        res.status(500).json({
            error: {
                message: err.message,
                status: err.status
            }
        })        
    });

});

router.get("/:movieId", (req, res, next) => {
    const movieId = req.params.movieId;
    Movie.findById(movieId)
    .select("title _Id")
    .exec()
    .then(movie => {
    //   if(!movie){
    //     console.log(movie)
    //     return res.status(404).json({
    //       message: "movie not found"
    //     })
    //   }
      res.status(200).json({
        message: "Movie Found"
      })
    })
    .catch(err => {
      res.status(500).json({
        error: {
          message: err.message
        }
      })
    })
  });

//2. POST - ADD NEW Movie
router.post('/', (req, res, next) => {
    const newMovie = new Movie({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        director: req.body.director
    });
    // Write to the db
    newMovie.save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Movie Saved",
                movie: {
                    title: result.title,
                    director: result.director,
                    id: result._id,
                    metadata:{
                        method: req.method,
                        host: req.hostname
                    }
                }
            })
        })
        .catch(err => {
            console.error(err.message);
            res.status(500).json({
                error: {
                    message: err.message,
                    status: err.status
                }
            })        
        });
});

router.delete("/:movieId", (req, res, next) => {
    const movieId = req.params.movieId;
    Movie.deleteOne({
      _id: movieId,
    })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Movie Deleted",
          request: {
            method: "GET",
            url: "http://localhost:3000/directors/" + movieId,
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

  router.patch("/:movieId", (req, res, next) => {
    const movieId = req.params.movieId;
  
    const updatedMovie = {
      title: req.body.title,
      director: req.body.director,
    };
  
    Movie.updateOne(
      { _id: movieId },
      {
        $set: updatedMovie,
      }
    )
      .then((result) => {
        res.status(200).json({
          message: "Updated Movie",
          movie: {
            title: result.title,
            director: result.director,
            id: result._id,
          },
          metadata: {
            host: req.hostname,
            method: req.method,
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
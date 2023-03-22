const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const movieRoutes = require('../api/routes/movies');
const directorRoutes = require('../api/routes/directors');

// middleware for logging
app.use(morgan('dev'));
// parsing middleware
app.use(express.urlencoded({
    extended: true
}));
// use middleware to process json
app.use(express.json());
// req.body.username  

//Router - define router
app.use('/movies', movieRoutes);
app.use('/director', directorRoutes)
// use middleware to handle CORs Policy
app.use((req,res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, Authorization");
    if(req.method === "OPTIONS"){
        res.header("Access-Control-Allow-Methods", "POST,PUT,GET,PATCH,DELETE")
    }
    next();
})

//Service  - define localhost 3000
app.get("/", (req, res, next) => {
    //res.status(200).json({message: 'Serivice is up'});
    res.status(201).json({
        message: 'Service is up', 
        method: req.method
    });
});

//Errors
//Middleware to handle errors and bad url path
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next ) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
            status: error.status,
            method: req.method
        },
    });
});
//Connnect to mongodb
mongoose.connect(process.env.mongoDBURL, (err) => {
    if(err){
        console.error("Error: ", err.message);
    } else{
        console.log("MongoDB connection successful");
    }
})
module.exports = app;
const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    director: String
});

module.exports = mongoose.model('Movie', movieSchema);
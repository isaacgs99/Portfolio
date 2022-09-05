const mongoose = require('mongoose');

const asiSubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Ability name for score increase is required.'
    },
    increase: Number
}, { _id: false });

const raceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Class name is required'
    },
    description: {
        type: String,
        trim: true
    },
    ability_increase: [asiSubSchema],
    speed: Number,
    alignment: String,
    size: String,
    languages: String,
    traits: {
        type: String,
        trim: true
    }
});

raceSchema.index({
    name: 'text'
});

module.exports = mongoose.model('Race', raceSchema);
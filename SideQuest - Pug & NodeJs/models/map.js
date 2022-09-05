const mongoose = require('mongoose');
const Comment = require('./comment');

const commentSchema = mongoose.model('Comment').schema;


const mapSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Map name is required.'
    },
    image: {
        type: String,
        required: 'Map image is required.'
    },
    description: String,
    comments: [commentSchema]
});

mapSchema.index({
    name: 'text'
});

module.exports = mongoose.model('Map', mapSchema);
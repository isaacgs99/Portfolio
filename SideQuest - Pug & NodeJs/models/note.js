const mongoose = require ('mongoose');

const noteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Note name is required.'
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true
    }
});

noteSchema.index({
    name: 'text'
});

module.exports = mongoose.model('Note', noteSchema);
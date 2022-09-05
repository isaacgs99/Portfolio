const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Announcement name is required.'
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: String,
    summary: {
        type: String,
        trim: true
    }
});

announcementSchema.index({
    name: 'text'
});

module.exports = mongoose.model('Announcement', announcementSchema);
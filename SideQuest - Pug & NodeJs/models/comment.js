const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user_id: mongoose.Types.ObjectId,
    username: String,
    date: {
        type: Date,
        default: Date.now
    },
    text: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);
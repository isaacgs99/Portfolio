const mongoose = require ('mongoose');
const Comment = require('./comment');

const commentSchema = mongoose.model('Comment').schema;

const noteSubSchema = new mongoose.Schema({
    character_id: mongoose.Schema.Types.ObjectId,
    character: String,
    text: {
        type: String,
        trim: true
    }
});

const storySchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Story name is required.'
    },
    summary: {
        type: String,
        trim: true
    },
    comments: [commentSchema]
});

storySchema.index({
    name: 'text'
});

module.exports = mongoose.model('Story', storySchema);
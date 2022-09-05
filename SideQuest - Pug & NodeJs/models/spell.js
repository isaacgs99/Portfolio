const mongoose = require('mongoose');

const spellSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Spell name is missing'
    },
    level: Number,
    school: String,
    ritual: Boolean,
    concentration: Boolean,
    casting_time: String,
    range: String,
    components: [String],
    materials: String,
    duration: String,
    description: {
        type: String,
        trim: true
    }
});

spellSchema.index({
    name: 'text',
    level: 'text',
    school: 'text'
});

module.exports = mongoose.model('Spell', spellSchema);
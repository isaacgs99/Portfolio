const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Class name is required.'
    },
    description: {
        type: String,
        trim: true
    },
    hit_die: String,
    hitpoints_start: String,
    hitpoints_higherlvls: String,
    abilities: [String],
    st_proficiencies: [String],
    spell_ability: String,
    skills: {
        choose: Number,
        skills: [String]
    },
    armor_weapon_proficiencies: {
        type: String,
        trim: true
    },
    tool_proficiencies: {
        type: String,
        trim: true
    }
});

classSchema.index({
    name: 'text'
});

module.exports = mongoose.model('Class', classSchema);
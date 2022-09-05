const mongoose = require('mongoose');

const abilitySubSchema = new mongoose.Schema({
    base_score: {
        type: Number,
        default: 0
    },
    racial_bonus: {
        type: Number,
        default: 0
    },
    improvements: {
        type: Number,
        default: 0
    },
    misc_bonus: {
        type: Number,
        default: 0
    },
    total_score: {
        type: Number,
        default: 0
    },
    modifier: {
        type: Number,
        default: 0
    },
    other: Number,
    override: Number
}, { _id: false });

const weaponSubSchema = new mongoose.Schema({
    name: String,
    attackBonus: Number,
    damage: String
}, { _id: false });

const heroSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Hero name is required.',
        trim: true,
    },
    image: String,
    race: mongoose.Schema.Types.ObjectId,
    class: mongoose.Schema.Types.ObjectId,
    class_proficiencies: [String],
    level: { type: Number, required: false, default: 0 },
    xp: { type: Number, required: false, default: 0 },  // Not used in website
    abilities: {
        inspiration: {
            type: Boolean,
            required: false,
            default: false
        },
        proficiency_bonus: {
            type: Number,
            required: false,
            default: 2
        },
        passive_perception: {
            type: Number,
            required: false,
            default: 10
        },
        strength: abilitySubSchema,
        dexterity: abilitySubSchema,
        constitution: abilitySubSchema,
        intelligence: abilitySubSchema,
        wisdom: abilitySubSchema,
        charisma: abilitySubSchema
    },
    saving_throws: {
        strength: {
            type: Boolean,
            required: false,
            default: false
        },
        dexterity: {
            type: Boolean,
            required: false,
            default: false
        },
        constitution: {
            type: Boolean,
            required: false,
            default: false
        },
        intelligence: {
            type: Boolean,
            required: false,
            default: false
        },
        wisdom: {
            type: Boolean,
            required: false,
            default: false
        },
        charisma: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    skills: {
        acrobatics: {
            type: Boolean,
            required: false,
            default: false
        },
        animal_handling: {
            type: Boolean,
            required: false,
            default: false
        },
        arcana: {
            type: Boolean,
            required: false,
            default: false
        },
        athletics: {
            type: Boolean,
            required: false,
            default: false
        },
        deception: {
            type: Boolean,
            required: false,
            default: false
        },
        history: {
            type: Boolean,
            required: false,
            default: false
        },
        insight: {
            type: Boolean,
            required: false,
            default: false
        },
        intimidation: {
            type: Boolean,
            required: false,
            default: false
        },
        investigation: {
            type: Boolean,
            required: false,
            default: false
        },
        medicine: {
            type: Boolean,
            required: false,
            default: false
        },
        nature: {
            type: Boolean,
            required: false,
            default: false
        },
        perception: {
            type: Boolean,
            required: false,
            default: false
        },
        performance: {
            type: Boolean,
            required: false,
            default: false
        },
        persuasion: {
            type: Boolean,
            required: false,
            default: false
        },
        religion: {
            type: Boolean,
            required: false,
            default: false
        },
        sleight_of_hand: {
            type: Boolean,
            required: false,
            default: false
        },
        stealth: {
            type: Boolean,
            required: false,
            default: false
        },
        survival: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    physical_attributes: {
        ac: {
            type: Number,
            required: false,
            default: 0
        },
        initiative: {
            type: Number,
            required: false,
            default: 0
        },
        speed: {
            type: Number,
            required: false,
            default: 0
        },
        // Not used in page from here till bottom of physical_attributes[]
        current_hp: {
            type: Number,
            required: false,
            default: 0
        },
        temp_hp: {
            type: Number,
            required: false,
            default: 0
        },
        current_hitdie: {
            type: Number,
            required: false,
            default: 0
        },
        deathsaves_success: {
            type: Number,
            required: false,
            default: 0,
            max: 3
        },
        deathsaves_fail: {
            type: Number,
            required: false,
            default: 0,
            max: 3
        }
    },
    description: {
        background: String,
        alignment: String,
        faith: String,
        place_of_origin: String,
        physical: {
            age: { type: Number, required: false, default: 0 },
            height: String,
            weight: { type: Number, required: false, default: 0 },
            eye_color: String,
            skin_color: String,
            hair_color: String,
            gender: String
        },
        personality: {
            traits: {
                type: String,
                trim: true
            },
            ideals: {
                type: String,
                trim: true
            },
            bonds: {
                type: String,
                trim: true
            },
            flaws: {
                type: String,
                trim: true
            }
        },
        notes: {
            organization: {
                text: {
                    type: String,
                    trim: true
                },
                name: String,
                emblem: String
            },
            allies : {
                type: String,
                trim: true
            },
            enemies: {
                type: String,
                trim: true
            },
            backstory: {
                type: String,
                trim: true
            },
            other: {
                type: String,
                trim: true
            }
        }
    },
    equipment: {
        starting: {
            type: String,
            trim: true
        },
        weapons: {
            list: [weaponSubSchema],
            notes: {
                type: String,
                trim: true
            }
        },
        money: {
            copper: Number,
            silver: Number,
            electrum: Number,
            gold: Number,
            platinum: Number
        },
        active: {
            type: String,
            trim: true
        },
        inventory: {
            type: String,
            trim: true
        },
        treasure: {
            type: String,
            trim: true
        }
    },
    additional_info: {
        features_and_traits: {
            type: String,
            trim: true
        },
        additional_features_traits: {
            type: String,
            trim: true
        },
        proficiencies_and_languages: {
            type: String,
            trim: true
        }
    },
    spells: {
        racial: [mongoose.Schema.Types.ObjectId],
        class: [mongoose.Schema.Types.ObjectId]
    }
});

module.exports = mongoose.model('Hero', heroSchema);
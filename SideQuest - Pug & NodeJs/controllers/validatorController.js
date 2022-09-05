// Express Validator
const { check, body, validationResult } = require('express-validator');

exports.searchVS = [
    check('*').if(value => value != '').isLength({ max: 250 }).withMessage('Search queries must be at most 250 characters long.'),

    check('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        next(errors.array())
    }
];

exports.sanitize = [
    body('*').trim().escape(),

    (req, res, next) => next()
];

exports.heroVS = [
    body('name').trim().blacklist('<|>|\/'),
    body('description.background').trim().blacklist('<|>|&|"'),
    body('description.alignment').trim().escape(),
    body('description.faith').trim().blacklist('<|>|\/'),
    body('description.place_of_origin').trim().blacklist('<|>|\/'),
    body('description.physical.height').trim().blacklist('<|>|&|\/'),
    body('description.physical.eye_color').trim().escape(),
    body('description.physical.skin_color').trim().escape(),
    body('description.physical.hair_color').trim().escape(),
    body('description.physical.gender').trim().escape(),
    body('description.personality.traits').trim().blacklist('<|>'),
    body('description.personality.ideals').trim().blacklist('<|>'),
    body('description.personality.bonds').trim().blacklist('<|>'),
    body('description.personality.flaws').trim().blacklist('<|>'),
    body('description.notes.organization.name').trim().blacklist('<|>'),
    body('description.notes.allies').trim().blacklist('<|>'),
    body('description.notes.enemies').trim().blacklist('<|>'),
    body('description.notes.other').trim().blacklist('<|>'),
    // body('equipment.weapons.list').isArray().blacklist('<|>'),
    // body('equipment.weapons.list[0][name]').blacklist('<|>|\/'),
    // body('equipment.weapons.list[0][damage]').escape(),
    // body('equipment.weapons.list[1][name]').blacklist('<|>|\/'),
    // body('equipment.weapons.list[1][damage]').blacklist('<|>|&|\'|"|\/'),
    // body('equipment.weapons.list[2][name]').blacklist('<|>|\/'),
    // body('equipment.weapons.list[2][damage]').blacklist('<|>|&|\'|"|\/'),

    (req, res, next) => next()
];

exports.characterVS = [
    body('title').isLength({ max: 50 }).withMessage('Título del personaje no puede ser más largo de 50 caracteres.')
    .trim().blacklist('<|>'),

    body('affiliation').isLength({ max: 50 }).withMessage('Afiliación del personaje no puede ser más largo de 50 caracteres.')
    .trim().blacklist('<|>'),

    body('place').isLength({ max: 50 }).withMessage('Lugar de origen del personaje no puede ser más largo de 50 caracteres.')
    .trim().blacklist('<|>'),
    
    body('race').if(value => value != '').isLength({ max: 50 }).withMessage('Raza del personaje no puede ser más largo de 50 caracteres.')
    .trim().blacklist('<|>|\/'),
    
    body('class').if(value => value != '').isLength({ max: 50 }).withMessage('Clase del personaje no puede ser más largo de 50 caracteres.')
    .trim().blacklist('<|>|\/'),
    
    body('size').isLength({ max: 50 }).withMessage('Tamaño del personaje no puede ser más largo de 50 caracteres.')
    .trim().blacklist('<|>|\/'),

    body('appearance').trim().blacklist('<|>'),

    body('name').isLength({ max: 50 }).withMessage('Nombre del personaje no puede ser más largo de 50 caracteres.')
    .trim().blacklist('<|>'),

    (req, res, next) => {
        const errors = validationResult(req);
        next(errors.array())
    }
];

exports.nameSanitizer = [
    body('name').trim().blacklist('<|>'),

    (req, res, next) => next()
];

exports.raceVS = [
    body('name').if(value => value != '').isLength({ max: 50 }).withMessage('Race name can be at most 50 characters long.')
    .trim().blacklist('<|>'),

    body('alignment').if(value => value != '').isLength({ max: 50 }).withMessage('Race alignment can be at most 50 characters long.')
    .trim().blacklist('<|>'),

    body('size').if(value => value != '').isLength({ max: 50 }).withMessage('Race size can be at most 50 characters long.')
    .trim().blacklist('<|>'),

    body('languages').if(value => value != '').isLength({ max: 50 }).withMessage('Race languages can be at most 50 characters long.')
    .trim().blacklist('<|>'),

    (req, res, next) => {
        const errors = validationResult(req);
        next(errors.array())
    }
];

exports.classVS = [
    body('name').if(value => value != '').isLength({ max: 50 }).withMessage('Class name can be at most 50 characters long.')
    .trim().blacklist('<|>'),

    body('hit_die').isLength({ max: 50 }).withMessage('Class hit die can be at most 50 characters long.')
    .trim().escape(),

    body('hitpoints_start').isLength({ max: 100 }).withMessage('Class hit points at 1st level can be at most 100 characters long.')
    .trim().escape(),
    
    body('hitpoints_higherlvls').isLength({ max: 100 }).withMessage('Class hit points at higher levels can be at most 100 characters long.')
    .trim().escape(),

    body('armor_weapon_proficiencies').trim().escape(),

    body('tool_proficiencies').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        next(errors.array())
    }
];
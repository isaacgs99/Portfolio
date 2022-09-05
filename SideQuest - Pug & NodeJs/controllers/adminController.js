// Require models
const User = require('../models/user');
const Hero = require('../models/hero');
const Race = require('../models/race');
const Class = require('../models/class');
const Story = require('../models/story');
const Character = require('../models/character');
const Announcement = require('../models/announcement');

const { check, body, validationResult } = require('express-validator');

// Admin Account View
exports.adminView = async (req, res, next) => {
    try {
        const username = req.user.username;
        res.render('admin/account_view', { title: `${res.locals.siteAlias} - Admin`, username });
    } catch(error) {
        next(error);
    }
};

// Users edit and delete
exports.users = async (req, res, next) => {
    try {
        const username = req.user.username;
        const users = await User.find();
        res.render('admin/users', { title: `${res.locals.siteAlias} Admin - Manage Users`, username, users });
    } catch(error) {
        next(error);
    }
};

exports.editUserGet = async (req, res, next) => {
    try {
        const username = req.user.username;
        const usersQuery = User.find();
        const userQuery = User.findOne({ _id: req.params.userId });
        const [users, userEdit] = await Promise.all([usersQuery, userQuery]);
        const userHeroes = await User.aggregate([
            { $match: { _id: userEdit._id } },
            { $lookup: {
                from: 'heros',
                localField: 'characters',
                foreignField: '_id',
                as: 'characters'
            } }
        ]).then(result => result[0].characters);
        res.render('admin/users', { title: `${res.locals.siteAlias} Admin - Edit User`, username, userEdit, userHeroes, users});
    } catch(error) {
        next(error);
    }
};

exports.editUserPost = [
    // Validate user input data
    check('username').isLength({ min: 3, max: 20 }).withMessage('Username must be from 3 to 20 characters long.')
    .isAlphanumeric().withMessage('Username must be alphanumeric.'),

    check('password')
    .custom((value, { req }) => {
        if(value && value.length >= 6){ return true; }
        else if(!value) { return true; }
        else { return false; }
    }).withMessage('Invalid password, passwords must be a minimum of 6 characters long.'),

    check('confirm_password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match.'),

    // Sanitize user input data
    check('*').trim().escape(),
    check('transfer').toArray(),

    async (req, res, next) => {
        try {
            var user = await User.findOne({ _id: req.params.userId });

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                // There are errors
                const usersQuery = User.find();
                const userHeroesQuery = User.aggregate([
                    { $match: { _id: user._id } },
                    { $lookup: {
                        from: 'heros',
                        localField: 'characters',
                        foreignField: '_id',
                        as: 'characters'
                    } }
                ]).then(result => result[0].characters);
                const [users, userHeroes] = await Promise.all([usersQuery, userHeroesQuery]);
                res.render('admin/users', { title: `${res.locals.siteAlias} Admin - Edit User`, errors: errors.array(), username: req.user.username, users, userEdit: user, userHeroes });
                return;
            } else {
                // No errors
                user = await User.findByUsername(user.username).then(async user => {
                    if(user.username != req.body.username) user.username = req.body.username;
                    if(req.body.password) await user.setPassword(req.body.password);
                    await user.save();
                    return user;
                });
            }
            
            req.body.isAdmin
                ? user.isAdmin = true
                : user.isAdmin = false;
            req.body.isDM
                ? user.isDM = true
                : user.isDM = false;
            
            const updatedHeroes = [];
            if(req.body.transfer) {
                let heroIdx = 0;
                for(const change of req.body.transfer) {
                    if(change != -1) {
                        const heroId = change.split(',')[0];
                        const userId = change.split(',')[1]
                        
                        user.characters.splice(heroIdx, 1);
                        const heroTransfer = await User.findOne({ _id: userId });
                        heroTransfer.characters.push(heroId);
                        updatedHeroes.push(heroTransfer);
                    } else {
                        heroIdx++;
                    }
                }
            }

            await User.findByIdAndUpdate(user._id, user, { new: true });
            for(const updatedUser of updatedHeroes) {
                await User.findByIdAndUpdate(updatedUser._id, updatedUser, { new: true });
            }

            res.redirect(`/admin/users`);
        } catch(error) {
            next(error);
        }
}];

// Announcements
exports.announcements = async (req, res, next) => {
    try {
        const username = req.user.username;
        const announcements = await Announcement.aggregate([ { $sort: { date: -1 } } ]);

        if(res.locals.url.includes('/admin/')){
            res.locals.url.endsWith('/newannouncement')
                ? res.render('admin/announcements', { title: `${res.locals.siteAlias} Admin - Anuncio Nuevo` })
                : res.render('admin/announcements', { title: `${res.locals.siteAlias} Admin - Anuncios`, username, announcements });
        } else {
            res.locals.url.endsWith('/newannouncement')
            ? res.render('admin/announcements', { title: `${res.locals.siteAlias} DM - Anuncio Nuevo` })
            : res.render('admin/announcements', { title: `${res.locals.siteAlias} DM - Anuncios`, username, announcements });
        }
    } catch(error) {
        next(error);
    }
};

exports.announcementsSearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const username = req.user.username;
            const announcements = await Announcement.aggregate([ { $sort: { date: -1 } } ]);
            if(res.locals.url.includes('/admin/')){
                res.render('admin/announcements', { title: `${res.locals.siteAlias} Admin - Anuncios`, username, announcements, errors: validationErrors });
            } else {
                res.render('admin/announcements', { title: `${res.locals.siteAlias} DM - Anuncios`, username, announcements, errors: validationErrors });
            }
            return;
        }

        const username = req.user.username;
        const searchQuery = req.body;
        const announcements = await Announcement.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);
        
        res.locals.url.includes('/admin/')
            ? res.render('admin/announcements', { title: `${res.locals.siteAlias} Admin - Anuncios: Búsqueda`, username, announcements })
            : res.render('admin/announcements', { title: `${res.locals.siteAlias} DM - Anuncios: Búsqueda`, username, announcements });
    } catch(error) {
        next(error);
    }
};

exports.newAnnouncementPost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const announcement = new Announcement(req.body);
        announcement.user = username;
        
        await announcement.save();
        res.locals.url.includes('/admin/')
            ? res.redirect(`/admin/announcements/edit/${announcement._id}`)
            : res.redirect(`/dm/announcements/edit/${announcement._id}`)
    } catch(error) {
        next(error);
    }
};

exports.editAnnouncementGet = async (req, res, next) => {
    try {
        const username = req.user.username;
        const announcement = await Announcement.findOne({ _id: req.params.announcementId });

        res.locals.url.includes('/admin/')
            ? res.render('admin/announcements', { title: `${res.locals.siteAlias} Admin - Editar Anuncio`, username, announcement })
            : res.render('admin/announcements', { title: `${res.locals.siteAlias} DM - Editar Anuncio`, username, announcement });
    } catch(error) {
        next(error);
    }
};

exports.editAnnouncementPost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const announcementId = req.params.announcementId;

        if(req.body.deleteannouncement != 'true') {
            await Announcement.findByIdAndUpdate(announcementId, req.body, { new: true });
            res.locals.url.includes('/admin/')
                ? res.redirect(`/admin/announcements/edit/${announcementId}`)
                : res.redirect(`/dm/announcements/edit/${announcementId}`)
        } else {
            await Announcement.findByIdAndRemove(announcementId);
            res.locals.url.includes('/admin/')
                ? res.redirect(`/admin/announcements`)
                : res.redirect(`/dm/announcements`);
        }
    } catch(error) {
        next(error);
    }
};

// Heroes edit and delete
exports.heroes = async (req, res, next) => {
    try {
        const username = req.user.username;
        const heroes = await Hero.aggregate([ { $sort: { name: 1 } } ]);

        res.render('admin/heroes', { title: `${res.locals.siteAlias} Admin - Manage Heroes`, username, heroes });
    } catch(error) {
        next(error);
    }
};

// Races CURD
exports.races = async (req, res, next) => {
    try {
        const username = req.user.username;
        const races = await Race.aggregate([ { $sort: { name: 1 } } ]);
        
        res.locals.url.endsWith('/newrace')
            ? res.render('admin/races', { title: `${res.locals.siteAlias} Admin - New Race` })
            : res.render('admin/races', { title: `${res.locals.siteAlias} Admin - Manage Races`, username, races });
    } catch(error) {
        next(error);
    }
};

exports.racesSearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0){
            const username = req.user.username;
            const races = await Race.aggregate([ { $sort: { name: 1 } } ]);
            res.render('admin/races', { title: `${res.locals.siteAlias} Admin - Manage Races`, username, races, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const searchQuery = req.body;
        const races = await Race.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);
        
        res.render('admin/races', { title: `${res.locals.siteAlias} Admin - Races: Search`, username, races });
    } catch(error) {
        next(error);
    }
};

exports.newRacePost = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0){
            res.render('admin/races', { title: `${res.locals.siteAlias} Admin - New Race`, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const race = new Race(req.body);

        const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const abilityIncreaseDict = {
            strength: req.body.strengthIncrease,
            dexterity: req.body.dexterityIncrease,
            constitution: req.body.constitutionIncrease,
            intelligence: req.body.intelligenceIncrease,
            wisdom: req.body.wisdomIncrease,
            charisma: req.body.charismaIncrease
        };

        for(let i = 0; i < 6; i++) {
            if(abilityIncreaseDict[abilities[i]]) {
                const abilityIncrease = {
                    name: abilities[i],
                    increase: abilityIncreaseDict[abilities[i]]
                }
                race.ability_increase.push(abilityIncrease);
            }
        }

        await race.save();
        res.redirect(`/admin/races/edit/${race._id}`);
    } catch(error) {
        next(error);
    }
};

exports.editRaceGet = async (req, res, next) => {
    try {
        const race = await Race.findOne({ _id: req.params.raceId });

        res.render('admin/races', { title: `${res.locals.siteAlias} Admin - Edit Race`, race });
    } catch(error) {
        next(error);
    }
};

exports.editRacePost = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const race = await Race.findOne({ _id: req.params.raceId });
            res.render('admin/races', { title: `${res.locals.siteAlias} Admin - Edit Race`, race, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const raceId = req.params.raceId;
        const race = new Race(req.body);
        
        race._id = raceId;
        const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const abilityIncreaseDict = {
            strength: req.body.strengthIncrease,
            dexterity: req.body.dexterityIncrease,
            constitution: req.body.constitutionIncrease,
            intelligence: req.body.intelligenceIncrease,
            wisdom: req.body.wisdomIncrease,
            charisma: req.body.charismaIncrease
        };

        for(let i = 0; i < 6; i++) {
            if(abilityIncreaseDict[abilities[i]]) {
                const abilityIncrease = {
                    name: abilities[i],
                    increase: abilityIncreaseDict[abilities[i]]
                }
                race.ability_increase.push(abilityIncrease);
            }
        }

        if(req.body.deleterace != 'true') {
            await Race.findByIdAndUpdate(raceId, race, { new: true });
            res.redirect(`/admin/races/edit/${raceId}`);
        } else {
            await Race.findByIdAndRemove(raceId);
            res.redirect(`/admin/races`);
        }
    } catch(error) {
        next(error);
    }
};

exports.classes = async (req, res, next) => {
    try {
        const username = req.user.username;
        const classes = await Class.aggregate([ { $sort: { name: 1 } } ]);
        
        res.locals.url.endsWith('/newclass')
            ? res.render('admin/classes', { title: `${res.locals.siteAlias} Admin - New Class` })
            : res.render('admin/classes', { title: `${res.locals.siteAlias} Admin - Manage Classes`, username, classes });
    } catch(error) {
        next(error);
    }
};

exports.classesSearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const username = req.user.username;
            const classes = await Class.aggregate([ { $sort: { name: 1 } } ]);
            res.render('admin/classes', { title: `${res.locals.siteAlias} Admin - Manage Classes`, username, classes, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const searchQuery = req.body;
        const classes = await Class.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);
        
        res.render('admin/classes', { title: `${res.locals.siteAlias} Admin - Classes: Search`, username, classes });
    } catch(error) {
        next(error);
    }
};

exports.newClassPost = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            res.render('admin/classes', { title: `${res.locals.siteAlias} Admin - New Class`, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const newClass = new Class(req.body);

        await newClass.save();
        res.redirect(`/admin/classes`)
    } catch(error) {
        next(error);
    }
};

exports.editClassGet = async (req, res, next) => {
    try {
        const classId = req.params.classId;
        const heroClass = await Class.findOne({ _id: classId });

        res.render('admin/classes', { title: `${res.locals.siteAlias} Admin - Edit Class`, heroClass });
    } catch(error) {
        next(error);
    }
};

exports.editClassPost = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const classId = req.params.classId;
            const heroClass = await Class.findOne({ _id: classId });
            res.render('admin/classes', { title: `${res.locals.siteAlias} Admin - Edit Class`, heroClass, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const classId = req.params.classId;
        const editedClass = new Class(req.body);

        editedClass._id = classId;
        if(req.body.spell_ability == undefined) editedClass.spell_ability = '';

        if(req.body.deleteclass != 'true') {
            await Class.findByIdAndUpdate(classId, editedClass, { new: true });
            res.redirect(`/admin/classes/edit/${classId}`);
        } else {
            await Class.findByIdAndRemove(classId);
            res.redirect(`/admin/classes`);
        }
    } catch(error) {
        next(error);
    }
};
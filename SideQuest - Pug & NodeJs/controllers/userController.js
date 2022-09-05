/**
 * userController.js is the main driver for all the routes within "routes/user.js", prefixed by "/user".
 * @module userController
 */

// Require models
const User = require('../models/user');
const Hero = require('../models/hero');
const Spell = require('../models/spell');
const Story = require('../models/story');
const Character = require('../models/character');
const Race = require('../models/race');
const Class = require('../models/class');
const Map = require('../models/map');

// Require middleware
const Passport = require('passport');
const Cloudinary = require('cloudinary');
const Multer = require('multer');

// Require middleware for documentation
const e = require('express');

// Set up Cloudinary
Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/******************************************/
/************ Image Handling **************/
/******************************************/
// Set up Multer
const storage = Multer.diskStorage({}); // Tells multer no disk storage will be required, therefore no path, empty obj
const upload = Multer({ storage }); // Passes storage onto Multer and saves in upload const
// exports.upload = upload.single('image');    // Tells multer to only handle single-file uploads
exports.upload = upload.fields([
    { name: 'image', maxCount: 2 },
    { name: 'emblem_image', maxCount: 2 }
]);

/**
 * Pushes user images and media to Cloudinary, depending on the route on which 
 * the images were uploaded in.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.pushToCloudinary = async (req, res, next) => {
    if(req.files) {
        if(res.locals.url.includes('/heroes/')) {
            if(req.files.image != undefined){
                await Cloudinary.v2.uploader.upload(req.files.image[0].path, {
                    folder: `${res.locals.cloudinaryFolder}/heroImages`
                })
                .then((result) => {
                    req.body.image = result.public_id;
                    // next();
                })
                .catch(() => {
                    // req.flash('error', 'Sorry, there was a problem uploading your image. Please try again');
                    const username = req.user.username;
                    const heroId = req.params.heroId;
                    res.locals.url.endsWith('/heroes/newHero')
                        ? res.redirect(`/users/heroes/newHero`)
                        : res.redirect(`/users/heroes/${heroId}`);
                    console.log('Error: Hero Image');
                });
            }
            
            if(req.files.emblem_image != undefined) {
                await Cloudinary.v2.uploader.upload(req.files.emblem_image[0].path || null, {
                    folder: `${res.locals.cloudinaryFolder}/heroOrganizationEmblems`
                })
                .then((result) => {
                    req.body.emblem_image = result.public_id;
                    // next();
                })
                .catch(() => {
                    // req.flash('error', 'Sorry, there was a problem uploading your image. Please try again');
                    const username = req.user.username;
                    const heroId = req.params.heroId;
                    res.locals.url.endsWith('/heroes/newHero')
                        ? res.redirect(`/users/heroes/newHero`)
                        : res.redirect(`/users/heroes/${heroId}`);
                    console.log('Error: Emblem Image');
                });
            }

            next();

        } else if(res.locals.url.includes('/characters/')) {
            if(req.files.image == undefined) next();
            Cloudinary.v2.uploader.upload(req.files.image[0].path || null, {
                folder: `${res.locals.cloudinaryFolder}/characterImages`
            })
            .then((result) => {
                req.body.image = result.public_id;
                next();
            })
            .catch(() => {
                // req.flash('error', 'Sorry, there was a problem uploading your image. Please try again');
                const username = req.user.username;
                const characterId = req.params.characterId;
                (characterId != undefined && characterId != '')
                    ? res.redirect(`/users/characters/edit/${characterId}`)
                    : res.redirect(`/users/characters/newcharacter`);
            });
        } else if(res.locals.url.includes('/maps/')) {
            if(req.files.image == undefined) next();
            Cloudinary.v2.uploader.upload(req.files.image[0].path || null, {
                folder: `${res.locals.cloudinaryFolder}/mapImages`
            })
            .then(result => {
                req.body.image = result.public_id;
                next();
            })
            .catch(() => {
                const username = req.user.username;
                const mapId = req.params.mapId;
                (mapId != undefined && mapId != '')
                    ? res.redirect(`/users/maps/edit/${mapId}`)
                    : res.redirect(`/users/maps/newmap`);
            })
        } else {
            Cloudinary.v2.uploader.upload(req.file.path, {
                folder: `${res.locals.cloudinaryFolder}`
            })
            .then((result) => {
                req.body.image = result.public_id;
                next();
            })
            .catch(() => {
                // req.flash('error', 'Sorry, there was a problem uploading your image. Please try again');
                const username = req.user.username;
                res.redirect(`/users`);
            });
        }
    } else {
        next();
    }
};


/******************************************/
/************* Login/Signup ***************/
/******************************************/
// Express Validator
const { check, validationResult } = require('express-validator');

// Sign up
/**
 * Responds with SideQuest DnD's signup page.
 *
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.signUpGet = (req, res) => {
    res.render('users/signup', { title: `${res.locals.siteAlias} - Crear Usuario` });
};

/**
 * Sends information of a new user to create in DB.
 *
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.signUpPost = [
    // Validate user's data
    check('username').isLength({ min: 3, max: 20 }).withMessage('Username must be from 3 to 20 characters long.')
    .isAlphanumeric().withMessage('Username must be alphanumeric'),

    check('password').isLength({ min: 6 }).withMessage('Invalid password, passwords must be a minimum of 6 characters long'),

    check('confirm_password')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

    check('*').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            // There are errors
            // res.json(req.body);
            res.render('users/signup', { title: 'Please fix the following errors:', errors: errors.array() });
            return;
        } else {
            // No errors
            const newUser = new User(req.body);
            User.register(newUser, req.body.password, function(err) {
                if(err) {
                    console.log('Error while registering.', err);
                    return next(err);
                }
                next(); // Moves over to loginPost after registering
            });
        }
    }
];

// Login/Logout
/**
 * Responds with SideQuest DnD's login page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.loginGet = (req, res) => {
    res.render('users/login', { title: `${res.locals.siteAlias} - Ingreso` });
};

/**
 * Sends information to log user in or deny to it.
 */
exports.loginPost = Passport.authenticate('local', {
    successRedirect: '/users',
    // successFlash: 'You are now logged in',
    failureRedirect: '/login'
    // failureFlash: 'Login failed, please try again'
});

/**
 * Responds with SideQuest DnD's login page. 
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.logout = (req, res) => {
    req.logout();
    req.session.destroy(err => console.error('Error Destroying Session: ', err));
    // req.flash('info', 'You are now logged out');
    res.redirect('/');
};

// Authentication (Admin, DM)
/**
 * Verifies, on every user route, that the user is authenticated before proceeding.
 * 
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.isAuth = (req, res, next) => {
    req.isAuthenticated()
        ? next()
        : res.redirect('/login');
};

/**
 * Verifies, on certain routes, if the user has admin privileges before proceeding.
 * 
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.isAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.isAdmin) {
        next();
        return;
    }
    res.redirect('/users');
};

/**
 * Verifies, on certain routes, if the user has dungeon master privileges before proceeding.
 * 
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.isDM = (req, res, next) => {
    if(req.isAuthenticated() && req.user.isDM) {
        next();
        return;
    }
    res.redirect('/users');
};

/**
 * Verifies, on certain routes, if the user has either dungeon master or admin privileges before proceeding.
 * 
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.isDMorAdmin = (req, res, next) => {
    if(req.isAuthenticated() && (req.user.isDM || req.user.isAdmin)) {
        next();
        return;
    }
    res.redirect('/users');
};

/******************************************/
/************* Account View ***************/
/******************************************/
/**
 * Responds with SideQuest DnD's user account page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.accountView = async (req, res, next) => {
    try{
        const user = req.user;
        res.render('users/account_view', { title: `${res.locals.siteAlias} - ${user.username}` , user });
    } catch(error) {
        next(error);
    }
};

/**
 * Edit info of user's account.
 * 
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.accountViewPost = [
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

    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            // There are errors
            res.render('users/account_view', { title: `${res.locals.siteAlias} - ${res.locals.user.username}`, errors: errors.array() });
            return;
        } else {
            // No errors
            User.findByUsername(res.locals.user.username).then(async user => {
                const successUser = user.username != req.body.username ? true : false;
                if(user.username != req.body.username) user.username = req.body.username;

                const successPass = req.body.password ? true : false;
                if(req.body.password) await user.setPassword(req.body.password);
                
                user.save();
                res.render('users/account_view', { title: `${res.locals.siteAlias} - ${user.username}`, user, successUser, successPass });
            });
        }
    }
];

// Heroes
/**
 * Responds with SideQuest DnD's character heroes page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.heroes = async (req, res, next) => {
    try {
        const username = req.user.username;
        const user = await User.findOne({ username: username });

        const userHeroes = await User.aggregate([
            { $match: { username: username } },
            { $lookup: {
                from: 'heros',
                localField: 'characters',
                foreignField: '_id',
                as: 'characters'
            } }
        ]).then(result => result[0].characters);

        res.render('users/heroes', { title: `${res.locals.siteAlias} - Mis Héroes`, username, userHeroes });
    } catch(error) {
        next(error);
    }
};

// Create/Edit Hero

/**
 * Responds with SideQuest DnD's user new hero page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.newHeroGet = async (req, res, next) => {
    try {
        const username = req.user.username;
        const heroId = req.params.heroId;

        const user = await User.findOne({ username: username });
        let userOwnsHero = false;
        user.characters.forEach(characterid => {
            if(characterid.toString() == heroId) userOwnsHero = true;
        });

        if(!userOwnsHero && !user.isAdmin && !res.locals.url.includes('/newHero')) {
            res.redirect('/users/heroes');
            return;
        }

        const heroQuery = Hero.findOne({ _id: heroId });
        const racesQuery = Race.aggregate([ { $sort: { name: 1 } } ]);
        const classesQuery = Class.aggregate([ { $sort: { name: 1 } } ]);

        const spellsQuery = [];

        for(let i = 0; i < 10; i++) {
            const level = Spell.aggregate([
                { $match: { level: i } },
                { $sort: { name: 1 } }
            ]);
            spellsQuery.push(level);
        }

        const [hero, races, classes] = await Promise.all([heroQuery, racesQuery, classesQuery]);
        const spells = await Promise.all(spellsQuery.map(level => level));

        let heroSpells = {};
        
        if(!res.locals.url.endsWith('/newHero')) {
            // Hero spells (can be 'slimmed-down')
            const getHeroSpells = await Hero.aggregate([
                { $match: { name: hero.name } },
                { $lookup: {
                    from: 'spells',
                    localField: 'spells.racial',
                    foreignField: '_id',
                    as: 'spells.racial'
                } },
                { $lookup: {
                    from: 'spells',
                    localField: 'spells.class',
                    foreignField: '_id',
                    as: 'spells.class'
                } }
            ]).then(res => res[0].spells);

            // First sorts spells from unsorted array by level, and then sorts spells for each level alphabetically.
            // Returns spells sorted by alphabetically by level in an object.
            function spellsAlphaByLevelSort(unsortedArray) {
                const outputObject = {};
                
                unsortedArray.forEach(spell => {
                    !(spell.level in outputObject)
                        ? outputObject[spell.level] = [spell]
                        : outputObject[spell.level].push(spell);
                });
                
                Object.values(outputObject).forEach(spell => {
                    spell.sort((a, b) => {
                        if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                        if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                        return 0;
                    });
                });
                
                return outputObject;
            }
            
            // Sort spells by alphabetically level
            const racialSpells = spellsAlphaByLevelSort(getHeroSpells.racial);
            const classSpells = spellsAlphaByLevelSort(getHeroSpells.class);

            heroSpells = {racial: racialSpells, class: classSpells};
        }
        
        res.locals.url.endsWith('/newHero')
            ? res.render('users/heroes', { title: `${res.locals.siteAlias} - Crear Héroe`, username, races, classes, spells })
            : res.render('users/heroes', { title: `${res.locals.siteAlias} - Editar Héroe`, username, races, classes, spells, hero, heroSpells });
    } catch(error) {
        next(error);
    }
};

/**
 * Creates a new hero for user.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.newHeroPost = async (req, res, next) => {
    try {
        const hero = new Hero(req.body);
        const userQuery = User.findOne({ username: req.user.username });
        const heroClassQuery = Class.findOne({ _id: req.body.class.split(',')[1] });
        const [user, heroClass] = await Promise.all([userQuery, heroClassQuery]);
        
        user.characters.push(hero._id);
        
        hero.race = req.body.race.split(',')[1];
        hero.class = req.body.class.split(',')[1];

        hero.class_proficiencies = req.body.proficiency;
        
        if(req.body.class != -1){
            heroClass.st_proficiencies.forEach(st => hero['saving_throws'][`${st}`] = true);
            if ('proficiency' in req.body) req.body.proficiency.forEach(skill => (skill != -1) ? hero['skills'][`${skill}`] = true : []);
        }

        req.body.emblem_image == undefined
            ? hero.description.notes.organization.emblem = ''
            : hero.description.notes.organization.emblem = req.body.emblem_image;

        // res.json(hero)
        await hero.save();
        await User.findByIdAndUpdate(user._id, user, { new: true });
        res.redirect(`/users/heroes`);
    } catch(error) {
        next(error);
    }
};

/**
 * Updates information of a specific user's hero.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.editHeroPost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const heroId = req.params.heroId;
        const oldHeroQuery = Hero.findOne({ _id: heroId });
        const hero = new Hero(req.body);
        const heroClassQuery = Class.findOne({ _id: req.body.class.split(',')[1] });
        const [oldHero, heroClass] = await Promise.all([oldHeroQuery, heroClassQuery]);

        hero._id = oldHero._id;
        hero.image = oldHero.image;
        hero.description.notes.organization.emblem = oldHero.description.notes.organization.emblem;

        hero.race = req.body.race.split(',')[1];
        hero.class = req.body.class.split(',')[1];

        hero.class_proficiencies = req.body.proficiency;
        
        if(req.body.class != -1){
            heroClass.st_proficiencies.forEach(st => hero['saving_throws'][`${st}`] = true);
            if ('proficiency' in req.body) req.body.proficiency.forEach(skill => (skill != -1) ? hero['skills'][`${skill}`] = true : []);
        }

        const tmpHero = new Hero(hero);
        hero.image = req.body.image;
        req.body.image === undefined ? hero.image = tmpHero.image : hero.image = req.body.image;
        (hero.image === '') ? hero.image = tmpHero.image : '';
        (req.body.remove_image == 'true') ? hero.image = '' : '';

        req.body.emblem_image === undefined ? hero.description.notes.organization.emblem = tmpHero.description.notes.organization.emblem : hero.description.notes.organization.emblem = req.body.emblem_image;
        (hero.description.notes.organization.emblem === '') ? hero.description.notes.organization.emblem = tmpHero.description.notes.organization.emblem : '';
        (req.body.remove_emblem == 'true') ? hero.description.notes.organization.emblem = '' : '';

        if(req.body.deletecharacter) {
            const user = await User.findOne({ characters: heroId });
            user.characters.forEach((character, idx) => {
                if(character.toString() == heroId) user.characters.splice(idx, 1);
            });
            await Promise.all([User.findByIdAndUpdate(user._id, user, { new: true }), Hero.findByIdAndRemove(heroId)]);
            req.body.admin != 'true'
                ? res.redirect(`/users/heroes`)
                : res.redirect(`/admin/heroes`);
        } else {
            await Hero.findByIdAndUpdate(oldHero._id, hero, { new: true });
            req.body.admin != 'true'
                ? res.redirect(`/users/heroes`)
                : res.redirect(`/admin/heroes`);
        }
    } catch(error) {
        next(error);
    }
};

// Spells
/**
 * Responds with SideQuest DnD's spells compendium page
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.spells = async (req, res, next) => {
    try {
        const spells = await Spell.aggregate([ { $sort: { level: 1, name: 1 } } ]);
        
        const spellsQuery = [];

        for(let i = 0; i < 10; i++) {
            const level = Spell.aggregate([
                { $match: { level: i } },
                { $sort: { name: 1 } }
            ]);
            spellsQuery.push(level);
        }

        const sortedSpells = await Promise.all(spellsQuery.map(level => level));

        res.render('users/spells', { title: `${res.locals.siteAlias} - Spell Compendium`, spells, sortedSpells });
    } catch(error) {
        next(error);
    }
};

/**
 * Saves a spell for SideQuest DnD's spell compendium.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.saveSpellPost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const spell = new Spell(req.body);
        await spell.save();
        res.redirect(`/users/spells`);
    } catch(error) {
        next(error);
    }
};

/**
 * Updates a spell for SideQuest DnD.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.editSpellPost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const spell = await Spell.findOne({ _id: req.body.spell_id });
        await Spell.findByIdAndUpdate(spell._id, req.body, { new: true });
        res.redirect(`/users/spells`);
    } catch(error) {
        next(error);
    }
};

/**
 * Responds with a SideQuest DnD's spell.
 * 
 * @async
 * @param {Array<object>} validationErrors - Array with validation error objects
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.spellsSearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            htmlText = `
            <h2>Please fix the following errors:</h2>
            <ul>
                <li>Search queries must be at most 250 characters long.</li>
            </ul>
            `;
            res.send([htmlText])
            return;
        }

        const searchQuery = req.query;
        
        const pug = require('pug');
        const path = require('path');
        if(searchQuery.name != '' || searchQuery.level != '' || searchQuery.school != '') {
            var level = '';
            const cantripRegex = /.*([cantrip]{2,})\w+.*|(.)*0/gi;
            
            if(searchQuery.level != '') {
                if(searchQuery.level.length > 100) searchQuery.level = searchQuery.level.substring(0,101);
                if(cantripRegex.test(searchQuery.level)){ level = 0; }
                else if(searchQuery.level.includes('1')) { level = 1; }
                else if(searchQuery.level.includes('2')) { level = 2; }
                else if(searchQuery.level.includes('3')) { level = 3; }
                else if(searchQuery.level.includes('4')) { level = 4; }
                else if(searchQuery.level.includes('5')) { level = 5; }
                else if(searchQuery.level.includes('6')) { level = 6; }
                else if(searchQuery.level.includes('7')) { level = 7; }
                else if(searchQuery.level.includes('8')) { level = 8; }
                else if(searchQuery.level.includes('9')) { level = 9; }
                else { level = '' };
            }
            let searchData = await Promise.all([
                Spell.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]),
                Spell.aggregate([ { $match: { level: level } } ]),
                Spell.aggregate([ { $match: { $text: { $search: searchQuery.school } } } ]),
            ]);

            searchData = searchData[0].concat(searchData[1], searchData[2]);

            const spells = Array.from(new Set(searchData.map(character => character._id.toString()))).map(id => {
                return searchData.find(spell => spell._id.toString() == id)
            });

            const rows = spells.map(spell => {
                const tmpfilename = path.join(__dirname, '../views/mixins/tmp.pug');
                const options = { filename: tmpfilename, spell: spell }
                const html = pug.render('include _spell_row\n+spellRow(spell)', options);
                return html;
            });
            
            res.send(rows);
        } else {
            const searchData = await Spell.aggregate([{$sort:{level:1, name:1}}]);
            // Function takes too long to load (3s-5s)
            // console.time('pugfunction')
            const rows = searchData.map(spell => {
                const tmpfilename = path.join(__dirname, '../views/mixins/tmp.pug');
                const options = { filename: tmpfilename, spell: spell }
                const html = pug.render('include _spell_row\n+spellRow(spell)', options);
                return html;
            });
            // console.timeEnd('pugfunction')

            res.send(rows);
        }
    } catch(error) {
        next(error);
    }
};

// Edit Story
/**
 * Search a story in SideQuest DnD's campaign page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.story = async (req, res, next) => {
    try {
        const username = req.user.username;
        const stories = await Story.aggregate([ { $sort: { name: -1 } } ]);
        res.render('users/story', { title: `${res.locals.siteAlias} - Editar Historia`, username, stories });
    } catch(error) {
        next(error);
    }
};

/**
 * Search a story in SideQuest DnD's campaign page.
 * 
 * @async
 * @param {Array<object>} validationErrors - Array with validation error objects
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.storySearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const username = req.user.username;
            const stories = await Story.aggregate([ { $sort: { name: -1 } } ]);
            res.render('users/story', { title: `${res.locals.siteAlias} - Editar Historia`, username, stories, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const searchQuery = req.body;
        const stories = await Story.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);
        
        res.render('users/story', { title: `${res.locals.siteAlias} - Editar Historia: Búsqueda`, username, stories });
    } catch(error) {
        next(error);
    }
};

/**
 * Responds with a SideQuest DnD's campaign new story page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.newStoryGet = async (req, res, next) => {
    try {
        const username = req.user.username;
        res.render('users/story', { title: `${res.locals.siteAlias}: Nueva Historia`, username });
    } catch(error) {
        next(error);
    }
};

/**
 * Creates a new SideQuest DnD campaign story.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.newStoryPost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const story = new Story(req.body);

        await story.save();
        res.redirect(`/users/story`);
    } catch(error) {
        next(error);
    }
};

/**
 * Responds with a SideQuest DnD's specific campaign story page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.editStoryGet = async (req, res, next) => {
    try {
        const username = req.user.username;
        const story = await Story.findOne({ _id: req.params.storyId });

        res.render('users/story', { title: `${res.locals.siteAlias} - Editar Historia`, username, story });
    } catch(error) {
        next(error);
    }
};

/**
 * Updates a specific campaign story.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.editStoryPost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const storyId = req.params.storyId;

        if(req.body.deletestory != 'true') {
            await Story.findByIdAndUpdate(storyId, req.body, { new: true });
            res.redirect(`/users/story/edit/${storyId}`);
        } else {
            await Story.findByIdAndRemove(storyId);
            res.redirect(`/users/story`);
        }
    } catch(error) {
        next(error);
    }
};

// Edit Characters
/**
 * Responds with SideQuest DnD's NPC character page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.characters = async (req, res, next) => {
    try {
        const username = req.user.username;
        const characters = await Character.aggregate([ { $sort: { name: 1 } } ]);

        res.render('users/characters', { title: `${res.locals.siteAlias} - Editar Personajes`, username, characters });
    } catch(error) {
        next(error);
    }
};

/**
 * Search character in NPC info page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.charactersSearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const username = req.user.username;
            const characters = await Character.aggregate([ { $sort: { name: 1 } } ]);
            res.render('users/characters', { title: `${res.locals.siteAlias} - Editar Personajes`, username, characters, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const searchQuery = req.body;
        let searchData = await Promise.all([
            Character.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]),
            Character.aggregate([ { $match: { $text: { $search: searchQuery.relationship } } } ]),
            Character.aggregate([ { $match: { $text: { $search: searchQuery.place } } } ]),
            Character.aggregate([ { $match: { $text: { $search: searchQuery.race } } } ])
        ]);

        searchData = searchData[0].concat(searchData[1], searchData[2], searchData[3]);

        const characters = Array.from(new Set(searchData.map(character => character._id.toString()))).map(id => {
            return searchData.find(character => character._id.toString() == id)
        });
        
        res.render('users/characters', { title: `${res.locals.siteAlias} - Editar Personajes: Búsqueda`, username, characters });
    } catch(error) {
        next(error);
    }
};

/**
 * Responds with SideQuest DnD's new NPC character page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.newCharacterGet = async (req, res, next) => {
    try {
        res.render('users/characters', { title: `${res.locals.siteAlias} - Personaje Nuevo` })
    } catch(error) {
        next(error);
    }
};

/**
 * Creates a new NPC character. 
 * 
 * @async
 * @param {Array<object>} validationErrors - Array with validation error objects
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.newCharacterPost = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            res.render('users/characters', { title: `${res.locals.siteAlias} - Personaje Nuevo`, errors: validationErrors })
            return;
        }

        const username = req.user.username;
        const character = new Character(req.body);

        await character.save();
        res.redirect(`/users/characters`);
    } catch(error) {
        next(error);
    }
};

/**
 * Responds with SideQuest DnD's edit NPC character page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.editCharacterGet = async (req, res, next) => {
    try {
        const characterId = req.params.characterId;
        const character = await Character.findOne({ _id: characterId });

        res.render('users/characters', { title: `${res.locals.siteAlias} - Editar a ${character.name}`, character });
    } catch(error) {
        next(error);
    }
};

/**
 * Updates a specific NPC character.
 * 
 * @async
 * @param {Array<object>} validationErrors - Array with validation error objects
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.editCharacterPost = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const characterId = req.params.characterId;
            const character = await Character.findOne({ _id: characterId });
            res.render('users/characters', { title: `${res.locals.siteAlias} - Editar a ${character.name}`, character, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const characterId = req.params.characterId;

        if(req.body.deletecharacter == 'true') {
            await Character.findByIdAndRemove(characterId);
            res.redirect(`/users/characters`);
        } else {
            await Character.findByIdAndUpdate(characterId, req.body, { new: true });
            res.redirect(`/users/characters/edit/${characterId}`);
        }
    } catch(error) {
        next(error);
    }
};

// Edit Maps
/**
 * Responds with SideQuest DnD's campaign maps page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.maps = async (req, res, next) => {
    try {
        const username = req.user.username;
        const maps = await Map.aggregate([{ $sort: { name: 1 } }]);

        res.render('users/maps', { title: `${res.locals.siteAlias} - Editar Mapas`, username, maps });
    } catch(error) {
        next(error);
    }
};

/**
 * Search a map on the maps page.
 * 
 * @async
 * @param {Array<object>} validationErrors - Array with validation error objects
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.mapsSearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const username = req.user.username;
            const maps = await Map.aggregate([ { $sort: { name: 1 } } ]);
            res.render('users/maps', { title: `${res.locals.siteAlias} - Editar Mapas`, username, maps, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const searchQuery = req.body;
        const maps = await Map.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);

        res.render('users/maps', { title: `${res.locals.siteAlias} - Editar Mapas: Búsqueda`, username, maps });
    } catch(error) {
        next(error);
    }
};

/**
 * Responds with SideQuest DnD's new maps page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.newMapGet = async (req, res, next) => {
    try {
        const username = req.user.username;
        res.render('users/maps', { title: `${res.locals.siteAlias} - Mapa Nuevo` });
    } catch(error) {
        next(error);
    }
};

/**
 * Create a new map.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.newMapPost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const map = new Map(req.body);
        
        await map.save();
        res.redirect(`/users/maps`);
    } catch(error) {
        next(error);
    }
};

/**
 * Responds with SideQuest DnD's edit map page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.editMapGet = async (req, res, next) => {
    try {
        const username = req.user.username;
        const mapId = req.params.mapId;
        const map = await Map.findOne({ _id: mapId });

        res.render('users/maps', { title: `${res.locals.siteAlias} - Editar Mapa`, username, map });
    } catch(error) {
        next(error);
    }
};

/**
 * Edit a specific campaign map.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.editMapPost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const mapId = req.params.mapId;

        if(req.body.deletemap == 'true') {
            await Map.findByIdAndRemove(mapId);
            res.redirect(`/users/maps`);
        } else {
            await Map.findByIdAndUpdate(mapId, req.body, { new: true });
            res.redirect(`/users/maps/edit/${mapId}`);
        }
    } catch(error) {
        next(error);
    }
};
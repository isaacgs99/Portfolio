/**
 * indexController.js is the main driver for all the routes within "routes/index.js", prefixed by "/".
 * @module indexController
 */

// Require models
const Hero = require('../models/hero');
const Story = require('../models/story');
const Character = require('../models/character');
const Announcements = require('../models/announcement');
const Comment = require('../models/comment');
const Map = require('../models/map');

// Require middleware for documentation
const e = require('express');

// Index
/**
 * Responds with SideQuest DnD's home page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.index = async (req, res, next) => {
    try {
        const announcements = await Announcements.find();

        // Sort announcements from newest to oldest
        announcements.sort((a, b) => {
            var keyA = new Date(a.date);
            var keyB = new Date(b.date);

            if(keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
        });

        res.render('index', { title: `${res.locals.siteName} - Inicio`, announcements });
    } catch(error) {
        next(error);
    }
}

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
    try{
        const heroes = await Hero.aggregate([ { $sort: { name: 1 } } ]);
        res.render('heroes', { title: `${res.locals.siteAlias} - Heroes`, heroes });
    } catch(error) {
        next(error);
    }
};


/**
 * Responds with SideQuest DnD's hero information page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.heroSummary = async (req, res, next) => {
    try{
        const heroName = req.params.heroName;
        const heroes = await Hero.find();
        const hero = await Hero.aggregate([
            { $match: { name: heroName } },
            { $lookup: {
                from: 'races',
                localField: 'race',
                foreignField: '_id',
                as: 'race'
            } },
            { $lookup: {
                from: 'classes',
                localField: 'class',
                foreignField: '_id',
                as: 'class'
            } }
        ]).then(res => res[0]);
        hero.race = hero.race[0];
        hero.class = hero.class[0];

        const getHeroSpells = await Hero.aggregate([
            { $match: { name: heroName } },
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

        /**
         * First sorts spells from unsorted array by level, and then sorts spells for each level alphabetically.
         * 
         * @param {Array<object>} unsortedArray 
         * @returns Spells sorted by alphabetically by level in an object.
         */
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

        const heroSpells = {racial: racialSpells, class: classSpells};

        res.render('heroes', { title: `${res.locals.siteAlias} - ${heroName}`, heroes, hero, heroSpells });
    } catch(error) {
        next(error);
    }
};

// Story
/**
 * Responds with SideQuest DnD's hero information page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.story = async (req, res, next) => {
    try {
        const storyId = req.params.storyId;

        const storiesQuery = Story.aggregate([ { $sort: { name: -1 } } ]);
        const storyQuery = Story.findOne({ _id: storyId });
        const [stories, story] = await Promise.all([storiesQuery, storyQuery]);


        const title = res.locals.url.endsWith('/story') ? 'Historia' : `Historia: ${story.name}`;
        res.render('story', { title: `${res.locals.siteAlias} - ${title}`, stories, story })
    } catch(error) {
        next(error);
    }
};

/**
 * Search story in stories page.
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
            const stories = await Story.aggregate([ { $sort: { name: -1 } } ]);
            res.render('story', { title: `${res.locals.siteAlias} - Historia`, stories, errors: validationErrors });
            return;
        }

        const searchQuery = req.body;
        const stories = await Story.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);
        
        res.render('story', { title: `${res.locals.siteAlias} - Historia: Búsqueda`, stories });
    } catch(error) {
        next(error);
    }
};

// Characters
/**
 * Responds with SideQuest DnD's NPC characters page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.characters = async (req, res, next) => {
    try {
        const charactersQuery = Character.aggregate([
            { $sort: { name: 1 } }
        ]);
        const characterQuery = Character.findOne({ name: req.params.characterName });
        const [characters, character] = await Promise.all([charactersQuery, characterQuery]);

        const title = res.locals.url.endsWith('/characters') ? 'Personajes' : `Personajes: ${character.name}`
        res.render('characters', { title: `${res.locals.siteAlias} - ${title}`, characters, character });
    } catch(error) {
        next(error);
    }
};

/**
 * Creates comments for all routes that allow for comments.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.addCommentPost = async (req, res, next) => {
    try {
        if(res.locals.url.includes('/characters/')) {
            if(req.body.text.trim() != undefined && req.body.text.trim() != '') {
                const character = await Character.findOne({ name: req.params.characterName });
                const comment = new Comment(req.body);
                character.comments.push(comment);
                await Character.findByIdAndUpdate(character._id, character, { new: true });
                res.redirect(`/characters/${req.params.characterName}`);
            } else {
                res.redirect(`/characters/${req.params.characterName}`);
            }
        } else if(res.locals.url.includes('/story/')) {
            if(req.body.text.trim() != undefined && req.body.text.trim() != '') {
                const story = await Story.findOne({ _id: req.params.storyId });
                const comment = new Comment(req.body);
                story.comments.push(comment);
                await Story.findByIdAndUpdate(story._id, story, { new: true });
                res.redirect(`/story/${story._id}`);
            } else {
                res.redirect(`/story/${req.params.storyId}`);
            }
        } else if(res.locals.url.includes('/maps/')) {
            if(req.body.text.trim() != undefined && req.body.text.trim() != '') {
                const map = await Map.findOne({ _id: req.params.mapId });
                const comment = new Comment(req.body);
                map.comments.push(comment);
                await Map.findByIdAndUpdate(map._id, map, { new: true });
                res.redirect(`/maps/${map._id}`);
            } else {
                res.redirect(`/maps/${req.params.mapId}`);
            }
        }
    } catch(error) {
        next(error);
    }
};

/**
 * Deletes comments for all routes that allow for comments.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.deleteCommentPost = async (req, res, next) => {
    try {
        const commentId = req.params.commentId;
        if(res.locals.url.includes('/characters/')) {
            const character = await Character.findOne({ name: req.params.characterName });
            const commentIndex = character.comments.findIndex(comment => comment._id.toString() == commentId);
            character.comments.splice(commentIndex, 1)
            await Character.findByIdAndUpdate(character._id, character, { new: true });
            res.redirect(`/characters/${req.params.characterName}`);
        } else if(res.locals.url.includes('/story/')) {
            const story = await Story.findOne({ _id: req.params.storyId });
            const commentIndex = story.comments.findIndex(comment => comment._id.toString() == commentId);
            story.comments.splice(commentIndex, 1);
            await Story.findByIdAndUpdate(story._id, story, { new: true });
            res.redirect(`/story/${story._id}`);
        } else if(res.locals.url.includes('/maps/')) {
            const map = await Map.findOne({ _id: req.params.mapId });
            const commentIndex = map.comments.findIndex(comment => comment._id.toString() == commentId);
            map.comments.splice(commentIndex, 1);
            await Map.findByIdAndUpdate(map._id, map, { new: true });
            res.redirect(`/maps/${map._id}`);
        }
    } catch(error) {
        next(error);
    }
};

/**
 * Search character in NPC info page.
 * 
 * @async
 * @param {Array<object>} validationErrors - Array with validation error objects
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.charactersSearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const characters = await Character.aggregate([ { $sort: { name: 1 } } ]);
            res.render('characters', { title: `${res.locals.siteAlias} - Personajes`, characters, errors: validationErrors });
            return;
        }

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
        
        res.render('characters', { title: `${res.locals.siteAlias} - Personajes: Búsqueda`, characters });
    } catch(error) {
        next(error);
    }
};

// Maps
/**
 * Responds with SideQuest DnD's maps page.
 * 
 * @async
 * @param {e.Request} req - Express Request Object
 * @param {e.Response} res - Express Response Object
 * @param {e.NextFunction} next - Express Next Function
 */
exports.maps = async (req, res, next) => {
    try {
        const mapsQuery = await Map.aggregate([{ $sort: { name: 1 } }]);
        const mapQuery = await Map.findOne({ _id: req.params.mapId });
        const [maps, map] = await Promise.all([mapsQuery, mapQuery]);

        const title = res.locals.url.endsWith('/maps') ? 'Lugares' : `Lugares: ${map.name}`
        res.render('maps', { title: `${res.locals.siteAlias} - ${title}`, maps, map });
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
            const maps = await Map.aggregate([ { $sort: { name: 1 } } ]);
            res.render('maps', { title: `${res.locals.siteAlias} - Lugares`, maps, errors: validationErrors });
            return;
        }

        const searchQuery = req.body;
        const maps = await Map.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);

        res.render('maps', { title: `${res.locals.siteAlias} - Lugares: Búsqueda`, maps });
    } catch(error) {
        next(error);
    }
};
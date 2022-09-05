// Require Models
const Hero = require('../models/hero');
const Character = require('../models/character');
const Spell = require('../models/spell');
const Note = require('../models/note');

// DM Account View
exports.dmView = (req, res) => {
    const username = req.user.username;
    res.render('dm/account_view', { title: `${res.locals.siteAlias} - Dungeon Master`, username });
};

// Notes
exports.notes = async (req, res, next) => {
    try {
        const username = req.user.username;

        if(res.locals.url.endsWith('/notes')) {
            const notes = await Note.aggregate([ { $sort: { date: -1 } } ]);
            res.render('dm/notes', { title: `${res.locals.siteAlias} DM - Notas`, username, notes });
        } else {
            const tmpHeroes = await Hero.find();
            const heroesArray = [];
            tmpHeroes.forEach(hero => {
                hero = Hero.aggregate([
                    { $match: { _id: hero._id } },
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
                heroesArray.push(hero);
            });
            
            const heroesQuery = Promise.all(heroesArray);
            const [heroes, characters, spells] = await Promise.all([heroesQuery, Character.aggregate([{ $sort: { name: 1 } }]), Spell.aggregate([{ $sort:{ level:1, name: 1 } }])]);
            heroes.forEach(hero => {
                hero.race = hero.race[0];
                hero.class = hero.class[0];
            });

            if(res.locals.url.includes('/view/')) {
                const note = await Note.findOne({ _id: req.params.noteId });
                res.render('dm/notes', { title: `${res.locals.siteAlias} DM - Notas`, username, note, heroes, characters, spells });
            } else {
                res.render('dm/notes', { title: `${res.locals.siteAlias} DM - Nota Nueva`, username, heroes, characters, spells });
            }
        }
    } catch(error) {
        next(error);
    }
};

exports.notesSpellSearch = async (validationErrors, req, res, next) => {
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
        if(searchQuery.name != '') {
            const searchData = await Spell.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);

            const rows = searchData.map(spell => {
                const tmpfilename = path.join(__dirname, '../views/mixins/tmp.pug');
                const options = { filename: tmpfilename, spell: spell }
                const html = pug.render('include _spell_row\n+spellRow(spell, { dm: true })', options);
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
                const html = pug.render('include _spell_row\n+spellRow(spell, { dm: true })', options);
                return html;
            });
            // console.timeEnd('pugfunction')

            res.send(rows);
        }
    } catch(error) {
        next(error);
    }
};

exports.notesCharsSearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            htmlText = `
            <h2>Please fix the following errors:</h2>
            <ul>
                <li>Search queries must be at most 250 characters long.</li>
            </ul>
            `;
            res.send({errors: htmlText})
            return;
        }

        const searchQuery = req.query;
        
        const pug = require('pug');
        const path = require('path');
        if(searchQuery.name != '') {
            const searchData = await Character.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);

            const dropdowns = searchData.map(character => {
                const tmpfilename = path.join(__dirname, '../views/mixins/tmp.pug');
                const options = { filename: tmpfilename, character: character }
                const html = pug.render('include _hero_dropdown\n+heroDropdown(character, \'character\')', options);
                return html;
            });
            
            res.send({characters: searchData, dropdowns: dropdowns});
        } else {
            const searchData = await Character.aggregate([{$sort:{name:1}}]);
            
            // Function takes too long to load (3s-5s)
            // console.time('pugfunction')
            const dropdowns = searchData.map(character => {
                const tmpfilename = path.join(__dirname, '../views/mixins/tmp.pug');
                const options = { filename: tmpfilename, character: character }
                const html = pug.render('include _hero_dropdown\n+heroDropdown(character, \'character\')', options);
                return html;
            });
            // console.timeEnd('pugfunction')

            res.send({characters: searchData, dropdowns: dropdowns});
        }
    } catch(error) {
        next(error);
    }
};

exports.notesSearch = async (validationErrors, req, res, next) => {
    try {
        if(validationErrors.length > 0) {
            const username = req.user.username;
            const notes = await Note.aggregate([ { $sort: { date: -1 } } ]);
            res.render('dm/notes', { title: `${res.locals.siteAlias} DM - Notas`, username, notes, errors: validationErrors });
            return;
        }

        const username = req.user.username;
        const searchQuery = req.body;
        const notes = await Note.aggregate([ { $match: { $text: { $search: searchQuery.name } } } ]);
        
        res.render('dm/notes', { title: `${res.locals.siteAlias} DM - Notas: Búsqueda`, username, notes });
    } catch(error) {
        next(error);
    }
};

exports.newNotePost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const note = new Note(req.body);
        
        await note.save();
        res.redirect(`/dm/notes`);
    } catch(error) {
        next(error);
    }
};

exports.editNoteGet = async (req, res, next) => {
    try {
        const username = req.user.username;
        const noteId = req.params.noteId;

        const tmpHeroes = await Hero.find();
        const heroesArray = [];
        tmpHeroes.forEach(hero => {
            hero = Hero.aggregate([
                { $match: { _id: hero._id } },
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
            heroesArray.push(hero);
        });
        
        const heroesQuery = Promise.all(heroesArray);
        const [note, heroes, characters, spells] = await Promise.all([Note.findOne({ _id: noteId }), heroesQuery, Character.aggregate([{ $sort: { name: 1 } }]), Spell.aggregate([{ $sort:{ level:1, name: 1 } }])]);
        heroes.forEach(hero => {
            hero.race = hero.race[0];
            hero.class = hero.class[0];
        });

        res.render('dm/notes', { title: `${res.locals.siteAlias} DM - Editar Nota`, username, note, heroes, characters, spells });
    } catch(error) {
        next(error);
    }
};

exports.editNotePost = async (req, res, next) => {
    try {
        const username = req.user.username;
        const noteId = req.params.noteId;

        if(req.body.deletenote != 'true') {
            await Note.findByIdAndUpdate(noteId, req.body, { new: true });
            res.redirect(`/dm/notes/edit/${noteId}`);
        } else {
            await Note.findByIdAndRemove(noteId);
            res.redirect(`/dm/notes`);
        }
    } catch(error) {
        next(error);
    }
};
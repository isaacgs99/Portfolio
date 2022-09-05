var express = require('express');
var router = express.Router();

/* Require controller modules */
const userController = require('../controllers/userController');
const validatorController = require('../controllers/validatorController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  req.isAuthenticated()
    // ? res.send('respond with a resource - '+req.user.username)
    ? res.redirect(`/users/account`)
    : res.redirect('/login');
});

/* Account View Routes */
router.get('/*', userController.isAuth);
router.get('/account', userController.accountView);
router.post('/account', userController.accountViewPost);

// Hero
router.get('/heroes', userController.heroes);
router.get('/heroes/newHero', userController.newHeroGet);
router.post('/heroes/newHero', 
  userController.upload,
  userController.pushToCloudinary,
  validatorController.heroVS,
  userController.newHeroPost
);

router.get('/heroes/:heroId', userController.newHeroGet);
router.post('/heroes/:heroId', 
  userController.upload,
  userController.pushToCloudinary,
  validatorController.heroVS,
  userController.editHeroPost
);

// Spells
router.get('/spells', userController.spells);
router.post('/savespell', validatorController.sanitize, userController.saveSpellPost);
router.post('/editSpell', validatorController.sanitize, userController.editSpellPost);
router.get('/spells/search', validatorController.searchVS, userController.spellsSearch);

// Story
router.get('/story', userController.story);
router.post('/story/search', validatorController.searchVS, userController.storySearch);
router.get('/story/newstory', userController.newStoryGet);
router.post('/story/newstory', validatorController.nameSanitizer, userController.newStoryPost);
router.get('/story/edit/:storyId', userController.editStoryGet);
router.post('/story/edit/:storyId', validatorController.nameSanitizer, userController.editStoryPost);

// Characters
router.get('/characters', userController.characters);
router.post('/characters/search', validatorController.searchVS, userController.charactersSearch);
router.get('/characters/newcharacter', userController.newCharacterGet);
router.post('/characters/newcharacter',
  userController.upload,
  userController.pushToCloudinary,
  validatorController.characterVS,
  userController.newCharacterPost
);
router.get('/characters/edit/:characterId', userController.editCharacterGet);
router.post('/characters/edit/:characterId',
  userController.upload,
  userController.pushToCloudinary,
  validatorController.characterVS,
  userController.editCharacterPost
);

// Maps
router.get('/maps', userController.maps);
router.post('/maps/search', validatorController.searchVS, userController.mapsSearch);
router.get('/maps/newmap', userController.newMapGet);
router.post('/maps/newmap', 
  userController.upload,
  userController.pushToCloudinary,
  validatorController.nameSanitizer,
  userController.newMapPost);
router.get('/maps/edit/:mapId', userController.editMapGet);
router.post('/maps/edit/:mapId', 
  userController.upload,
  userController.pushToCloudinary,
  validatorController.nameSanitizer,
  userController.editMapPost);

// FETCH DnD5eAPI Spells
// const fetch = require('node-fetch');
// const Spell = require('../models/spell');
// router.get('/importspells', async (req, res, next) => {
//   try {
//     const data = await fetch('https://www.dnd5eapi.co/api/spells')
//       .then(resp => resp.json())
//       .catch(err => next(err));
    
//     const spellIdxList = data.results.map(result => result.index);

//     const spellPromises = spellIdxList.map(spellIdx => {
//       const spellData = fetch(`https://www.dnd5eapi.co/api/spells/${spellIdx}`)
//         .then(resp => resp.json())
//         .catch(err => next(err));
//       return spellData;
//     });

//     const spellsAPI = await Promise.all(spellPromises);

//     const spells = spellsAPI.map(async spell => {
//       const spellModel = new Spell(spell);
//       spellModel.school = spell.school.name;
//       spellModel.materials = spell.material;
//       spellModel.description = spell.desc.join('\n');
//       if(spell.higher_level) spellModel.description += '\nAt Higher Levels:\n' + spell.higher_level;
//       await spellModel.save()
//     });

//     // res.json(spells)
//     res.send('done')
//   } catch(error) {
//     next(error);
//   }
// });

module.exports = router;
var express = require('express');
var router = express.Router();

// Require controller modules
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const validatorController = require('../controllers/validatorController');

/* GET admin listing */
router.get('/', function(req, res, next) {
    req.isAuthenticated()
      ? res.redirect(`/admin/account`)
      : res.redirect('/users');
});
router.get('/*',  userController.isAdmin);
router.get('/account', adminController.adminView);

// Users Edit and Delete
router.get('/users', adminController.users);
router.get('/users/:userId', adminController.editUserGet);
router.post('/users/:userId', adminController.editUserPost);

// Announcements
router.get('/announcements', adminController.announcements);
router.post('/announcements/search', validatorController.searchVS, adminController.announcementsSearch);
router.get('/announcements/newannouncement', adminController.announcements);
router.post('/announcements/newannouncement', validatorController.nameSanitizer, adminController.newAnnouncementPost);
router.get('/announcements/edit/:announcementId', adminController.editAnnouncementGet);
router.post('/announcements/edit/:announcementId', validatorController.nameSanitizer, adminController.editAnnouncementPost);

// Heroes Edit and Delete
router.get('/heroes', adminController.heroes);
router.get('/heroes/:heroId', userController.newHeroGet);

// Races CURD
router.get('/races', adminController.races);
router.post('/races/search', validatorController.searchVS, adminController.racesSearch);
router.get('/races/newrace', adminController.races);
router.post('/races/newrace', validatorController.raceVS, adminController.newRacePost);
router.get('/races/edit/:raceId', adminController.editRaceGet);
router.post('/races/edit/:raceId', validatorController.raceVS, adminController.editRacePost);

// Classes CURD
router.get('/classes', adminController.classes);
router.post('/classes/search', validatorController.searchVS, adminController.classesSearch);
router.get('/classes/newclass', adminController.classes);
router.post('/classes/newclass', validatorController.classVS, adminController.newClassPost);
router.get('/classes/edit/:classId', adminController.editClassGet);
router.post('/classes/edit/:classId', validatorController.classVS, adminController.editClassPost);

module.exports = router;
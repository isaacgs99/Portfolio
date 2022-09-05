var express = require('express');
var router = express.Router();

// Require controller modules
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const dmController = require('../controllers/dmController');
const validatorController = require('../controllers/validatorController');

/* GET admin listing */
router.get('/', function(req, res, next) {
    req.isAuthenticated()
      ? res.redirect(`/dm/account`)
      : res.redirect('/users');
});
router.get('/*',  userController.isDM);
router.get('/account', dmController.dmView);

// Announcements
router.get('/announcements', adminController.announcements);
router.post('/announcements/search', validatorController.searchVS, adminController.announcementsSearch);
router.get('/announcements/newannouncement', adminController.announcements);
router.post('/announcements/newannouncement', validatorController.nameSanitizer, adminController.newAnnouncementPost);
router.get('/announcements/edit/:announcementId', adminController.editAnnouncementGet);
router.post('/announcements/edit/:announcementId', validatorController.nameSanitizer, adminController.editAnnouncementPost);

// Notes
router.get('/notes', dmController.notes);
router.post('/notes/search', validatorController.searchVS, dmController.notesSearch);
router.get('/notes/newnote', dmController.notes);
router.get('/notes/spellsearch', validatorController.searchVS, dmController.notesSpellSearch);
router.get('/notes/charactersearch', validatorController.searchVS, dmController.notesCharsSearch);
router.post('/notes/newnote', validatorController.nameSanitizer, dmController.newNotePost);
router.get('/notes/view/:noteId', dmController.notes);
router.get('/notes/edit/:noteId', dmController.editNoteGet);
router.post('/notes/edit/:noteId', validatorController.nameSanitizer, dmController.editNotePost);

module.exports = router;
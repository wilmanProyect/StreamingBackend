const express = require('express');
const { upload } = require('../controller/uploadController');
const { createSeries, getAllSeries, getSeriesById, addEpisode, getEpisodesBySeries  } = require('../controller/seriesController');
const { protect, admin, creator } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/series/:id', protect, getSeriesById);
router.get('/series', protect, getAllSeries);
router.post('/series', protect, upload.single('portada'), createSeries);
router.post('/series/:id/episodes', protect, admin,  upload.single('video'), addEpisode);
router.get('/series/:id/episodes', protect, getEpisodesBySeries);
module.exports = router;

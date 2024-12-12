const express = require('express');
const { upload } = require('../controller/uploadController');
const { 
    createSeries, 
    getAllSeries, 
    getSeriesById, 
    addEpisode, 
    getEpisodesBySeries, 
    updateSeries,
    deleteSeries,
    updateEpisode,
    deleteEpisode,
    searchSeriesByTitle 
} = require('../controller/seriesController');
const { protect, admin, creator, role, isPremium } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/series/:id', protect, getSeriesById);
router.get('/series', protect, getAllSeries);
router.get('/series/:id/episodes', protect, getEpisodesBySeries);
router.get('/series/search', protect, searchSeriesByTitle);

router.post('/series', protect, creator, upload.single('portada'), createSeries);
router.post('/series/:id/episodes', protect,creator,  upload.single('video'), addEpisode);

router.put('/series/:id', protect, role('admin', 'creator'), upload.single('portada'), updateSeries);
router.put('/series/:id/episodes/:episodeId', protect, role('admin', 'creator'), upload.single('video'), updateEpisode);


router.delete('/series/:id', protect, role('admin', 'creator'), deleteSeries);
router.delete('/series/:id/episodes/:episodeId', protect, role('admin', 'creator'), deleteEpisode);

module.exports = router;

const express = require('express');
const { upload } = require('../controller/uploadController');
const { 
    createSeries, 
    getAllSeries, 
    addEpisode, 
    getEpisodesBySeries, 
    updateSeries,
    deleteSeries,
    updateEpisode,
    deleteEpisode,
    searchSeriesByTitle,
    getMovies,
    getContentByCreator
} = require('../controller/seriesController');
const { protect, role, isPremium } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/series', protect, getAllSeries);
router.get('/series/:id/episodes', protect, getEpisodesBySeries);
router.get('/series/title',protect, searchSeriesByTitle);
router.get('/movies', protect, getMovies);
router.get('/creator/:id/content', protect, getContentByCreator);

router.post('/series', protect, role('creator'), upload.single('portada'), createSeries);
router.post('/series/:id/episodes', protect,role('creator'),  upload.single('video'), addEpisode);

router.put('/series/:id', protect, role('admin', 'creator'), upload.single('portada'), updateSeries);
router.put('/series/:id/episodes/:episodeId', protect, role('admin', 'creator'), upload.single('video'), updateEpisode);


router.delete('/series/:id', protect, role('admin', 'creator'), deleteSeries);
router.delete('/series/:id/episodes/:episodeId', protect, role('admin', 'creator'), deleteEpisode);

module.exports = router;

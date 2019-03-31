const express = require('express');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();
const IndexController = require('../controllers/IndexController');

// Get home page
router.get('/', IndexController.index);

// Watermark image
router.get('/watermark/:imageName/:text', IndexController.watermark);

// Upload file
router.post('/upload', upload.single('file'), IndexController.upload);

module.exports = router;

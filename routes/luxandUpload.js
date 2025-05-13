const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const url = "https://api.luxand.cloud/photo/detect";
const luxandApiKey = process.env.LUXAND_API_KEY;

router.post('/',upload.single('image'), async (req, res) => {
    const file = req.file;
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    console.log('File received:', file.mimetype);
    const form = new FormData();
    form.append('photo', file.buffer, {
        filename: String(file.originalname || 'upload.png'),
        contentType: String(file.mimetype || 'application/octet-stream'),
        knownLength: Number(file.size || 0),
      });
    if (!luxandApiKey) {
        console.error('LUXAND_API_KEY is not set');
        return res.status(500).json({ error: 'LUXAND_API_KEY is not set' });
    }
    form.append('token', luxandApiKey);
    try {
        const response = await axios.post(url, form, {
            headers: {
                ...form.getHeaders(),
                'Content-Length': form.getLengthSync(),
            },
            maxContentLength:Infinity,
            maxBodyLength:Infinity,
        });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Error uploading file' });
    }
    console.log('File upload and API call completed');
});

module.exports = {
    router,
    routeName: 'luxandUpload',
    path: '/luxandUpload',
}
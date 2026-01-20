const express = require('express');
const router = express.Router();
const axios = require('axios');

// The compiler service URL (running on Docker/Port 8000)
const COMPILER_SERVICE_URL = process.env.COMPILER_SERVICE_URL || 'http://localhost:8000';

// Proxy /run
router.post('/run', async (req, res) => {
    try {
        const response = await axios.post(`${COMPILER_SERVICE_URL}/run`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Compiler Service Unreachable" });
    }
});

// Proxy /ai-review
router.post('/ai-review', async (req, res) => {
    try {
        const response = await axios.post(`${COMPILER_SERVICE_URL}/ai-review`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "AI Review Service Unreachable" });
    }
});

// Proxy /genieExplain
router.post('/genieExplain', async (req, res) => {
    try {
        const response = await axios.post(`${COMPILER_SERVICE_URL}/genieExplain`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Genie Service Unreachable" });
    }
});

module.exports = router;
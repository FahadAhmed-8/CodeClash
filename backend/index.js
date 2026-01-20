require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const problemRoutes = require('./routes/problemRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const compilerRoutes = require('./routes/compilerRoutes');

connectDB();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : "http://localhost:5173";
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/compiler', compilerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 CodeClash Server live on port ${PORT}`));
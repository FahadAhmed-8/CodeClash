const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;
    if (req.header('Authorization') && req.header('Authorization').startsWith('Bearer')) {
        token = req.header('Authorization').split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "No token, access denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Safety Check: Ensure user still exists in DB
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: "User no longer exists" });

        req.user = user; 
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is invalid" });
    }
};

const admin = (req, res, next) => { // Rename adminOnly to admin
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ message: "Access denied: Admins only" }); 
    }
};

module.exports = { protect, admin };
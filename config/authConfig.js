require('dotenv').config(); 

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your_default_secret_key', 
};

require('dotenv').config(); // Load environment variables

module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'your_default_secret_key', // Use env variable if available
};

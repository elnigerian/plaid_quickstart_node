require('dotenv').config();

module.exports = {
    env: {
        SERVER_HOST: process.env.SERVER_HOST,
        SERVER_PORT: process.env.SERVER_PORT,
    },
}

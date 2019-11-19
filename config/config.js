  
const { objectParser } = require('../utils/util')

const obj = objectParser(process.argv)

module.exports = {
    PORT: process.env.PORT || obj.PORT || 3000,
    HOST: process.env.HOST || obj.HOST || "0.0.0.0",
    baseURI: process.env.baseURI || obj.baseURI || "/api",
    SECRET: "eyJhbGciOi",
    database: {
        DB_USER: process.env.DB_USER || obj.DB_USER || "admin",
        DB_PASSWORD: process.env.DB_PASSWORD || obj.DB_PASSWORD || "root"
    }
}
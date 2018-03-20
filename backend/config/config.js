const env = require('node-env-file')
env('.env')

module.exports = {
    development: {        
        url: 'mysql://root:root@127.0.0.1:3306/development',
        dialect: 'mysql'
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'mysql',
    },
    test: {
        url: 'mysql://root:root@127.0.0.1:3306/test',
        dialect: "mysql"
    },
    SECRET_TOKEN: process.env.SECRET_TOKEN
};

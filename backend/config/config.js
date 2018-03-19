module.exports = {
    development: {        
        //url: 'mysql://root:root@127.0.0.1:3306/development',
        url: process.env.DATABASE_URL,
        dialect: 'mysql'
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'mysql'
    },
    staging: {
        url: process.env.DATABASE_URL,
        dialect: 'mysql'
    },
    test: {
        url: 'mysql://root:root@127.0.0.1:3306/test',
        dialect: "mysql"
    },
    SECRET_TOKEN: 'D781C863032BCEF543B35593EB6F39B2A35A62F4D094C7ECB66BC456B0C41C39'
};

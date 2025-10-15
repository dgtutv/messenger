const { Pool } = require("pg");
const { USERNAME, PASSWORD, DBNAME } = process.env;
// Again, this should be read from an environment variable
module.exports = new Pool({
    connectionString: `postgresql://${USERNAME}:${PASSWORD}@localhost:5432/${DBNAME}`
});
#! /usr/bin/env node
const fs = require('fs');
const { Client } = require("pg");
require('dotenv').config();
const { USERNAME, PASSWORD, DBNAME } = process.env;
const SQL = fs.readFileSync(`${__dirname}/initialize.sql`, 'utf8');

async function main() {
    console.log("creating...");
    const client = new Client({
        connectionString: `postgresql://${USERNAME}:${PASSWORD}@localhost:5432/${DBNAME}`
    });

    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();
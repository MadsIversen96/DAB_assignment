const fs = require("fs");
const path = require("path");
var db = require('../models');
const { QueryTypes } = require('sequelize');


const populateDatabase = async() => {
    if (await checkIfDBHasData()) {
        console.log('Database was empty, populating the database');
        await insertData('colours.json');
        await insertData('features.json');
        await insertData('roles.json');
        await insertData('types.json');
        await insertData('users.json');
        await insertData('vehicles.json');
        await insertData('vehiclefeatures.json')
    } else {
        console.log('Database is already populated, No records added')
    }
}


const insertData = async (filename) => {
    const jsonPath = path.join(__dirname, '..', 'public', 'json', filename);

      const { records } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    records.forEach( async (record) => {
        let result = await db.sequelize.query(record.query, {
            raw: true,
            type: QueryTypes.INSERT
        })
        console.log(result)
    });
}


const checkIfDBHasData = async () => {
    const tables = ['colours', 'features', 'rentals', 'roles', 'types', 'users', 'vehiclefeatures', 'vehicles'];
    
    for (const table of tables) {
        const result = await db.sequelize.query(`SELECT COUNT(*) as total FROM ${table}`, {
            raw: true,
            type: QueryTypes.SELECT
        });

        if (result[0].total > 0) {
            return false;
        }
    }

    return true;
};

module.exports = {populateDatabase};
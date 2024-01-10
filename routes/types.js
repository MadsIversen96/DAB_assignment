var express = require('express');
var router = express.Router();
var db = require('../models');
const { QueryTypes } = require('sequelize');
const { isAdmin, isCustomer } = require('../middleware/middleware');

router.get('/', async function (req, res, next) {
    const [types] = await db.sequelize.query('SELECT * FROM types');
    console.log("Types:" + types);
    res.render("types", { user: req.user, types: types });
});

router.post('/add', isAdmin, async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ status: 400, message: 'You need to enter a type if you want to add successfully' });
        }

        await db.sequelize.query('INSERT INTO types (name) VALUES (:name)', {
            replacements: { name },
            type: QueryTypes.INSERT
        });
        res.redirect('/types');
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error trying to add type' });
    }
});

router.put('/update/:id', isAdmin, async function (req, res, next) {
    const { id } = req.params;
    const { name } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ status: 400, message: 'You need to enter a type if you want to update successfully' });
        }

        await db.sequelize.query('UPDATE types SET name = :name WHERE id = :id', {
            replacements: { name, id },
            type: QueryTypes.UPDATE
        });

        res.status(201).json({ status: 201, message: 'Type updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error trying to update type' });
    }
});

router.delete('/delete/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const vehicles = await db.sequelize.query('SELECT * FROM vehicles', {
            type: QueryTypes.SELECT,
        });
        const vehicleWithTypeId = vehicles.find(vehicle => vehicle.typeId == id);

        if (vehicleWithTypeId) {
            return res.status(400).json({ status: 400, message: 'Cannot delete the type because it is associated with a vehicle' });
        }

        await db.sequelize.query('DELETE FROM types WHERE id = :id', {
            replacements: { id },
            type: QueryTypes.DELETE
        });

        res.status(200).json({ status: 200, message: 'Type deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error trying to delete type' });
    }
});

module.exports = router;
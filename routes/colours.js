var express = require('express');
var router = express.Router();
var db = require('../models');
const { QueryTypes } = require('sequelize');
const { isAdmin, isCustomer } = require('../middleware/middleware');

router.get('/', async function (req, res, next) {
    const [colours] = await db.sequelize.query('SELECT * FROM colours');
    res.render("colours", { user: req.user, colours: colours });
});

router.post('/add', isAdmin, async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ status: 400, message: 'You need to enter a colour if you want to add successfully' });
        }

        await db.sequelize.query('INSERT INTO colours (name) VALUES (:name)', {
            replacements: { name },
            type: QueryTypes.INSERT
        });
        res.redirect('/colours');
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error trying to add colour' });
    }
});

router.put('/update/:id', isAdmin, async function (req, res, next) {
    const { id } = req.params;
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ status: 400, message: 'You need to enter a colour if you want to update successfully' });
        }

        await db.sequelize.query('UPDATE colours SET name = :name WHERE id = :id', {
            replacements: { name, id },
            type: QueryTypes.UPDATE
        });

        res.status(201).json({ status: 201, message: 'Colour updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error trying to update colour' });
    }
});

router.delete('/delete/:id', isAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const vehicles = await db.sequelize.query('SELECT * FROM vehicles', {
            type: QueryTypes.SELECT,
        });
        const vehicleWithcolourId = vehicles.find(vehicle => vehicle.colourId == id);

        if (vehicleWithcolourId) {
            return res.status(400).json({ status: 400, message: 'Cannot delete the color because it is associated with a vehicle' });
        }

        await db.sequelize.query('DELETE FROM colours WHERE id = :id', {
            replacements: { id },
            type: QueryTypes.DELETE
        });
        res.status(200).json({ status: 200, message: 'Colour deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error trying to delete colour' });
    }
});

module.exports = router;
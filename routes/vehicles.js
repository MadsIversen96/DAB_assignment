var express = require('express');
var router = express.Router();
var db = require('../models');
const { QueryTypes } = require('sequelize');
const { isAdmin, isCustomer } = require('../middleware/middleware');

router.get('/', async function (req, res, next) {
  let [vehicles] = await db.sequelize.query(
    `SELECT 
    v.id AS 'id', 
    v.regNo AS 'regNo', 
    v.make AS 'make', 
    v.model AS 'model', 
    c.name AS 'colour', 
    t.name AS 'type', 
    GROUP_CONCAT(f.name) AS 'features', 
    DATE_FORMAT(v.lastServiceDate, '%Y-%m-%d') AS 'lastServiceDate', 
    v.rented AS 'rented',
    (DATEDIFF(CURRENT_DATE, v.lastServiceDate) > 180) AS 'serviceable'
  FROM 
    vehicles v
  JOIN 
    colours c ON v.colourId = c.id
  JOIN 
    types t ON v.typeId = t.id
  LEFT JOIN 
    vehiclefeatures vf ON v.id = vf.vehicleId
  LEFT JOIN 
    features f ON vf.featureId = f.id
  GROUP BY 
    v.id`)    
    console.log(vehicles)
  res.render('vehicles', { user: req.user, vehicles: vehicles });
});

router.post('/rent/:id', isCustomer, async (req, res) => {
  const {id} = req.params;
  const userId = req.user.id
  try {
   

    const [rentedVehicle] = await db.sequelize.query('SELECT * FROM vehicles WHERE rented = 1 AND id = :id', {
      replacements: { id },
      type: QueryTypes.SELECT
    })

    if (rentedVehicle) {
      return res.status(400).json({ status: 400, message: "Cant rent a vehicle thats already rented" });
    }

    const [userAlreadyRented] = await db.sequelize.query('SELECT * FROM rentals WHERE userId = :userId', {
      replacements: { userId },
      type: QueryTypes.SELECT
    })

    if(userAlreadyRented) {
      return res.status(400).json({ status: 400, message: "You can only rent one car at the time" });
    }

  await db.sequelize.query('INSERT INTO rentals (userId, vehicleId) VALUES (:userId, :id)', {
    replacements: {userId, id},
    type: QueryTypes.INSERT
  })
  res.status(200).json({status: 200, message: 'Vehicle rented successfully'})

  await db.sequelize.query('UPDATE vehicles SET rented = 1 WHERE id = :id', {
    replacements: { id },
    type: QueryTypes.UPDATE
  })
  } catch(error) {
    console.error(error);
    res.status(500).json({ status: 500, message: 'Error trying to rent car' });
  }
});



router.delete("/cancelRent/:id", isAdmin, async function (req, res, next) {
  const { id } = req.params;

  const [rentedVehicle] = await db.sequelize.query(
    "SELECT * FROM Vehicles WHERE rented = 1 AND id = :id",
    {
      replacements: { id },
      type: QueryTypes.SELECT,
    }
  );

  if (!rentedVehicle) {
    return res.status(400).json({status: 400, message: "This vehicle is not rented"});
  }

  await db.sequelize.query("DELETE FROM Rentals WHERE vehicleId = :id", {
    replacements: { id },
    type: QueryTypes.DELETE,
  });
  res.status(200).json({status: 200, message: 'Rental successfully canceled'})

  await db.sequelize.query("UPDATE vehicles SET rented = 0 WHERE id = :id", {
    replacements: { id },
    type: QueryTypes.UPDATE,
  });
});

router.get('/popularTypes', async (req, res) => {
  try {
    let vehicleTypes = await db.sequelize.query(
      `SELECT 
      v.id AS 'id', 
      v.regNo AS 'regNo', 
      v.make AS 'make', 
      v.model AS 'model', 
      c.name AS 'colour', 
      t.name AS 'type', 
      GROUP_CONCAT(f.name) AS 'features', 
      DATE_FORMAT(v.lastServiceDate, '%Y-%m-%d') AS 'lastServiceDate', 
      v.rented AS 'rented',
      (DATEDIFF(CURRENT_DATE, v.lastServiceDate) > 180) AS 'serviceable',
      tc.typeCount AS 'typePopularity'
  FROM 
      vehicles v
  JOIN 
      colours c ON v.colourId = c.id
  JOIN 
      types t ON v.typeId = t.id
  LEFT JOIN 
      vehiclefeatures vf ON v.id = vf.vehicleId
  LEFT JOIN 
      features f ON vf.featureId = f.id
  JOIN 
      (SELECT typeId, COUNT(*) AS typeCount FROM vehicles GROUP BY typeId) tc ON v.typeId = tc.typeId
  GROUP BY 
      v.id
  ORDER BY 
      tc.typeCount DESC, t.name, v.id;`, {
        type: QueryTypes.SELECT
    });
    console.log(vehicleTypes)
    res.render('partials/popularTypes', { user: req.user, vehicles: vehicleTypes }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching popular vehicle types' });
  }
});

router.get('/currentlyRented', async (req, res) => {
  try {
    let currentlyRented = await db.sequelize.query(
      `SELECT 
      v.id AS 'id',  
      v.regNo AS 'regNo', 
      v.make AS 'make',
      v.model AS 'model',
      c.name AS 'colour', 
      t.name AS 'type',
      GROUP_CONCAT(f.name ORDER BY f.name SEPARATOR ', ') AS 'features',
      u.fullName AS 'rentedBy' 
  FROM 
      vehicles v
  JOIN 
      colours c ON v.colourId = c.id
  JOIN 
      types t ON v.typeId = t.id
  LEFT JOIN 
      vehiclefeatures vf ON v.id = vf.vehicleId
  LEFT JOIN 
      features f ON vf.featureId = f.id
  JOIN 
      rentals r ON v.id = r.vehicleId
  JOIN 
      users u ON r.userId = u.id
  WHERE 
      v.rented = 1
  GROUP BY 
      v.id, v.regNo, v.make, v.model, c.name, t.name, u.fullName;`, {
        type: QueryTypes.SELECT
    });
    console.log(currentlyRented)
    res.render('partials/currentlyRented', { user: req.user, vehicles: currentlyRented }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching rented vehicle' });
  }
  });

router.get('/requireService', isAdmin, async (req, res) => {
  try {
    let requireService = await db.sequelize.query(
      `SELECT 
      v.id,
      v.regNo,
      v.make,
      v.model,
      c.name AS 'colour',
      t.name AS 'type',
      DATE_FORMAT(v.lastServiceDate, '%d %M %Y') AS 'lastServiceDate'
  FROM 
      vehicles v
  JOIN 
      colours c ON v.colourId = c.id
  JOIN 
      types t ON v.typeId = t.id
  WHERE 
      DATEDIFF(CURRENT_DATE, v.lastServiceDate) > 180
  ORDER BY
      v.id;`, {
        type: QueryTypes.SELECT
    });
    console.log(requireService)
    res.render('partials/requireService', { user: req.user, vehicles: requireService }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching rented vehicle' });
  }	
  });

router.get('/cruiseControl', async(req, res) => {
  try {
    let cruiseControl = await db.sequelize.query(
      `SELECT 
      v.id AS 'id', 
      v.regNo AS 'regNo', 
      v.make AS 'make', 
      v.model AS 'model', 
      c.name AS 'colour', 
      t.name AS 'type', 
      GROUP_CONCAT(DISTINCT f.name ORDER BY f.name) AS 'features', 
      DATE_FORMAT(v.lastServiceDate, '%Y-%m-%d') AS 'lastServiceDate', 
      v.rented AS 'rented',
      (DATEDIFF(CURRENT_DATE, v.lastServiceDate) > 180) AS 'serviceable'
  FROM 
      vehicles v
  JOIN 
      colours c ON v.colourId = c.id
  JOIN 
      types t ON v.typeId = t.id
  JOIN 
      vehiclefeatures vf ON v.id = vf.vehicleId
  JOIN 
      features f ON vf.featureId = f.id
  JOIN 
      vehiclefeatures vf2 ON v.id = vf2.vehicleId
  JOIN 
      features f2 ON vf2.featureId = f2.id AND f2.name = 'Cruise Control'
  GROUP BY 
      v.id;`, {
        type: QueryTypes.SELECT
    });
    console.log(cruiseControl)
    res.render('partials/cruiseControl', { user: req.user, vehicles: cruiseControl }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching rented vehicle' });
  }		
  });

router.get('/allVehicles', async (req, res) => {
  let [allVehicles] = await db.sequelize.query(
    `SELECT 
    v.id AS 'id', 
    v.regNo AS 'regNo', 
    v.make AS 'make', 
    v.model AS 'model', 
    c.name AS 'colour', 
    t.name AS 'type', 
    GROUP_CONCAT(f.name) AS 'features', 
    DATE_FORMAT(v.lastServiceDate, '%Y-%m-%d') AS 'lastServiceDate', 
    v.rented AS 'rented',
    (DATEDIFF(CURRENT_DATE, v.lastServiceDate) > 180) AS 'serviceable'
  FROM 
    vehicles v
  JOIN 
    colours c ON v.colourId = c.id
  JOIN 
    types t ON v.typeId = t.id
  LEFT JOIN 
    vehiclefeatures vf ON v.id = vf.vehicleId
  LEFT JOIN 
    features f ON vf.featureId = f.id
  GROUP BY 
    v.id`)    
    console.log(allVehicles)
  res.render('partials/allVehicles', { user: req.user, vehicles: allVehicles });
  });

module.exports = router;


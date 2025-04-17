const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csvtojson');
const Car = require('../models/Car');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'csv-' + Date.now() + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

// API health check endpoint
router.get('/', (req, res) => {
  res.status(200).json({ message: 'CSV upload API is running' });
});

// Add endpoint to get all cars
router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find({});
    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Failed to fetch cars data: ' + error.message });
  }
});

// Basic file upload handler - just save the file and return success
router.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded or file is not a CSV.' 
      });
    }

    console.log('File uploaded:', req.file);
    
    // Success response
    res.status(200).json({ 
      message: 'File uploaded successfully!',
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path
    });
  } catch (error) {
    console.error('CSV Upload Error:', error);
    res.status(500).json({ 
      message: 'Failed to upload CSV file: ' + error.message 
    });
  }
});

// The full CSV processing endpoint - takes a file and tries to parse it
router.post('/process', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or file is not a CSV.' });
    }

    console.log('File uploaded for processing:', req.file);
    const csvFilePath = req.file.path;
    
    // Parse CSV to JSON
    console.log('Reading CSV file from path:', csvFilePath);
    const cars = await csv().fromFile(csvFilePath);

    if (!cars || cars.length === 0) {
      return res.status(400).json({ message: 'CSV file is empty or invalid.' });
    }

    console.log(`Successfully parsed ${cars.length} cars from CSV`);

    // Clean and map data if needed (convert string to number etc.)
    const cleanedCars = cars.map(car => {
      // Default values for when they're missing or not numbers
      const price = Number(car.price) || 0;
      const manufacturing_year = Number(car.manufacturing_year) || new Date().getFullYear();
      const km_driven = Number(car.km_driven) || 0;

      return {
        model_name: car.model_name || 'Unknown Model',
        price, 
        manufacturing_year,
        engine_capacity: car.engine_capacity || 'Unknown',
        spare_key: car.spare_key || 'No',
        transmission: car.transmission || 'Manual',
        km_driven,
        ownership: car.ownership || 'First Owner',
        fuel_type: car.fuel_type || 'Petrol',
        imperfections: car.imperfections || 'None',
        repainted_parts: car.repainted_parts || 'None'
      };
    });

    console.log('Inserting data into MongoDB...');
    await Car.insertMany(cleanedCars);
    console.log('Data inserted successfully');

    // Cleanup - delete the uploaded file
    fs.unlinkSync(csvFilePath);

    res.status(200).json({ 
      message: 'CSV data uploaded and stored successfully!',
      count: cleanedCars.length
    });
  } catch (error) {
    console.error('CSV Processing Error:', error);
    
    // More specific error messages based on error type
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Data validation failed: ' + error.message });
    }
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      return res.status(500).json({ message: 'Database error: ' + error.message });
    }
    
    res.status(500).json({ message: 'Failed to process CSV data: ' + error.message });
  }
});

module.exports = router;

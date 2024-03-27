const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');


const userRoutes = require('./module/routes/UserRoutes');
const activitiesRoutes = require('./module/routes/ActivitiesRoutes');
const DPARoutes = require('./module/routes/DPARoutes');
const KegSekRoutes = require('./module/routes/KegSekRoutes');
const DataAsetRoutes = require('./module/routes/DataAsetRoutes');
const DKKRoutes = require('./module/routes/DKKRoutes');
const DBHCHTRoutes = require('./module/routes/DBHCHTRoutes');
const KaryawanRoutes  = require('./module/routes/KaryawanRoutes');
const app = express();

dotenv.config();
require("./module/database/mongodb");

// Enable CORS
app.use(cors());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/', userRoutes);
app.use('/activities', activitiesRoutes);
app.use('/dpa', DPARoutes);
app.use('/kegsek', KegSekRoutes);
app.use('/dataaset', DataAsetRoutes);
app.use('/dkk', DKKRoutes);
app.use('/dbhcht', DBHCHTRoutes);
app.use('/karyawan', KaryawanRoutes);


// Define routes
app.get("/", (req, res) => {
    console.log("Response success")
    res.send("Response Success!!!")
    res.status(200)
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is up and listening on " + PORT);
});

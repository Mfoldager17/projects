const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Mongoose connection
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true,useUnifiedTopology:true})

// Middleware
app.use(express.json())
app.use(express.static(__dirname + '/public'))

// Endpoints
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '/views') })
})
    .use('/api', require('./routes/api/profile-api'))

// Run of the application
app.listen(PORT, () => console.log(`Running on port http://localhost:${PORT}`))

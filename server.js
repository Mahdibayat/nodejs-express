if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} 

const express = require('express');
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser');

// ROUTES
const indexRoutes = require('./routes/index')
const authorsRoutes = require('./routes/authors')

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayout);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection
db.on('error', console.error)
db.on('open', () => console.log("connect to mongoose"))

// ROUTES
app.use('/', indexRoutes);
app.use('/authors', authorsRoutes);

app.listen(process.env.PORT || 3000);

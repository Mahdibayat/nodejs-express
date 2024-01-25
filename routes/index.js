const express = require('express')
const Book = require('../models/book')
const router = express.Router()

router.get('/', async(req, res) => {
  let books = await Book.find().sort('desc').limit(10);
  res.render("index", {books})
});

module.exports = router
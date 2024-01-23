const express = require('express');
const Author = require('../models/author');

const router = express.Router()

// ALL ROUTES
router.get('/', async (req, res) => {
  let searchOptions = {}

  if(!!req.query.name)
    searchOptions.name = new RegExp(req.query.name, 'i')

  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors, searchOptions:req.query })
  } catch (error) {
    console.error({error})
    res.redirect("/")
  };
});

// NEW Author ROUTE
router.get('/new', (req, res) => {
  res.render("authors/new", {author: new Author() })
});

// 
router.post('/', async (req, res) => {
  const author = await new Author({
    name: req.body.name
  })

  try {
   const newAuthor = await author.save();
   res.redirect('authors');
  } catch (error) {
    res.render('authors/new', {
      author,
      errorMessage: `an Error : ${error}`
    });
  };
});

module.exports = router
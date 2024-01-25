const express = require('express');
const Book = require('../models/book');
const Author = require('../models/author');
const multer = require('multer');
const path = require('path');
const { unlink } = require('fs');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
const uploadPath = path.join('public', Book.coverImageBasePath);
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

const router = express.Router()

// ALL ROUTES
router.get('/', async (req, res) => {
  let query = Book.find();

  if (!!req.query) {
    if (!!req.query.title)
      query = query.regex('title', new RegExp(req.query.title));
    if (!!req.query['publish-before'])
      query = query.lte('publishDate', req.query['publish-before']);
    if (!!req.query['publish-after'])
      query = query.gte('publishDate', req.query['publish-after']);
  }
  try {
  const books = await query.exec();
  res.render('books/index', {books, searchOptions: req.query})
  } catch (error) {
  res.redirect('/')
  };
   
});

// NEW Book ROUTE
router.get('/new', async (req, res) => {
  renderNewBook(res, new Book());
});

// 
router.post('/', upload.single('cover'), async (req, res) => {
  const {title, description, publishDate, pageCount, author} = req.body;
  const coverImageName = !!req.file ? req.file.filename : null;

  const book = new Book({
    title,
    author,
    description,
    publishDate: new Date(publishDate),
    pageCount,
    coverImageName
  })

  console.log({body: req.body})

  try {
    await book.save();
    res.redirect('books')
  } catch (error) {
    console.log({error})
    if (!!book.coverImageName)
      unlink(path.join(uploadPath, coverImageName), console.error)
    renderNewBook(res, book, true);
  };
});

async function renderNewBook(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    let params = {authors,book}
    if (hasError) params.errorMessage = 'error Creating book'
    res.render('books/new', params);
  } catch (error) {
    res.redirect('/books')
  }; 
}

module.exports = router
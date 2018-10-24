const express = require('express');
const router = new express.Router();
const Book = require('../models/book');

const { validate } = require('jsonschema');
const booksFindAllSchema = require('../schemas/findAll.json');
const booksCreateSchema = require('../schemas/create.json');
const booksUpdateSchema = require('../schemas/update.json');

router.get('/', async function(req, res, next) {
  console.log('this get route works');

  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

router.post('/', async function(req, res, next) {
  const result = validate(req.body, booksCreateSchema);
  console.log('this is the result: ', result);

  if (!result.valid) {
    console.log('Hey look at me');
    let error = {};
    error.message = result.errors.map(error => error.stack);
    error.status = 400;
    return next(error);
  }

  try {
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
  } catch (err) {
    return next(err);
  }
});

router.patch('/:isbn', async function(req, res, next) {
  const result = validate(req.body, booksUpdateSchema);

  if (!result.valid) {
    let error = {};
    error.message = result.errors.map(error => error.stack);
    error.status = 400;
    return next(error);
  }

  try {
    const book = await Book.update(req.params.isbn, req.body);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

router.delete('/:isbn', async function(req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: 'Book deleted' });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

process.env.NODE_ENV = 'test';

const db = require('../db');
const request = require('supertest');
const app = require('../app');

beforeEach(async function() {
  await db.query(
    `INSERT INTO books (
      isbn,
      amazon_url,
      author,
      language,
      pages,
      publisher,
      title,
      year) 
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
   RETURNING isbn,
             amazon_url,
             author,
             language,
             pages,
             publisher,
             title,
             year`,
    [
      '024352518',
      'http://a.co/eobPtX2',
      'Glenn Ramel',
      'English',
      '5',
      'Stanford University Press',
      '51 Shades of Gray',
      '2018'
    ]
  );
});

afterEach(async function() {
  await db.query(`DELETE FROM books`);
});

afterAll(async function() {
  await db.end();
});

describe('GET /', function() {
  test('It should return all books in array', async function() {
    const response = await request(app).get('/books/');
    expect(response.body).toEqual({
      books: [
        {
          isbn: '024352518',
          amazon_url: 'http://a.co/eobPtX2',
          author: 'Glenn Ramel',
          language: 'English',
          pages: 5,
          publisher: 'Stanford University Press',
          title: '51 Shades of Gray',
          year: 2018
        }
      ]
    });
    expect(response.statusCode).toBe(200);
  });
});

describe('POST /', function() {
  test('It should return created book', async function() {
    const response = await request(app)
      .post('/books/')
      .send({
        isbn: '022352552518',
        amazon_url: 'http://a.co/eodfdfbPtX2',
        author: 'Andrew Pungprakearti',
        language: 'English',
        pages: 4,
        publisher: 'Yale University Press',
        title: '49 Shades of Gray',
        year: 2018
      });
    expect(response.body).toEqual({
      book: {
        isbn: '022352552518',
        amazon_url: 'http://a.co/eodfdfbPtX2',
        author: 'Andrew Pungprakearti',
        language: 'English',
        pages: 4,
        publisher: 'Yale University Press',
        title: '49 Shades of Gray',
        year: 2018
      }
    });
    expect(response.statusCode).toBe(201);
  });
});

describe('PATCH /', function() {
  test('It should update the book and return updated book', async function() {
    const response = await request(app)
      .patch('/books/024352518/')
      .send({
        isbn: '024352518',
        amazon_url: 'http://a.co/eodfdfbPtX2',
        author: 'Andrew Pungprakearti',
        language: 'English',
        pages: 4,
        publisher: 'Yale University Press',
        title: '49 Shades of Gray',
        year: 2018
      });
    expect(response.body).toEqual({
      book: {
        isbn: '024352518',
        amazon_url: 'http://a.co/eodfdfbPtX2',
        author: 'Andrew Pungprakearti',
        language: 'English',
        pages: 4,
        publisher: 'Yale University Press',
        title: '49 Shades of Gray',
        year: 2018
      }
    });
    expect(response.statusCode).toBe(200);
  });
});

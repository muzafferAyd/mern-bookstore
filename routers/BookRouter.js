const express = require("express");
const BookController = require("../constrollers/BookController");
const router = express.Router();


// base url : /api/books

/**
 * @route GET /api/books
 * @desc Books lidtening endpoint
 * @access Public
*/

router.get("/", BookController.getBookList );


/**
 * @route GET /api/books/ details/:id
 * @desc Books Details endpoint
 * @access Public
*/

router.get("/details/:id", BookController.getBookDetails);

module.exports = router;
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    
      const username = req.body.username;
      const password = req.body.password;
    
      // Check if username & password provided
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
    
      // Check if user already exists
      if (isValid(username)) {
        return res.status(409).json({ message: "User already exists!" });
      }
    
      // Register user
      users.push({ username, password });
    
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    
    });
    

// Get the book list available in the shop
 public_users.get('/', function (req, res) {
        return res.status(200).json(books);
      });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  res.send(books[isbn]);
  return res.status(200).json(books);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let books = require("./booksdb.js");

  let filteredBooks = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].author === author) {
      filteredBooks[isbn] = books[isbn];
    }
  });

  return res.status(200).json(filteredBooks);
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let books = require("./booksdb.js");

  let filteredBooks = {};

  Object.keys(books).forEach(isbn => {
    if (books[isbn].title === title) {
      filteredBooks[isbn] = books[isbn];
    }
  });

  return res.status(200).json(filteredBooks);
//   return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let books = require("./booksdb.js");

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
//   return res.status(300).json({message: "Yet to be implemented"});
});
public_users.get('/async/books', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });
  public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching book by ISBN" });
    }
  });
  public_users.get('/async/author/:author', (req, res) => {

    const author = req.params.author;
  
    axios.get(`http://localhost:5000/author/${author}`)
      .then(response => res.status(200).json(response.data))
      .catch(() => res.status(500).json({ message: "Error fetching books by author" }));
  
  });
  public_users.get('/async/title/:title', (req, res) => {

    const title = req.params.title;
  
    axios.get(`http://localhost:5000/title/${title}`)
      .then(response => res.status(200).json(response.data))
      .catch(() => res.status(500).json({ message: "Error fetching books by title" }));
  
  });
        
module.exports.general = public_users;

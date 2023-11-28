const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here - Taks 6 - Work
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else {
    return res.status(404).json({message: "Unable to register user"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here - Task 1 - work
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here - Task 2 - work
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
// Hints:
// 1. Obtain all the keys for the ‘books’ object.
// 2. Iterate through the ‘books’ array & check the author matches the one provided in the request parameters.
public_users.get('/author/:author',function (req, res) {
    //Write your code here - Task 3 - work
    const req_author = req.params.author;
    bookslist_array = books;
    authorlist_array = {};
    console.log(Object.getOwnPropertyNames(object1)); // sacar da error
    for(var key in bookslist_array) {
        if(bookslist_array.hasOwnProperty(key)) {
            var value = bookslist_array[key];
            if  (value["author"] == req_author) {
                authorlist_array[key] = value;
            }
  
        }
    }
    res.send(authorlist_array);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here - Task 4 - Work
  const req_title = req.params.title;
  bookslist_array = books;
  titlelist_array = {};
  
  for(var key in bookslist_array) {
      if(bookslist_array.hasOwnProperty(key)) {
          var value = bookslist_array[key];
          if  (value["title"] == req_title) {
            titlelist_array[key] = value;
          }

      }
  }
  res.send(titlelist_array);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here - Task 5
  const isbn = req.params.isbn;
  var book = (books[isbn]);

  //res.send(`The book with isbn ${isbn} has/have the review/s: ` + book.reviews);
  res.send(book.reviews);

});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  //res.send("The user " + (' ') + (req.body.username) + " Has been added!");
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }
  //return res.status(404).json({message: "Unable to register user"});
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
    console.log(Object.getOwnPropertyNames(object1)); // sacar
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
  //console.log("Hello this is the GET REQUEST Get book review")
  //res.send(book);
  res.send(book.reviews);
});

// agrego esto para probar sin auth
public_users.post("/reviewtest/:isbn", (req, res) => {
  //Write your code here - Task 8
  const isbn = req.params.isbn;
  console.log("isbn: " + isbn);

  // if (isbn) isbn Validation?

  bookslist_array = books;

  // dont worlk --> var book = (books[isbn]);
  console.log("Book" + JSON.stringify(books[isbn]));

  //for(var key in bookslist_array) {
  //  if(bookslist_array.hasOwnProperty(key)) {
  //      var value = bookslist_array[key];
  //  }
  //}
  let book = books[isbn];
  let author = bookslist_array[isbn].author;
  let title  = bookslist_array[isbn].title;
  let review = "testing"; //bookslist_array[isbn].review;
  console.log("author: " + author);

  {
    books[isbn] = {
        "author":author,
        "title":title,
        "reviews":review
        }
  }
  res.send("The book" + (' ')+ JSON.stringify(books[isbn]) + " Has been added!");

});



module.exports.general = public_users;

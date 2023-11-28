const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
let lastLoginUser; 

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here - Task 7 - Works
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }
  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign( {data: password}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {accessToken,username}
    lastLoginUser = username;
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review - task 8 - Works
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("Hello this is the PUT REQUEST function -> Add a book review")
  const isbn = req.params.isbn;
  console.log("ISBN: " + isbn);

  let filtered_book = books[isbn]
  console.log(filtered_book); //sacar
  console.log("User: " + lastLoginUser); //sacar

  if (filtered_book) { //Check if the book exists
    let copiedReviews = Object.assign({}, books[isbn].reviews);
    console.log("Reviews List:");
    let flagUserExist = false;
    for (const prop in copiedReviews) {
      console.log(`copiedReviews.${prop} = ${copiedReviews[prop]}`); //sacar
      if (copiedReviews.user === lastLoginUser){
        flagUserExist = true;
        break;
      }
    }
    console.log("flagUserExist: : " + flagUserExist);

    books[isbn].reviews[lastLoginUser] = req.query.reviews;
    res.send(`Review of user ${lastLoginUser} for the book with isbn ${isbn} has been added or updated.`);
  }

});

// Delete a book review - Task 9 - Works
regd_users.delete("/auth/review/:isbn", (req, res) => {
  console.log("Hello this is the DELETE REQUEST function -> Delete a book review")
  const isbn = req.params.isbn;
  console.log("ISBN: " + isbn);

  let filtered_book = books[isbn]
  console.log(filtered_book); //sacar
  console.log("User: " + lastLoginUser); //sacar

  if (filtered_book) { //Check if the book exists
    let copiedReviews = Object.assign({}, books[isbn].reviews);
    console.log("Reviews List:");
    for (const prop in copiedReviews) {
      console.log(`copiedReviews.${prop} = ${copiedReviews[prop]}`); //sacar
      }

    delete books[isbn].reviews[lastLoginUser];
    res.send(`Review of user ${lastLoginUser} for the book with isbn ${isbn} has been deleted.`);

  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

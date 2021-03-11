// BUILD YOUR SERVER HERE
// import  data model to interact with data
const User = require("./users/model");
// bring express into project
const express = require("express");

const server = express();

// search request body for JSON string and convert JSON string
// from request body into object and save that object a req.body
server.use(express.json());

// POST request to create a user
// Crud CREATE
server.post("/api/users", async (req, res) => {
  const user = req.body;

  // check to make sure body is valid
  if (!user.name || !user.bio) {
    // if not valid, respond with error code
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
  } else {
    try {
      const newUser = await User.insert(user);
      res.status(201).json({ newUser });
    } catch (err) {
      // not sure why we ended up here, but better send a 500 error
      res.status(500).json({
        message: "There was an error while saving the user to the database",
      });
    }
  }
});

// GET request for all users
// cRud READ
server.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The users information could not be retrieved" });
  }
});

// GET request for a specific user
server.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    }
  } catch (err) {
    res
      .status(500)
      //   .json({ message: "The user information could not be retrieved" });
      .json({ message: err.message });
  }
});

// DELETE request to delete a user from database
// cruD DELETE
server.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.remove(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: "The user could not be removed" });
  }
});

// PUT request to update a user
// crUd UPDATE
server.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  // validate the body
  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
  } else {
    try {
      let updatedUser = await User.update(id, changes);
      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist" });
      }
    } catch (err) {
      res
        .status(500)
        .json({ message: "The user information could not be modified" });
    }
  }
});

module.exports = server; // EXPORT YOUR SERVER instead of {}

var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const secretKey = "rubicamp"
const saltRounds = 10


/* GET home page. */
module.exports = function (db) {

  router.post("./register", async function (req, res, next) {
    try {
      const { email, fullname, password } = req.body

      const hash = await bcrypt.hashSync(password, saltRounds);
      const userCreated = await collection.insertOne({ email, fullname, password: hash })
      const user = await collection.findOne(userCreated.insertedId)
      var token = jwt.sign(user, secretKey);
      res.json(token)
    } catch (err) {
      res.json(err)
    }
  });

  router.post("./auth", function (req, res, next) {
    const { email, password } = req.body
  });

  return router;
}
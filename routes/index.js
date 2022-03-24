var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const helpers = require("../helpers/util")

const saltRounds = 10


/* GET home page. */
module.exports = function (db) {

  const collection = db.collection("users")

  const response = {
    success: true,
    data: null
  }

  router.post("/register", async function (req, res, next) {
    try {
      const { email, fullname, password } = req.body

      //cek user exist 
      const userExist = await collection.findOne({ email })


      if (userExist) throw "user already exist"

      const hash = await bcrypt.hashSync(password, saltRounds);
      const userCreated = await collection.insertOne({ email, fullname, password: hash })
      const user = await collection.findOne(userCreated.insertedId)
      var token = jwt.sign(user, helpers.secretKey);


      response.success = true
      response.data = { token }

    } catch (err) {
      response.success = false
      response.data = err

    } finally {
      res.json(response)
    }
  });

  router.post("/login", async function (req, res, next) {

    try {
      const { email, password } = req.body
      //cek user exist 
      const userExist = await collection.findOne({ email })


      if (!userExist) throw "user doesn't exist"

      const match = await bcrypt.compare(password, userExist.password)

      if (!match) throw "password doesn't match"

      var token = jwt.sign(userExist, helpers.secretKey);


      await collection.updateOne({
        _id: userExist._id
      }, {
        $set: {
          token
        }
      })


      response.success = true
      response.data = { token }

    } catch (err) {
      response.success = false
      response.data = err

    } finally {
      res.json(response)
    }
  });

  router.get("/logout", helpers.isAuthenticated, async (req, res) => {
    try {

      await collection.updateOne({
        _id: req.user._id
      }, {
        $set: {
          token: null

        }
      })

      response.success = success
      response.data = "berhasil logout"
    } catch (err) {
      response.success = false
      response.data = err

    } finally {
      res.json(response)
    }
  })

  return router;
}
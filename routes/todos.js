var express = require('express');
var router = express.Router();
const ObjectId = require("mongodb").ObjectId

module.exports = function (db) {
  const collection = db.collection("todos")

  router.get('/', async function (req, res, next) {
    const todos = await collection.find({}).toArray()
    res.json(todos)
  });

  router.post('/', async function (req, res, next) {
    const dataCreated = await collection.insertOne({ title: req.body.title, complete: false })
    const todo = await collection.findOne(dataCreated.insertedId)
    res.json(todo)
  });

  router.put('/:id', async function (req, res, next) {
    const todo = await collection.findOneAndUpdate({
      _id: new ObjectId(req.params.id)
    }, {
      $set: {
        title: req.body.title,
        complete: JSON.parse(req.body.complete)
      }
    },
      {
        returnDocument: "after"
      }
    )
    res.json(todo.value)
  });

  router.delete('/:id', async function (req, res, next) {
    const todo = await collection.findOneAndDelete({
      _id: new ObjectId(req.params.id)
    })
    res.json(todo.value)
  });


  return router;
}

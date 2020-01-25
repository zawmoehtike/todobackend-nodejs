var express = require("express");
var route = express();

var mongoJs = require("mongojs");
// test is database name
var db = mongoJs("test");

var bodyParser = require("body-parser");
route.use(bodyParser.urlencoded({extended: false}));
route.use(bodyParser.json());

var cors = require("cors");
route.use(cors());

/// Show All
// curl -X GET localhost:8000/tasks
/*route.get('/tasks', function(req, res) {
    var data = [
        { subject: 'Apple', status: 0 },
        { subject: 'Orange', status: 1 },
    ];

    res.status(200).json(data);
});*/
route.get('/tasks', function(req, res) {
    db.tasks.find(function (err, data) {
        res.status(200).json(data);
    })
});

/// Show One
/*route.get('/task/:id', function (req, res) {
    res.status(200).json({id: req.params.id});
});*/
route.get('/tasks/:id', function (req, res) {
   var id = req.params.id;

   db.tasks.find({ _id: mongoJs.ObjectID(id) }, function (err, data) {
       res.status(200).json(data)
   })
});

/// Insert
// curl -X POST localhost:8000/task -d "subject=cheese cake"
route.post('/tasks', function (req, res) {
   /*var subject = req.body.subject;
   var default_status = 0;

   if(!subject) {
       res.status(400).json({ msg: "Missing Subject"});
   }

   db.tasks.insertOne({ subject: subject, status: default_status }, function (err, data) {
      db.tasks.find({_id: data.insertId}, function (err, data) {
         res.status(200).json(data);
      });
   });*/
    var subject = req.body.subject;

    if(!subject) res.status(400).json({
        msg: "Missing subject"
    });

    db.tasks.insert({ subject, status: 0 }, function(err, data) {
        res.status(200).json(data);
    });
});

/// Delete One
// curl -X DELETE localhost:8000/task/task_id
route.delete('/tasks/:id', function (req, res) {
    db.tasks.remove({ _id: mongoJs.ObjectID(req.params.id) }, function (err, data) {
        res.status(200).json(data);
    });
});

/// Delete One or More
// curl -X DELETE localhost:8000/tasks
// clear finished tasks
route.delete('/tasks', function (req, res) {
    db.tasks.remove({ status: 1 }, function (err, data) {
        res.status(200).json(data);
    });
});

/// Update
// curl -X PUT localhost:8000/task/task_id -d "status=1"
// update task
route.put('/tasks/:id', function(req, res) {
    var status = req.body.status;
    if(status !== 1 && status !== 0) {
        return res.status(400).json({ msg: "Incorrect status" });
    }

    db.tasks.update(
        { _id: mongoJs.ObjectID(req.params.id) },
        { $set: { status: parseInt(status) } },
        { multi: false },
        function(err, data) {
            res.status(200).json(data);
        }
    );
});

route.listen(8000, function() {
    console.log('Todo API running at 8000');
});
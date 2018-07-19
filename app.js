
var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var firebase = require("firebase");

var router = express.Router();
var app = express();


app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/'));
app.use('/api', router);

app.set('port', process.env.PORT || 8080);
var listener = app.listen(app.get('port'), function() {
  console.log( listener.address().port );
});

firebase.initializeApp({
  databaseURL: "https://snatched-c4168.firebaseio.com",
  service_account: "service.json"
})

var db = firebase.database();
var ref = db.ref("employees");

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
});

router.route('/employees')
  .get(function(req,res){
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
      res.json(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  });

router.route('/employee/:name')
  .get(function(req,res){
    ref.child(req.params.name).on("value", function(snapshot) {
      console.log(snapshot.val());
      res.json(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  })
  .post(function(req,res){
    var usersRef = ref.child(req.params.name);
    usersRef.set({
      name: req.params.name,
      age: req.body.age,
      position: req.body.position
    });
  })
  .put(function(req, res){

  })
  .delete(function(req,res){
    var usersRef = ref.child(req.params.name);
    usersRef.set(null);
  });

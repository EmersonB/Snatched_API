
var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var firebase = require("firebase");

var app = express();
var router = express.Router();


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
var ref = db.ref("entries");

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
});

router.route('/entries')
  .get(function(req,res){
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
      res.json(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
});

router.route('/entry/:id')
  .get(function(req,res){
    ref.child(req.params.id).on("value", function(snapshot) {
      console.log(snapshot.val());
      res.json(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  })

.post(function(req,res){
    var usersRef = ref.child(req.params.name);
    usersRef.set({
      acce: {x: req.body.accex, y: req.body.accey, z: req.body.accez},
      gyro: {x: req.body.gyrox, y: req.body.gyroy, z: req.body.gyroz},
      id: req.params.id,
      time: req.body.time
    });
  })

.put(function(req, res){

})

.delete(function(req,res){
    var usersRef = ref.child(req.params.name);
    usersRef.set(null);
});

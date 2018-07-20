
var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var firebase = require("firebase");
var fs = require('fs');
var json2csv = require('json2csv').parse;
var csvWriter = require('csv-write-stream')

var app = express();
var router = express.Router();

var newLine= "\r\n";


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
   var dataRef = ref.child(req.params.id);
   console.log(req.body);
   data = {
       Time: req.body.time,
       Gx: req.body.gyrox,
       Gy: req.body.gyroy,
       Gz: req.body.gyroz,
       Ax: req.body.accex,
       Ay: req.body.accey,
       Az: req.body.accez
   }
   add_data_to_csv(data)
   dataRef.push({
     acce: {x: req.body.accex, y: req.body.accey, z: req.body.accez},
     gyro: {x: req.body.gyrox, y: req.body.gyroy, z: req.body.gyroz},
     time: req.body.time
 })
res.send("success");
})

.put(function(req, res){

})

.delete(function(req,res){
    var usersRef = ref.child(req.params.name);
    usersRef.set(null);
});

add_data_to_csv(data)
function add_data_to_csv(){

  var writer = csvWriter({sendHeaders: false})
  writer.pipe(fs.createWriteStream('stolen.csv', {flags: 'a'}))
  writer.write(data)
  writer.end()
}

var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var fs = require('fs');
var json2csv = require('json2csv').parse;
var csvWriter = require('csv-write-stream');
var app = express();

var router = express.Router();
var newLine= "\r\n";
var count = 1;

app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/'));
app.use('/api', router);
app.set('port', process.env.PORT || 8080);

var Gx={}; var Gy={}; var Gz={}; var Ax={}; var Ay={}; var Az={};
var GxWriter = csvWriter({sendHeaders: false, headers:[1,2,3,4,5,6,7,8,9,10,11,12,13]});
var GyWriter = csvWriter({sendHeaders: false, headers:[1,2,3,4,5,6,7,8,9,10,11,12,13]});
var GzWriter = csvWriter({sendHeaders: false, headers:[1,2,3,4,5,6,7,8,9,10,11,12,13]});
var AxWriter = csvWriter({sendHeaders: false, headers:[1,2,3,4,5,6,7,8,9,10,11,12,13]});
var AyWriter = csvWriter({sendHeaders: false, headers:[1,2,3,4,5,6,7,8,9,10,11,12,13]});
var AzWriter = csvWriter({sendHeaders: false, headers:[1,2,3,4,5,6,7,8,9,10,11,12,13]});

var listener = app.listen(app.get('port'), function() {
  console.log( listener.address().port );
});

app.get('/api/safe', function(req, res) {
  var spawn = require("child_process").spawn;
  var proc = spawn('python3',["./api/snatched.py"]);
  proc.stdout.on('data', function(data){
    res.json({"data": (parseFloat(data)).toFixed(2).toString() });
  });
})

router.route('/entry/:id')
.post(function(req,res){
   add_data_to_csv({
       Gx: req.body.gyrox,
       Gy: req.body.gyroy,
       Gz: req.body.gyroz,
       Ax: req.body.accex,
       Ay: req.body.accey,
       Az: req.body.accez
   })
  console.log(req.body);
  res.send("success");
})

function add_data_to_csv(data) {
  Gx[count] = data.Gx;
  Gy[count] = data.Gy;
  Gz[count] = data.Gz;
  Ax[count] = data.Ax;
  Ay[count] = data.Ay;
  Az[count] = data.Az;
  count++;

  if(count > 12) {
    Gx[count] = 1;
    Gy[count] = 1;
    Gz[count] = 1;
    Ax[count] = 1;
    Ay[count] = 1;
    Az[count] = 1;
    GxWriter.pipe(fs.createWriteStream('GxData.csv', {flags: 'a'}));
    GyWriter.pipe(fs.createWriteStream('GyData.csv', {flags: 'a'}));
    GzWriter.pipe(fs.createWriteStream('GzData.csv', {flags: 'a'}));
    AxWriter.pipe(fs.createWriteStream('AxData.csv', {flags: 'a'}));
    AyWriter.pipe(fs.createWriteStream('AyData.csv', {flags: 'a'}));
    AzWriter.pipe(fs.createWriteStream('AzData.csv', {flags: 'a'}));
    GxWriter.write(Gx);
    GyWriter.write(Gy);
    GzWriter.write(Gz);
    AxWriter.write(Ax);
    AyWriter.write(Ay);
    AzWriter.write(Az);
    count = 1;
  }
}
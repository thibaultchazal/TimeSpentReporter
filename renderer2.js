// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const serialport = require('serialport')
// const serialPort = serialport.serialPort; // make a local instance of it

//var myPort = new serialport('/dev/cu.usbmodem1411',{baudRate: 9600,
var myPort = new serialport('/dev/cu.usbmodem1421',{baudRate: 9600,
	parser: serialport.parsers.readline('\r\n')},
	 function (err) {
  if (err) {
    return console.log('Error: ', err.message);
  }
});

var i = 0;
var t = 0;
var timer = 0;

myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}

function sendSerialData(data) {
console.log(data);
clearTimeout(t);
document.getElementById('state').innerHTML = data;

if(data == "running") {
	if(i == 0){
    var start = new Date();
    post(start, "startedTime");
   var init = start;
  }
  i = 1;
 // Ajoute 1sec toutes les 1000millisecondes
 t = setInterval(function(){
    timer++;
    postTimer(timer, "chrono");
		var currentTime = new Date();
		post(currentTime, "currentTime");
   }, 1000);

}
else if (data == "stopped") {
  i = 2;
	t = setInterval(function(){
 		var currentTime = new Date();
 		post(currentTime, "currentTime");
    }, 1000);
}
else if (data == "reset") {

 i = 0;
 }
}
function post(a,id){
	var h = a.getHours();
	var m = a.getMinutes();
	var s = a.getSeconds();
	m = checkTime(m);
	s = checkTime(s);
	document.getElementById(id).innerHTML =
	h + ":" + m + ":" + s;
}
function postTimer(a,id){
	var s = a % 60;
	var m = Math.floor(a/60);
	var h = Math.floor(m/60);
	m = m % 60;

	m = checkTime(m);
	s = checkTime(s);
	document.getElementById(id).innerHTML =
	h + ":" + m + ":" + s;
}

function checkTime(i) {
 if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
 return i;
}

function showPortClose() {
   console.log('port closed.');
}

function showError(error) {
   console.log('Serial port error: ' + error);
}

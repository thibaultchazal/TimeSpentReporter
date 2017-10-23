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


// these are the definitions for the serial events:
myPort.on('open', showPortOpen);
myPort.on('data', sendSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);
var i=0;
var totalPaused = null;
var t;
var current = new Date();

function showPortOpen() {
   console.log('port open. Data rate: ' + myPort.options.baudRate);
}

function sendSerialData(data) {
   console.log(data + totalPaused);
	 clearTimeout(t);
	 document.getElementById('state').innerHTML = data;

	 if(data == "running") {
		 if(i == 0){
			 var start = new Date();
			 post(start, "startedTime");
		 	var init = start;
		 }
		 else if (i == 2) {
		 	var init = new Date();
		 }
		 i = 1;
		//  probleme est de retourner de la fonction chronoProcess la valeur courrante "current" du chrono
		 var last = chronoProcess(init, totalPaused);
		 console.log(" current returned " + current + " last " + last + " totalPaused:" + totalPaused);
		 current.setTime(Date.parse(last));
		 console.log(" current returned " + current + " last " + last + " totalPaused:" + totalPaused);

	 }
	 else if (data == "stopped") {
		//  var totalPaused = new Date();
		 i = 2;
		 console.log(" totalPaused: " + totalPaused + " current " + current + " last " + last);
		//  totalPaused.setTime(current.getTime());
		// var lastPeriod = document.getElementById("chrono").innerHTML;
		// console.log(" totalPaused: " + totalPaused + " lastPeriod " + lastPeriod);
		//  totalPaused.setTime(Date.parse(lastPeriod) + totalPaused.getTime());

	 }
	 else if (data == "reset") {
		current = 0;
		totalPaused = 0;
		i = 0;
		}
		return totalPaused, current, last;
}


function chronoProcess(a, b) {
	var currentTime = new Date();
	console.log(" current:" + currentTime + " init:" + a + " totalPaused:" + b);
	if(b){
	//  var current = new Date(Date() - a.getTime() + b.getTime());
	 currentTime.setTime(currentTime.getTime() - a.getTime() + b.getTime());
	 currentTime.setHours(currentTime.getHours() - 1);
	//  console.log(" current:" + current + " init:" + a + " totalPaused:" + b);
 }
	else{
		// var current = new Date(Date() - a.getTime());
	 currentTime.setTime(currentTime.getTime() - a.getTime());
	 currentTime.setHours(currentTime.getHours() - 1);
	//  console.log(" current:" + current + " init:" + a);

 }
 console.log(" returning current:" + currentTime + " current.getTime" + currentTime.getTime() + " init:" + a + " totalPaused:" + b);
 post(currentTime, "chrono");
 console.log(" returning current:" + currentTime + " current.getTime" + currentTime.getTime() + " init:" + a + " totalPaused:" + b);
 t = setTimeout(function(){ chronoProcess(a, b) }, 500);
 console.log(" returning current:" + currentTime + " current.getTime" + currentTime.getTime() + " init:" + a + " totalPaused:" + b);
	return currentTime;
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

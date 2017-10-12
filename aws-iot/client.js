var awsIot = require('aws-iot-device-sdk');
var util = require('util');
var exec = require('child_process').exec;

const device = awsIot.device({
    keyPath: 'xxx.private.key',
    certPath: 'xxx.cert.pem',
    caPath: 'root-CA.crt',
    host: 'xxx.iot.ap-northeast-1.amazonaws.com'
});

device.on('connect', function() {
    console.log('connected to Message Broker.');

    setInterval(function() {
	exec("./collector.py", function (error, stdout, stderr) {
	    if (error !== null) {
		console.log('exec error: ' + error);
		return
	    }

	data = stdout.split(',');

	var record = {
	    'deviceId': 'Rapi_1st',
	    'timestamp': data[0],
	    'temp': data[1],
	    'hum': data[2]
	};

	var message = JSON.stringify(record);
	console.log('Publish: ' + message);
	device.publish('test', message);
    });

    }, 600000);

});


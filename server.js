var sys = require('util');
var net = require('net');
var query = require('./js/mongo_ops');//Подключаем наш модуль js
var mqtt = require('mqtt');
var mqtthost = '46.164.174.161';
var express = require('express');
var app = express();
var options = {
    host: mqtthost,
    port: 1883,
    protocolId: 'MQIsdp',
    protocolVersion: 3
};





// create a socket object that listens on port 3000
var io = require('socket.io').listen(3000);
 console.log('Listen 3000');
// create an mqtt client object and connect to the mqtt broker
var client = mqtt.connect(options);
  console.log('mqtt: ok');
io.sockets.on('connection', function (socket) {
// mongo.db
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/shc';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

collection = db.collection('controlers');
//mongo.db end
    // socket connection indicates what mqtt topic to subscribe to in data.topic
    socket.on('subscribe', function (data) {
        console.log('Subscribing to '+data.topic);
        socket.join(data.topic);
        client.subscribe(data.topic);
    


});

    socket.on('device_state', function (data) {


  collection.find({name : data.topic}).toArray(function(err, docs) {

    console.log("Found "+docs.length+" records");
    //console.dir(docs);
    //callback(docs.length);
	x_state = docs[0].state;
	console.log("too "+ x_state);
	 io.sockets.emit('mqtt',{'topic':String(data.topic),
                            'payload':String(x_state)});
	console.log("device_state_ans go.. "+ x_state+ data.topic);
	

  });
	/*
        console.log('get to '+data.topic+" the "+data.payload);
	var op = 'find'; 
	var op = new query.mdb(op, data.topic, data.payload);
	op.view();
	*/
        
    });
    // when socket connection publishes a message, forward that message
    // the the mqtt broker
    socket.on('publish', function (data) {
        console.log('Publishing to '+data.topic);
        client.publish(data.topic,data.payload);
   
	var op = 'update'; 
	var op = new query.mdb(op, data.topic, data.payload);
	op.view();


// socket.io end
	 });
	});
});
 
// listen to messages coming from the mqtt broker
client.on('message', function (topic, payload, packet) {
    console.log(topic+'='+payload);
    io.sockets.emit('mqtt',{'topic':String(topic),
                            'payload':String(payload)});
});


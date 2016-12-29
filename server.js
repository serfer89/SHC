var sys = require('util');
var net = require('net');
var query = require('./js/mongo_ops'); //Подключаем наш модуль js
var mqtt = require('mqtt');
var mqtthost = '93.183.224.198';
var express = require('express');
var app = express();
var options = {
  host: mqtthost,
  port: 1883,
  protocolId: 'MQIsdp',
  protocolVersion: 3
};

var r_topic="";



// create a socket object that listens on port 3000
var io = require('socket.io').listen(3000);
console.log('Listen 3000');
// create an mqtt client object and connect to the mqtt broker
var client = mqtt.connect(options);
console.log('mqtt: ok');
io.sockets.on('connection', function(socket) {
  // mongo.db
  var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

  // Connection URL
  var url = 'mongodb://localhost:27017/shc';
  // Use connect method to connect to the Server






  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");


    socket.on('choose_room', function(data) {

      db.collection('rooms').find({
        id_user: 1
      }).toArray(function(err, rooms) {

        console.log("Found " + rooms.length + " rooms records");
	var jstr = JSON.stringify(rooms);
       
	    console.log(jstr);
        io.sockets.emit('rooms_list', {
          'topic': 'rooms_list',
          'payload': String(jstr)
        });
        

      });
     

    });

    socket.on('choose_controllers', function(data) {

      db.collection('controlers').find({
        room_id: data. room_id
      }).toArray(function(err, controlers) {

        console.log("Found " + controlers.length + " controlers records with "+ data. room_id);
	var jstr = JSON.stringify(controlers);
       
	    console.log(jstr);
        io.sockets.emit('controlers_list', {
          'topic': 'controlers_list',
          'payload': String(jstr)
        });
        

      });
     

    });




// startup function

    socket.on('startup', function(data) {

      db.collection('controlers').find({
        room_id: data.room_id
      }).toArray(function(err, controlers) {

        console.log("Found " + controlers.length + " controlers records with "+ data. room_id);
	//var jstr = JSON.stringify(controlers);


	for(var i = 0; i < controlers.length; i++)

	    {console.log(i);}
       /* io.sockets.emit('controlers_list', {
          'topic': 'controlers_list',
          'payload': String(jstr)
        });
        */

      });
     

    });







    collection = db.collection('controlers');
    //mongo.db end
    // socket connection indicates what mqtt topic to subscribe to in data.topic
// отписываемся от комнаты взятую из "function get_controllers" little_aps.js
     socket.on('unsubscribe', function(data) {
      console.log('Unsubscribing to ' + data.topic);
     socket.leave(data.topic);
      client.unsubscribe(data.topic);
    });

// подписываемся на комнату взятую из "function get_controllers" little_aps.js
      socket.on('subscribe', function(data) {
      r_topic = data.topic;
      console.log('Subscribing to ' + r_topic);
      socket.join(data.topic);
      client.subscribe('#');



    });

    socket.on('device_state', function(data) {
console.log("data topic "+data.topic);
f_topic = data.topic;
f_topic = parseInt(f_topic);
      collection.find({
        id: f_topic
      }).toArray(function(err, docs) {

        console.log("Found " + docs.length + " records");
        //console.dir(docs);
        //callback(docs.length);
	if (docs.length > 0){
        x_state = docs[0].state;
        console.log("too " + x_state);
        io.sockets.emit('mqtt', {
          'topic': String(data.topic),
          'payload': String(x_state)
        });
        console.log("device_state_ans go.. " + x_state + data.topic);
	}
	else {console.log("Found "+docs.length);}
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
    socket.on('publish', function(data) {
      console.log('Publishing to ' + data.topic);
      payload = data.payload;
      payload=payload.split("/");
      console.log(payload[0]+"/"+payload[1]);
      data.payload = payload[0]+"/"+payload[1]; 
      client.publish(data.topic, data.payload);

      var op = 'update';
      var op = new query.mdb(op, payload[0], payload[1]);
      op.view();


      // socket.io end
    });
  });
});

// listen to messages coming from the mqtt broker
client.on('message', function(topic, payload, packet) {
  console.log(topic + '=' + payload);
  io.sockets.emit('mqtt', {
    'topic': String(topic),
    'payload': String(payload)
  });
});



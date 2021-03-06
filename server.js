var sys = require('util');
var net = require('net');
var query = require('./js/mongo_ops'); //Подключаем наш модуль js
var mqtt = require('mqtt');
var mqtthost = '192.168.0.77';
var express = require('express');
var app = express();
var counter=0;
var options = {
    host: mqtthost,
    port: 1883,
    protocolId: 'MQIsdp',
    protocolVersion: 3
};

var r_topic = "";
var room_id = "";
var msg = "";
function ping_test(ping_tst){
var timerId = setTimeout(function tick() {
if (counter == ping_tst){console.log('something going wrong');}
else {console.log('ping - ok!');}
	
  timerId = setTimeout(tick, 10000);
}, 10000);
}
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
    
    
   
     client.subscribe('#');
 


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

            db.collection('controllers').find({
                room_id: data.room_id
            }).toArray(function(err, controllers) {

                console.log("Found " + controllers.length + " controllers records with " + data.room_id);
                var jstr = JSON.stringify(controllers);

                console.log(jstr);
                io.sockets.emit('controllers_list', {
                    'topic': 'controllers_list',
                    'payload': String(jstr)
                });


            });


        });




        // startup function

        socket.on('startup', function(data) {
            console.log(data.topic);
            db.collection('rooms').find({
                name: data.topic
            }).toArray(function(err, rooms) {

                console.log("Found " + rooms.length + " controllers records with " + data.topic);
                //var jstr = JSON.stringify(controllers);


                for (var i = 0; i < rooms.length; i++)

                {
                    console.log(rooms[i].id);


                    db.collection('controllers').find({
                        room_id: rooms[i].id
                    }).toArray(function(err, start_state) {

                        console.log("Found " + start_state.length + " controllers records");



                        for (var i = 0; i < start_state.length; i++)

                        {
                            console.log(start_state[i].name + " in " + data.topic);
                            client.publish(data.topic, String(start_state[i].id + "/" + start_state[i].state));
                        }


                    });

                }


            });


        });




        collection = db.collection('controllers');
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
		
		
            console.log("data topic " + data.topic);
            f_topic = data.topic; // device id
		r_name = data.payload; //room name
		r_id = db.collection('rooms').find({
                name: r_name
            }).toArray(function(err, room_data){
		       
		console.log(room_data[0].id);
	    r_id=room_data[0].id;
            f_topic = parseInt(f_topic);
            collection.find({
                id: f_topic, room_id: r_id
            }).toArray(function(err, docs) {

                console.log("Found " + docs.length + " recordies");
                //console.dir(docs);
                //callback(docs.length);
                if (docs.length > 0) {
                    x_state = docs[0].state;
                    console.log("too " + x_state);
                    io.sockets.emit('mqtt', {
                        'topic': String(data.topic),
                        'payload': String(x_state)
                    });
                    console.log("device_state_ans go.. " + x_state + data.topic);
                } else {
                    console.log("Found " + docs.length);
                }
            });
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
            payload = payload.split("/");


            s_topic = r_topic.split("/");
            console.log("Room - " + r_topic + " " + s_topic[0]);
            var op = 'update';
            db.collection('rooms').find({
                name: s_topic[0]
            }).toArray(function(err, rooms) {
                room_id = rooms[0].id;
                console.log("Room id - " + room_id);
                payload[1] = payload[1] + "/" + rooms[0].id;
                data.payload = payload[0] + "/" + payload[1];
                client.publish(data.topic, data.payload);
                console.log("Goo" + payload[0] + "/" + payload[1]);
                //good_answer(payload[0], payload[1]);
             /*   var op = 'update';
                var op = new query.mdb(op, payload[0], payload[1]);
                op.view();
                console.log("Room up - " + payload[1]);*/
            });

            // socket.io end
        });

        client.on('answer', function(topic, payload, packet) {
            console.log('answer' + topic + '-' + payload);


            /* var op = 'update';
                var op = new query.mdb(op, payload[0], payload[1]);
                op.view();
                console.log("Room up - " + payload[1]);

    io.sockets.emit('mqtt', {
        'topic': String(topic),
        'payload': String(payload)
    });*/
        });



    });
});



// listen to messages coming from the mqtt broker
client.on('message', function(topic, payload, packet) {
    console.log(topic + '=' + payload);
    payload = String(payload);
    payload = payload.split("/");
    if (payload[0] == 'o' && payload[1]!=''&& payload[1]!='t') {
        var op = 'update';
        var msg = payload[3] + "/" + payload[1];
console.log(payload);
        // topic - "device_id"; payload =state/room_id
       var op = new query.mdb(op, payload[2], msg);
        op.view();
        console.log("Succsessful");
    } else {
        io.sockets.emit('mqtt', {
            'topic': String(topic),
            'payload': String(payload)
        });
    }
		counter++;
	var ping_tst=counter;
	ping_test(ping_tst);
	        console.log("counter"+counter);

});

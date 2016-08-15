//Создадим объект пользователей
function mdb(op, topic, payload){
    this.op = op;
    this.topic = topic;
    this.payload = payload;
}
//Добавим еще один метод для вывода имени
mdb.prototype.view = function(){


var op = this.op;
var topic = this.topic;
var payload = this.payload;

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/shc';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to MongoDB server");




var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('controlers');
  // Insert some documents
  collection.insertMany([
    {name : "sunblind", state : 1} , {name : "wall_light", state : 1}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(2, result.result.n);
    assert.equal(2, result.ops.length);
    console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
}


var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('controlers');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ name : topic }
		     , { $set: { state : payload }  }
		      ,{upsert: true, safe: false}
		     , function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated");
    callback(result);
  });  
}


var deleteDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('controlers');
  // Insert some documents
  collection.deleteOne({ name : "sunblind" }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
}


var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('controlers');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {

    console.log("Found the following records");




    console.dir(docs);
    callback(docs);
  });
}


switch (op) {
  case 'update':
     updateDocument(db, function() {
 db.close()});
    break;
  case 'delete':
     deleteDocument(db, function() {
 db.close()});
    break;
  case 'find':
     findDocuments(db, function() {
 db.close()});
    break;
};

});

};


exports.mdb =  mdb;


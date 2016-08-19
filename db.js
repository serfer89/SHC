var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/shc';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");




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
  collection.updateOne({ name : "sunblind" }
		     , { $set: { state : 1 }  }
		      ,{upsert: true, safe: false}
		     , function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
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
  collection.find({name : 'light'}).toArray(function(err, docs) {

    console.log("Found "+docs.length+" records");
    //console.dir(docs);
    callback(docs.length);

  });

}


 findDocuments(db, function() {
console.log(); db.close();
/*


    updateDocument(db, function() {
      deleteDocument(db, function() {
        findDocuments(db, function() {
         
        });
      });
    });
  */});
});


/*!
 * nodeSync v0.0.1
 * Author: Nathan Johnson <node@njohnson.me>
 * License: MIT Licensed
 *
 * File: app.js
 *       - Main application
 */


console.log("begin");
var dbFile = 'testFile.db';
var db = require("./lib/Database.js");

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}


function insertData() {
	var rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
	var rString2 = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
	db.insertRow('test1', {
		$pos1: rString,
		$pos2: rString2
	}, function() {
		console.log("post d insert");
		db.getAll("test1", function(err, data) {
			console.log(err);
			console.log(data);
			data.forEach(function(row) {
				console.log(row.id + ": " + row.pos2);
			});
		});
	});
}

var d = db.init(dbFile, function() {
	db.createTable("test1", "(id INTEGER PRIMARY KEY, pos1 TEXT, pos2 TEXT)", function() {
		insertData();
		console.log("table created");
	});
});
/*!
 * nodeSync v0.0.1
 * Author: Nathan Johnson <node@njohnson.me>
 * License: MIT Licensed
 *
 * File: Database.js
 *       - Wrapper for connecting to a sqlite database.
 */

var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();

var Database = function() {};

Database.prototype.init = function(databaseFile,callBack) {
	callBack = callBack || function() {};
	if (fs.existsSync(databaseFile)) {
		console.log("Database file exists, using it.");
		this.db = new sqlite3.Database(databaseFile);
		callBack();
	} else {
		console.log("Creating new database file.");
		this.createDatabase(databaseFile,callBack);
	}
};

Database.prototype.createDatabase = function(newDatabaseName, callBack) {
	callBack = callBack || function() {};
	console.log("Creating new database: " + newDatabaseName);
	this.db = new sqlite3.Database(newDatabaseName, callBack);
};

Database.prototype.createTable = function(newTableName, tableDataStructure, callBack) {
	callBack = callBack || function() {};
	console.log("Creating new table: " + newTableName);
	this._run({sql: "CREATE TABLE IF NOT EXISTS " + newTableName + " " + tableDataStructure}, callBack);
};

Database.prototype.insertRow = function(tableName, parameterizedData, callBack) {
	callBack = callBack || function() {};
	var qMarks = "";
	var first = true;
	for(var cur in parameterizedData) {
		if(!first) {
			qMarks += ',';
		} else {
			first = false;
		}
		qMarks += cur;
	}
	//sqlQ output: "insert into table(val1 ... valn) VALUES ($val1 ... $valn)"
	var sqlQ = "INSERT INTO " + tableName + "("+qMarks.replace(/\$/g, '')+") VALUES (" + qMarks + ")";
	console.log(sqlQ);
	this._run({
		sql: sqlQ,
		data: parameterizedData
	}, callBack);
};

Database.prototype.getAll = function(tableName, callBack) {
	if(typeof callBack === "undefined") {
		console.log("Programming error. getAll must have a callBack of form cb(err, data) to handle results");
	}
	var allQ = "SELECT * FROM " + tableName;
	this.db.all(allQ, function(err, rows) {
		if (err) throw err;
		return callBack(err, rows);
	});
};

Database.prototype.closeConnection = function(callBack) {
	callBack = callBack || function() {};
	if (this.db !== null)
		this.db.close(callBack);
};

/**
 * [_run - Private standardized wrapper to sqlite.run()]
 * @param  {[object]} query    [query.sql (REQ) = sql function to run. query.data = parameterized data to input.]
 * @param  {[type]} callBack [optional callback function]
 */
Database.prototype._run = function(query, callBack) {
	callBack = callBack || function() {};
	if(typeof query.sql === "undefined") {
		console.log("SQL not defined in query object in run method. Data: ");
		console.log(query);
		process.exit(-1);
	}
	if (this.db !== null) { //Database is loaded in object
		console.log( query.data);
		if(typeof query.data !== "undefined") //Data included
			this.db.run(query.sql, query.data, callBack);
		else // No data included
			this.db.run(query.sql, callBack);
	} else {
		console.log("Database is null. Query: " + query + " failed. Exiting.");
		process.exit(-1);
	}
};

module.exports = new Database();

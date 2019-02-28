
const File = require('fs')
const Utils = require('./utils')

const databaseInfoPath = "databaseInfo.json"
const root = "Databases"
var databaseInfo = []
var currentDatabase = null

function createFolder(fullPath){
	if (!File.existsSync(fullPath)){
		File.mkdirSync(fullPath)
	}
}

//		Database API
// Private:
class Database{
	constructor(name){
		this.name = name
		this.tableNames = []
		this.root = root + "/" + name
	}
}

class Table{
	constructor(name){
		this.name = name
		this.columnNames = []
		this.data = []
	}
}

function spit(string){
	console.log(string)
}

function updateCurrentDatabase(callback){
	File.writeFile(currentDatabase.root + "/info.json", JSON.stringify(currentDatabase), err => {
		if(err) spit("Something went wrong updating database: " + dbname)
		else if(callback != null) callback()
	})
}

function setupDatabase(dbname){
	createFolder(root + "/" + dbname);
	currentDatabase = new Database(dbname);
	File.writeFile(root + "/" + dbname + "/info.json", JSON.stringify(currentDatabase), err =>{
		if(err) spit("Something went wrong creating database: " + dbname)
		else spit("Database " + dbname + " created successfully!")
	})
}

function loadDatabaseInfo(callback){
	File.readFile("databaseInfo.json", "utf8", (err, content) => {
		if(err) spit("Failed to load the database info.")
		else{
			spit("NDBMS is ready!")
			databaseInfo = JSON.parse(content)
			callback()
		}
	})
}

function inquire(){
	Utils.scan(answer => {
		if(answer[0] != "?"){
			eval(answer)
		} else {
			spit("Help for " + answer.substring(1, answer.length))
			switch(answer.substring(1, answer.length)){
				case "currentDatabase": spit(currentDatabase); break;
				case "databaseInfo":
					for(let i = 0; i<databaseInfo.length; i++){
						spit(databaseInfo[i])
					}
					break;
				default: spit("Unknown command."); break;
			}
		}
		setTimeout(() => {
			inquire()
		}, 1000)
	})
}
// Public:
function help(){
	spit(databaseInfo)
	spit("\n")
	spit(currentDatabase)
}

function createDatabase(dbname){
	if(databaseInfo.includes(dbname)){
		spit("Database " + dbname + " already exists.");
	} else {
		databaseInfo.push(dbname)					// Updates the databaseInfo
		dbInfoJSON = JSON.stringify(databaseInfo)
		File.writeFile(databaseInfoPath, dbInfoJSON, err => {
			setupDatabase(dbname)
		})
	}
}

function loadDatabase(dbname){
	if(!databaseInfo.includes(dbname)){
		spit("No such database exists.")
	} else {
		File.readFile(`${root}/${dbname}/info.json`, "utf8", (err, content) => {
			if(err){
				spit(`Something went wrong retrieving info about database ${dbname}`)
			}
			currentDatabase = JSON.parse(content)
			spit(`Database ${dbname} loaded.`)
			spit(currentDatabase)
		})
	}
}

function createTable(tableName){
	if(currentDatabase.tableNames.includes(tableName)){
		spit("Table already exists.")
	} else {
		currentDatabase.tableNames.push(tableName)
		createFolder(currentDatabase.root + "/" + tableName)
		spit("Table " + tableName + " created!")
	}
}


// Init the node thingy
loadDatabaseInfo(inquire)



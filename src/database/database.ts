import mysql, { createPool, OkPacket, Pool, RowDataPacket } from 'mysql2'
import { of, Observable } from "rxjs"; 

export class Database {

  private db : Pool;
  private dbAffectedRows : boolean = false;

  public constructor(host : string, port: number, username : string, password : string, connectionSize : number) {
    this.db = createPool({
      connectionLimit: connectionSize,
      host: host,
      port: port,
      user: username,
      password: password
    })
    // this.db.connect((err) => {
    //   if(err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log("Connected to database!");
    // });
  }

  public async createDatabase (databaseName : string) : Promise<boolean> {
    const queryString = `CREATE DATABASE ${databaseName}`;
    var response = await this.db.promise().query(queryString);
    return true;
  }

  public async checkIfDatabaseExists (databaseName : string) : Promise<boolean> {
    const queryString = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}'`;
    var response = await this.db.promise().query(queryString);
    var responseDataArray = <RowDataPacket[]> response[0];
    console.log(typeof(responseDataArray[0]))
    var singleResponse = responseDataArray[0]["SCHEMA_NAME"];
    if(singleResponse == databaseName) return true; 
    return false;
  }

  
}
import mysql, { createConnection, Connection, RowDataPacket } from 'mysql2'
import { of, Observable } from "rxjs"; 

export class Database {

  private db : Connection;
  private dbAffectedRows : boolean = false;

  public constructor(host : string, port: number, username : string, password : string, connectionSize : number) {
    this.db = createConnection({
      connectionLimit: connectionSize,
      host: host,
      port: port,
      user: username,
      password: password
    })
    this.db.connect((err) => {
      if(err) {
        console.log(err);
        return;
      }
      console.log("Connected to database!");
    });
  }

  // public createDatabase (databaseName : string) : boolean {
  //   const queryString = `CREATE DATABASE ${databaseName}`;
  //   var query = this.db.query(queryString);
  //   console.log(query);
  //   const row = <RowDataPacket> query;
  //   console.log(row);
  //   return false;
  // }

public async checkIfDatabaseExists (databaseName : string) : Promise<boolean> {
    const queryString = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}'`;
    var response = await this.db.promise().query(queryString);
    var responseDataArray = <RowDataPacket[]> response[0];
    var singleResponse = responseDataArray[0]["SCHEMA_NAME"];
    if(singleResponse == databaseName) return true; 
    return false;
  }  
}
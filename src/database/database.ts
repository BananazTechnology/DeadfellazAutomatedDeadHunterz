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
  }

  public async createDatabase (databaseName : string) : Promise<boolean> {
    const queryString = `CREATE DATABASE ${databaseName}`;
    var response = await this.queryAndReturn(queryString);
    return false;
  }

  public async checkIfDatabaseExists (databaseName : string) : Promise<boolean> {
    const queryString = `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}'`;
    var response = await this.queryAndReturn(queryString);
    var singleResponse = response[0]["SCHEMA_NAME"];
    if(singleResponse == databaseName) return true; 
    return false;
  }

  public async checkIfTableExists (databaseName : string, tableName : string) : Promise<boolean> {
    const queryString = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${databaseName}' AND TABLE_NAME = '${tableName}'`;
    var response = await this.queryAndReturn(queryString);
    var singleResponse = response[0]["TABLE_NAME"];
    if(singleResponse == tableName) return true;
    return false;
  }

  // public async createTable (databaseName : string, tableName : string, tableColumns : string) : Promise<boolean> {
  //   const queryString = `CREATE TABLE ${databaseName}.${tableName} (${tableColumns})`;
  //   var response = await this.queryAndReturn(queryString);
  //   return false;
  // }

  private async queryAndReturn(queryString : string) : Promise<mysql.RowDataPacket[]> {
    var result : RowDataPacket[] = [];
    try {
      var response = await this.db.promise().query(queryString);
      result = <RowDataPacket[]> response[0];
    } catch(err : any) {
      console.log(`Failed to query database: ${JSON.stringify(err.sqlMessage)}`);
    }
    return result;
  }

  private successfulQuery(response : any) : boolean {
    console.log(response);
    if(response === undefined) return false;
    if(response.affectedRows === undefined) return false;
    if(response.affectedRows > 0) return true;
    return false
  }
}
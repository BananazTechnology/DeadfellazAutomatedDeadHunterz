import mysql, { createPool, Pool, RowDataPacket } from 'mysql2'

export class Database {

  private db : Pool;

  public constructor (host : string, port: number, username : string, password : string, connectionSize : number) {
    this.db = createPool({
      connectionLimit: connectionSize,
      host: host,
      port: port,
      user: username,
      password: password
    })
  }


  public createDatabase (databaseName : string) : void {
    this.db.query(`CREATE DATABASE ${databaseName}`, (err, result) => {
      if (err) {
        console.log(err)
      }
    })
  }

  public checkIfDatabaseExists (databaseName : string) : boolean {
    this.db.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}'`, (err, result) => {
      if (err) {
        console.log(err)
        return false
      }
      if(result) {
        const rows = <RowDataPacket[]> result;
        if(rows.length > 0) return true
      }
      return false
    })
  }

  
}
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
    var a = this.db.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${databaseName}'`)
    a.on('result', (row : RowDataPacket) => {
      if (row.length == 0) {
        return false
      } else {
        return true
      }
    })
    return false
  }

  
}
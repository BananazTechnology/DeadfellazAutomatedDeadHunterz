import { Config } from "src/classes/config";
import { Database } from "src/database/database";

export class HeadhunterUtils {

  public static getPlayerLastEntry(userId : string, config: Config, db : Database) : Date {
    var result = db.selectFromTable(config.getDBName(), config.getEntriesTableName(), "Created", `UserId = '${userId}'`, "Created DESC", 1);
    console.log(`Result: ${JSON.stringify(result)}`);
    return new Date();
  }
}
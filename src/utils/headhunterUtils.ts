import { Config } from "src/classes/config";
import { Database } from "src/database/database";

export class HeadhunterUtils {

  public static async getPlayerLastEntry(userId : string, config: Config, db : Database) : Promise<Date> {
    let result = await db.selectFromTable(config.getDBName(), config.getEntriesTableName(), "Created", `UserId = '${userId}'`, "Created DESC", 1);
    if(result.length == 0) return new Date(0);
    return new Date(result[0].Created * 1000);
  }
}
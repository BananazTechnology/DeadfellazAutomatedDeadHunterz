import { Database } from "../database/database";

export class Entry {
    // Object data settings
    private TABLE_NAME: string;
    private DB_NAME: string;
    private db : Database;
    private TABLE_ORDER = `UserId, Answer, Created, Wallet, Winner`;
    // Object properties
    private userId: string;
    private gameUuid: string;
    private answer? : string;
    private created? : string;
    private wallet? : string;
    private winner? : boolean;

    public constructor (dbName: string, tableName : string, db : Database, userId : string, 
                        gameUuid : string, answer? : string, wallet? : string, winner? : boolean) {

        this.TABLE_NAME = tableName;
        this.DB_NAME = dbName;
        this.db = db;
        this.userId = userId;
        this.gameUuid = gameUuid;
        if(answer) this.answer = answer;
        // TODO: set created to creent tie
        this.created = (new Date().getTime() / 1000).toString();
        if(wallet) this.wallet = wallet;
        if(winner) this.winner = winner;
    }

    // Setters
    public setAnswer(answer : string) : void {
        this.answer = answer;
    }
    public setCreated(created : string) : void {
        this.created = created;
    }
    public setWallet(wallet : string) : void {
        this.wallet = wallet;
    }
    public setWinner(winner : boolean) : void {
        this.winner = winner;
    }

    // Save
    public async save() : Promise<boolean> {
        if(!this.answer || !this.created || !this.wallet || !this.winner) return false;
        this.db.insertIntoTable(this.DB_NAME, this.TABLE_NAME, this.TABLE_ORDER, 
            `'${this.userId}', '${this.gameUuid}', '${this.answer}', '${this.created}', '${this.wallet}', '${this.winner ? 1 : 0}'`);
        return true;
    }
  }
  
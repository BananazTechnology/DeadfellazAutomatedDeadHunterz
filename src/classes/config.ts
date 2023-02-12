import { Database } from "src/database/database";

export class Config {
    // Object data settings
    private TABLE_NAME: string;
    private DB_NAME: string;
    private db : Database;
    private TABLE_ORDER = `GameUuid, GameChannelId, GameCommand, CommandCooldown, StartTime, Answers, Answered`;
    private TABLE_DEFINITION = `
        ConfigId INT NOT NULL AUTO_INCREMENT,
        GameUuid VARCHAR(255) NOT NULL,
        GameChannelId VARCHAR(255) NOT NULL,
        GameCommand VARCHAR(255) NOT NULL,
        CommandCooldown INT NOT NULL,
        StartTime VARCHAR(255) NOT NULL,
        Answers VARCHAR(255) NOT NULL,
        Answered INT NOT NULL,
        PRIMARY KEY (ConfigId)
    `;
    // Object properties
    private configId: number;
    private gameUuid?: string;
    private gameChannelId?: string;
    private gameCommand?: string;
    private commandCooldown?: number;
    private startTime?: string;
    private answers?: string[];
    private answered?: number;

    public constructor (configId : number, dbName: string, tableName : string, db : Database) {
        this.configId = configId;
        this.TABLE_NAME = tableName;
        this.DB_NAME = dbName;
        this.db = db;
    }

    // Getters
    public getConfigId() : number {
        return this.configId
    }
    public getGameUuid() : string {
        return this.gameUuid ? this.gameUuid : ""
    }
    public getGameChannelId() : string {
        return this.gameChannelId ? this.gameChannelId : ""
    }
    public getGameCommand() : string {
        return this.gameCommand ? this.gameCommand : ""
    }
    public getCommandCooldown() : number {
        return this.commandCooldown ? this.commandCooldown : 0
    }
    public getStartTime() : string {
        return this.startTime ? this.startTime : ""
    }
    public getAnswers() : string[] {
        return this.answers ? this.answers : []
    }
    public getAnswered() : number {
        return this.answered ? this.answered : 0
    }

    // Setters
    public setGameUuid(uuid : string) : void {
        this.gameUuid = uuid
    }
    public setGameChannelId(channelId : string) : void {
        this.gameChannelId = channelId
    }
    public setGameCommand(command : string) : void {
        this.gameCommand = command
    }
    public setCommandCooldown(cooldown : number) : void {
        this.commandCooldown = cooldown
    }
    public setStartTime(startTime : string) : void {
        this.startTime = startTime
    }
    public setAnswers(answers : string[]) : void {
        //TODO: convert from string array to csv
        this.answers = answers
    }
    public setAnswered(answered : number) : void {
        this.answered = answered
    }

    private writeObject(columnName : string, value : string) : void {
        // this.db.update(this.TABLE_DEFINITION, this.configId, columnName, value)
    }
    public async readObject() : Promise<Config> {
        var response = await this.db.selectFromTable(this.DB_NAME, this.TABLE_NAME, this.TABLE_ORDER, `ConfigId = ${this.configId}`);
        console.log(response);
        return this;
    }
  }
  
import { Client } from 'discord.js';
import { EventMessage } from '../classes/eventMessage';
import { Database } from '../database/database';
import { BufferedOutput } from '../util/bufferedOutput';
import { DiscordUtils } from '../util/discordUtils';

export class Headhunter {

  private db!: Database;
  private output : BufferedOutput;
  private gameChannelId!: string;
  private gameName!: string;
  private gameCommand!: string;
  private discordUtils: DiscordUtils;

  public constructor (client : Client, env : NodeJS.ProcessEnv) {
    this.discordUtils = new DiscordUtils(client);
    this.output = new BufferedOutput(this.discordUtils);
    // this.loadGame(env);
  }
  
  public async loadGame(env : NodeJS.ProcessEnv) {
    console.log(`Starting load of Headhunter game data...`);
    if(env.DB_HOST == undefined || env.DB_PORT == undefined || env.DB_NAME == undefined ||
      env.DB_USER == undefined || env.DB_PWD == undefined || env.DB_CONN_SIZE == undefined) {
      console.log("Missing database connection information. Please check the env.");
      return;
    }
    this.db = new Database(env.DB_HOST, parseInt(env.DB_PORT), env.DB_USER, env.DB_PWD, parseInt(env.DB_CONN_SIZE));
    await this.db.createDatabase(env.DB_NAME)
    if(!await this.db.checkIfDatabaseExists(env.DB_NAME)) await this.db.createDatabase(env.DB_NAME);

    this.gameChannelId = '1073973649826140180';
    this.gameName = 'Headhunter';
    this.gameCommand = 'headhunter';
  }

  // getters
  public getGameChannelId() : string {
    return this.gameChannelId;
  }

  public getGameCommand() : string {
    return this.gameCommand;
  }

  // interaction handler
  public play(eventMessage : EventMessage) : boolean {
    return false;
    // check if game is running
    // check if user is in game
    // check if user has already played
    // check if user has enough points
    // check if user has enough time
    // check if user has enough health
    // check if user has enough energy
    // check if user has enough ammo
    // check if user has enough grenades
    // check if user has enough rockets
    // check if user has enough missiles
    // check if user has enough bombs
    // check if user has enough mines
    // check if user has enough traps
    // check if user has enough decoys
    // check if user has enough smoke
    // check if user has enough flash
    // check if user has enough gas
    // check if user has enough acid
    // check if user has enough fire
    // check if user has enough water
    // check if user has enough ice
    // check if user has enough lightning
    // check if user has enough wind
    // check if user has enough earth
    // check if user has enough gravity
    // check if user has enough dark
    // check if user has enough light
    // check if user has enough magic
    // check if user has enough science
    // check if user has enough technology
    // check if user has enough engineering
    // check if user has enough math
    // check if user has enough physics
    // check if user has enough chemistry
    // check if user has enough biology
    // check if user has enough anatomy
    // check if user has enough medicine
    // check if user has enough psychology
    // check if user has enough sociology
    // check if user has enough history
    // check if user has enough philosophy
    // check if user has enough religion
    // check if user has enough politics
    // check if user has enough economics
    // check if user has enough law
    // check if user has enough business
    // check if user has enough finance
    // check if user has enough marketing
    // check if user has enough advertising
    // check if user has enough sales
    // check if user has enough management
    // check if user has enough leadership
    // check if user has enough communication
    // check if user has enough

  }
}
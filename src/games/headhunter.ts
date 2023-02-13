import { Client } from 'discord.js';
import { Config } from '../classes/config';
import { EventMessage } from '../classes/eventMessage';
import { Database } from '../database/database';
import { BufferedOutput } from '../util/bufferedOutput';
import { DiscordUtils } from '../util/discordUtils';

export class Headhunter {
  installGame(env: NodeJS.ProcessEnv) {
    throw new Error('Method not implemented.');
  }

  private db!: Database;
  //TODO: frequestly update this from db
  private config!: Config;
  private output : BufferedOutput;
  private gameChannelId!: string;
  private gameName!: string;
  private gameCommand!: string;
  private discordUtils: DiscordUtils;

  public constructor (client : Client) {
    this.discordUtils = new DiscordUtils(client);
    this.output = new BufferedOutput(this.discordUtils);
  }
  
  public async loadGame(env : NodeJS.ProcessEnv) {
    console.log(`Starting load of Headhunter game data...`);
    if(env.DB_HOST == undefined || env.DB_PORT == undefined || env.DB_NAME == undefined ||
      env.DB_USER == undefined || env.DB_PWD == undefined || env.DB_CONN_SIZE == undefined ||
      env.CONFIG_TABLE_NAME == undefined || env.CONFIG_ID == undefined) {
      console.log("Missing game information. Exiting...");
      return;
    }
    this.db = new Database(env.DB_HOST, parseInt(env.DB_PORT), env.DB_USER, env.DB_PWD, parseInt(env.DB_CONN_SIZE));
    if(!await this.db.checkIfTableExists(env.DB_NAME, env.CONFIG_TABLE_NAME)) {
      console.log("No DB/table configured with that name. Exiting..."); 
      return;
    }
    this.config = new Config(parseInt(env.CONFIG_ID), env.DB_NAME, env.CONFIG_TABLE_NAME, this.db);
    await this.updateConfigAndInMemoryValues();
    console.log(`Loaded Headhunter game data.`);
  }

  private async updateConfigAndInMemoryValues() {
    var configFetched = await this.config.readObject();
    this.gameChannelId = configFetched.getGameChannelId();
    this.gameName = configFetched.getGameUuid();
    this.gameCommand = configFetched.getGameCommand();
  }

  // getters
  public getGameChannelId() : string {
    return this.gameChannelId;
  }

  public getGameCommand() : string {
    return this.gameCommand;
  }

  private entryGatekeeper(eventMessage : EventMessage) : boolean {
    eventMessage.setOutboundMessage(`<@${eventMessage.getUser()}> You are not allowed to play this game.`);
    return false;
  }

  // interaction handler
  public async play(eventMessage : EventMessage) : Promise<boolean> {
    await this.updateConfigAndInMemoryValues(); 
    // ensure user is allowed to play
    // TODO: gatekeeper
    var allowedToPlay = this.entryGatekeeper(eventMessage)
    // parse the inbound message
    var answer = this.parseAnswer(eventMessage.getInboundMessage());
    // check if the answer string is in the configs answer list
    if(this.config.getAnswers().includes(answer) && allowedToPlay) {
      if(!this.config.getAnswered().includes(answer)) {
        // remove the answer from available options
        this.config.addAnswered(answer);
        // player has a proper guess
        // TODO: generate proper win message
        eventMessage.setOutboundMessage(`<@${eventMessage.getUser()}> You win!`);
      } else {
        eventMessage.setOutboundMessage(`<@${eventMessage.getUser()}> That answer has been guessed already!`);
      }
    }
    this.output.addEventMessage(eventMessage);
    console.log(JSON.stringify(eventMessage))
    return true;
  }

  private parseAnswer(command : string) : string {
    // split the message by a space for command:answer
    var messageSplit = command.split(" ");
    // get answer
    var answer = messageSplit[1];
    return answer;
  }
}
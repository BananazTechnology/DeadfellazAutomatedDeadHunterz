import { Client } from 'discord.js';
import { HeadhunterUtils } from '../utils/headhunterUtils';
import { Config } from '../classes/config';
import { EventMessage } from '../classes/eventMessage';
import { Database } from '../database/database';
import { BufferedOutput } from '../schedulers/bufferedOutput';
import { DiscordUtils } from '../utils/discordUtils';
import { Entry } from '../classes/entry';
import { TimeUtils } from '../utils/timeUtils';
import { UserUtils } from '../utils/userUtils';
import { GameEnd } from '../schedulers/gameEnd';
import { GameStart } from '../schedulers/gameStart';

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
  private userUtils!: UserUtils;

  public constructor (client : Client) {
    this.discordUtils = new DiscordUtils(client);
    this.output = new BufferedOutput(this.discordUtils);
  }
  
  public async loadGame(env : NodeJS.ProcessEnv) {
    console.log(`Starting load of Headhunter game data...`);
    // Ensure we have all ENV
    if(env.DB_HOST == undefined || env.DB_PORT == undefined || env.DB_NAME == undefined ||
      env.DB_USER == undefined || env.DB_PWD == undefined || env.DB_CONN_SIZE == undefined ||
      env.CONFIG_TABLE_NAME == undefined || env.CONFIG_ID == undefined || env.USER_API_URL == undefined || 
      env.USER_API_KEY == undefined) {

      console.log("Missing game information. Exiting...");
      return;
    }
    // Start the DB
    this.userUtils = new UserUtils(env.USER_API_URL, env.USER_API_KEY);
    this.db = new Database(env.DB_HOST, parseInt(env.DB_PORT), env.DB_USER, env.DB_PWD, parseInt(env.DB_CONN_SIZE));
    if(!await this.db.checkIfTableExists(env.DB_NAME, env.CONFIG_TABLE_NAME)) {
      console.log("No DB/table configured with that name. Exiting..."); 
      return;
    }
    // Map internal Config object from TB table
    this.config = new Config(parseInt(env.CONFIG_ID), env.DB_NAME, env.CONFIG_TABLE_NAME, this.db);
    await this.updateConfigAndInMemoryValues();
    // Startup the proper end/start scheduler
    (this.config.isGameRunning()) ? 
      new GameEnd(this.discordUtils, this.config) : 
        new GameStart(this.discordUtils, this.config);
    console.log(`Loaded Headhunter game data.`);
  }

  private async updateConfigAndInMemoryValues() {
    let configFetched = await this.config.readObject();
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

  private async entryGatekeeper(eventMessage : EventMessage) : Promise<boolean> {
    // Ensure player has profile
    let userHasProfile = await this.userUtils.getUserWalletByDiscordId(eventMessage.getUser());
    if(!userHasProfile) {
      eventMessage.setOutboundMessage(`<@${eventMessage.getUser()}> You need to register a profile with \`!user <wallet>\`.`);
      return false;
    }
    eventMessage.setWallet(userHasProfile);
    // Ensure game is active
    let gameActive = (Math.floor(new Date().getTime() / 1000)) > this.config.getStartTime();
    if(!gameActive) {
      eventMessage.setOutboundMessage(`<@${eventMessage.getUser()}> Game is not active.`);
      return false;
    }

    // Ensure player not on cooldown
    let playerLastEntry = await HeadhunterUtils.getPlayerLastEntry(eventMessage.getUser(), this.config, this.db);
    // console.log(`Timout ${TimeUtils.diff(new Date(), playerLastEntry) < this.config.getCommandCooldown()}`)
    if(TimeUtils.diff(new Date(), playerLastEntry) < this.config.getCommandCooldown()) {
      eventMessage.setOutboundMessage(`<@${eventMessage.getUser()}> You have played too recently. Try again <t:${Math.floor(playerLastEntry.getTime() / 1000) + this.config.getCommandCooldown()}:R>.`);
      return false;
    }
    return true;
  }

  // interaction handler
  public async play(eventMessage : EventMessage) : Promise<boolean> {
    await this.updateConfigAndInMemoryValues(); 
    // ensure user is allowed to play
    let allowedToPlay = await this.entryGatekeeper(eventMessage)
    if(!allowedToPlay) {
      this.output.addEventMessage(eventMessage);
      return true;
    }
    // parse the inbound message
    let answer = this.parseAnswer(eventMessage.getInboundMessage());
    let entry : Entry = new Entry(
      this.config.getDBName(), 
      this.config.getEntriesTableName(), 
      this.db, 
      eventMessage.getUser(),
      this.config.getGameUuid(),
      answer,
      eventMessage.getWallet()
    );
    // check if the answer string is in the configs answer list
    if(this.config.getAnswers().includes(answer) && allowedToPlay) {
      if(!this.config.getAnswered().includes(answer)) {
        // remove the answer from available options
        this.config.addAnswered(answer);
        entry.setWinner(true);
        // player has a proper guess
        // TODO: generate proper win message
        eventMessage.setOutboundMessage(`<@${eventMessage.getUser()}> You win!`);
      } else {
        eventMessage.setOutboundMessage(`<@${eventMessage.getUser()}> That answer has been guessed already!`);
      }
    } else {
      // player has a bad guess
      eventMessage.setOutboundMessage(`<@${eventMessage.getUser()}> You guessed incorrectly!`);
    }
    entry.save();
    this.output.addEventMessage(eventMessage);
    return true;
  }

  private parseAnswer(command : string) : string {
    // split the message by a space for command:answer
    let messageSplit = command.split(" ");
    // get answer
    let answer = messageSplit[1];
    return answer;
  }
}
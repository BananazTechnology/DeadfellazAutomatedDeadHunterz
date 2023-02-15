import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';
import { Config } from '../classes/config';
import { EventMessage } from '../classes/eventMessage';
import { GameEnd } from './gameEnd';

export class GameStart {
  private discUtils : DiscordUtils;
  private cronJob: CronJob;
  private config : Config;
  private whenToRun : string = "* * * * * *";

  public constructor (discUtils : DiscordUtils, conf : Config) {
    this.discUtils = discUtils;
    this.config = conf;
    this.cronJob = new CronJob(
      this.whenToRun, 
      this.send, 
      undefined, 
      undefined, 
      "America/New_York", 
      this
    );
    this.cronJob.start()
    console.log(`Starting new GameStart on interval ${this.whenToRun}`);
  }

  private async send() {
    //TODO: Wait for start time to be before now and continue if so
    var gameActive = (Math.floor(new Date().getTime() / 1000)) > this.config.getStartTime();
    if(!gameActive) return;
    // TODO: Set game on
    this.config.setGameRunning(true);
    //TODO: Grab NFTs
    //TODO: Use AI to generate hints
    //TODO: Write hints to Discord to indicate the game started
    var evntMsg : EventMessage = 
      new EventMessage(
        this.config.getGameChannelId(),
        undefined,
        `@everyone The game has started!`,
        undefined,);
    this.discUtils.sendEventMessage(evntMsg);
    // TODO: Start new GameEnd listener
    new GameEnd(this.discUtils, this.config);
    //TODO: Stop this.cronJob
    this.cronJob.stop();
  }

}
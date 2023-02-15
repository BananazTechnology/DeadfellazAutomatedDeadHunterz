import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';
import { Config } from '../classes/config';

export class GameEnd {
  private sender : DiscordUtils;
  private cronJob: CronJob;
  private config : Config;
  private whenToRun : string = "* * * * * *";

  public constructor (sender : DiscordUtils, conf : Config) {
    this.sender = sender;
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
    console.log(`Starting new GameEnd on interval ${this.whenToRun}`);
  }

  private async send() {
    // TODO: Check if all answers have been guessed and only continue if so
    //TODO: Generate new start time and save to DB
    //TODO: Thank the players
    //TODO: Start new GameStart listener
    //TODO: Stop this.cronJob
  }

}
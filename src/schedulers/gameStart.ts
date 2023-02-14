import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';
import { Config } from '../classes/config';

export class GameStart {
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
    console.log(`Starting new GameStart on interval ${this.whenToRun}`);
  }

  private async send() {
    //TODO: Wait for start time to be before now and continue if so
    //TODO: Generate new numbers and save to DB
    //TODO: Grab NFTs
    //TODO: Use AI to generate hints
    //TODO: Write hints to Discord to indicate the game started 
    // TODO: Start new GameEnd listener
  }

}
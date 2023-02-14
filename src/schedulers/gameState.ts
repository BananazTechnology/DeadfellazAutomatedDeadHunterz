import { EventMessage } from '../classes/eventMessage';
import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';

export class GameState {
  private sender : DiscordUtils;
  private cronJob: CronJob;
  private whenToRun : string = "* * * * * *";

  public constructor (sender : DiscordUtils) {
    this.sender = sender;
    this.cronJob = new CronJob(
      this.whenToRun, 
      this.send, 
      undefined, 
      undefined, 
      "America/New_York", 
      this
    );
    this.cronJob.start()
    console.log(`Starting new BufferedOutput on interval ${this.whenToRun}`);
  }

  private async send() {
    // generate hints from the answers
    // send hints to discord
    var outboundBufferedObj = new EventMessage();
    outboundBufferedObj.setOutboundMessage("Hello World");
    this.sender.sendEventMessage(outboundBufferedObj);
  }

}
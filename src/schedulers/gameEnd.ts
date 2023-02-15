import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';
import { Config } from '../classes/config';
import { v6 as uuidv6 } from 'uuid';


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
    var allAnswered = (this.config.getAnswers().length == this.config.getAnswered().length);
    if(!allAnswered) return;
    // TODO: set game off
    this.config.setGameRunning(false);
    // TODO: Guess new answers
    var newAnswers : string[] = [];
    for(var i = 0; i < this.config.getAnswersToGenerate(); i++) {
      var rand : number = 
        Math.floor(Math.random() * (this.config.getMax() - this.config.getMin() + 1) + this.config.getMin());
      var randAsString : string = rand.toString();
      newAnswers.push(randAsString);
    }
    this.config.setAnswers(newAnswers);
    // TODO: Guess new game UUID
    var newUuid : string = uuidv6();
    //TODO: Generate new start time and save to DB
    //TODO: Thank the players
    //TODO: Start new GameStart listener
    //TODO: Stop this.cronJob
  }

}
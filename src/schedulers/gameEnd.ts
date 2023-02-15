import { CronJob } from 'cron';
import { DiscordUtils } from '../utils/discordUtils';
import { Config } from '../classes/config';
import { EventMessage } from '../classes/eventMessage';
import { GameStart } from './gameStart';

export class GameEnd {
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
    console.log(`Starting new GameEnd on interval ${this.whenToRun}`);
  }

  private async send() {
    // Check if all answers have been guessed and only continue if so
    var allAnswered = (this.config.getAnswers().length == this.config.getAnswered().length);
    if(!allAnswered) return;
    // set game off
    this.config.setGameRunning(false);
    // Guess new answers
    var newAnswers : string[] = [];
    for(var i = 0; i < this.config.getAnswersToGenerate(); i++) {
      var rand : number = 
        Math.floor(Math.random() * (this.config.getMax() - this.config.getMin() + 1) + this.config.getMin());
      var randAsString : string = rand.toString();
      newAnswers.push(randAsString);
    }
    this.config.setAnswered([]);
    this.config.setAnswers(newAnswers);
    // Guess new game UUID
    var newUuid : string = crypto.randomUUID();
    this.config.setGameUuid(newUuid);
    // Generate new start time and save to DB
    var timeIncrease = (24 * 60 * 60); // 24hrs in seconds
    var previousStartTime = this.config.getStartTime();
    this.config.setStartTime(previousStartTime + timeIncrease);
    // Thank the players
    var evntMsg : EventMessage = 
      new EventMessage(
        this.config.getGameChannelId(),
        undefined,
        `@everyone Thank you for playing!`,
        undefined,);
    this.discUtils.sendEventMessage(evntMsg);
    // Start new GameStart listener
    new GameStart(this.discUtils, this.config);
    // Stop this.cronJob
    this.cronJob.stop();
  }

}
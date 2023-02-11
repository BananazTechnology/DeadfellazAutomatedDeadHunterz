import { EventMessage } from 'src/classes/eventMessage';
import { BufferedOutput } from 'src/util/bufferedOutput';
import { MessageSender } from 'src/util/messageSender';

export class Headhunter {

  private output : BufferedOutput;
  private gameChannelId : string;
  private gameName : string;
  private gameCommand : string;

  public constructor (sender : MessageSender) {
    var output = new BufferedOutput(sender);
    this.output = output;
    console.log(`Starting new Headhunter game...`);
    
    // load game config from db
    // load game channel id
    // load game name
    this.gameChannelId = '123456789';
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
  public play(eventMessage : EventMessage) {

  }
}
import { EventMessage } from 'src/classes/eventMessage';
import { CronJob } from 'cron';
import { MessageSender } from 'src/util/messageSender';

export class BufferedOutput {
  private sender : MessageSender;
  private buffer : EventMessage[] = [];
  private cronJob: CronJob;
  private whenToRun : string = "* * * * * *";
  private maxBufferSize : number = 7;

  public constructor (sender : MessageSender) {
    this.sender = sender;
    this.cronJob = new CronJob(this.whenToRun, this.compileAndSendBatch);
    console.log(`Starting new BufferedOutput on interval ${this.whenToRun}`);
  }

  // Accept a new EventMessage and store in the buffer
  public addEventMessage (eventMessage : EventMessage) {
    this.buffer.push(eventMessage);
  }

  private async compileAndSendBatch() {
    console.log("hi");
    var bufferSize = this.buffer.length;
    var finalOutputMessage = "";
    var outboundBufferedObj = new EventMessage();
    for (var i = 0; (i < bufferSize); i++) {
			if(i < this.maxBufferSize) {
        const eventMessage = this.buffer.shift();
        if(!eventMessage) break;
        finalOutputMessage += `${eventMessage.getOutboundMessage()}\n\n`;
        outboundBufferedObj.setChannel(eventMessage.getChannel());
      } else break;
    }
    outboundBufferedObj.setOutboundMessage(finalOutputMessage);
    this.sender.sendEventMessage(outboundBufferedObj);
  }

}
import { Client } from 'discord.js'
import { EventMessage } from 'src/classes/eventMessage';
import { DiscordUtil } from 'src/util/discordUtil';

export class MessageSender {
  // User attributes. Should always be private as updating information will need to be reflected in the db
  private discord : Client;

  public constructor (discord : Client) {
    this.discord = discord;
  }

  public sendEventMessage(eventMessage : EventMessage) {
    DiscordUtil.sendToOne(this.discord, eventMessage.getChannel(), eventMessage.getOutboundMessage().toString());
  }
}
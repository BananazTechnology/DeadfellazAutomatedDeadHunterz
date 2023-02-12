import { Client, Message } from 'discord.js'
import * as dotenv from 'dotenv'
import path from 'path'
import ready from './hooks/ready'
import { Headhunter } from './games/headhunter'
import { StringUtils } from './util/stringUtils'
import { EventMessage } from './classes/eventMessage'

dotenv.config({ path: path.resolve('./.env') })
const token = process.env.DSCRD_BOT_TK

console.log('Bot is starting...')

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS']
})

ready(client)

client.login(token)

// Start game
var headhunter = new Headhunter(client);
headhunter.loadGame(process.env).then(() => {
  var gameChannelId = headhunter.getGameChannelId();
  var gameCommand = headhunter.getGameCommand();
  console.log("Listening for messages in game channel " + gameChannelId + " with command " + gameCommand)

  client.on('messageCreate', message => {

    if (message.author.id === client.user?.id) return
    if (message.channelId === gameChannelId) {

      var cleanMessage = message.content.trim().toLowerCase();
      console.log("Message received in game channel from " + message.author.username + ": " + cleanMessage)
      var messageMatched = StringUtils.startsWith(cleanMessage, gameCommand);
      var messageWithoutCommand = cleanMessage.replace(`${gameCommand.toLowerCase()}`, "").trim();
      console.log("Message: " + messageWithoutCommand)

      if (messageMatched && messageWithoutCommand.length > 0) {
        console.log("Message matched game command check")
        var eventMessage = new EventMessage(message.channelId, message.author.id, undefined, cleanMessage);
        headhunter.play(eventMessage).then((state) => {
          if(state) message.react('✅');
          console.log("Message processed by game")
        });
      } else {
        message.react('❌');
        console.log("Message did not match game command check")
      }
    }
  })
});
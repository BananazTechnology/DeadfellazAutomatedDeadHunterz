import { Client, Message } from 'discord.js'
import { MessageSender } from 'src/util/messageSender'
import { BufferedOutput } from 'src/util/bufferedOutput'
import * as dotenv from 'dotenv'
import path from 'path'
import ready from './hooks/ready'
import { Headhunter } from 'src/games/headhunter'
import { StringUtils } from 'src/util/stringUtils'
import { EventMessage } from 'src/classes/eventMessage'

dotenv.config({ path: path.resolve('./.env') })
const token = process.env.DSCRD_BOT_TK

console.log('Bot is starting...')

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS']
})

ready(client)

client.login(token)

// Start discord message sender
var messageSender = new MessageSender(client);
// Start game
var headhunter = new Headhunter(messageSender, process.env);
var gameChannelId = headhunter.getGameChannelId();
var gameCommand = headhunter.getGameCommand();
  // pass message sender - game creates own queue system
  // db connection
// listen here for new input and run the game for the user
console.log("Listening for messages in game channel " + gameChannelId + " with command " + gameCommand)
client.on('messageCreate', message => {
  if (message.author.id === client.user?.id) return
  if (message.channelId === gameChannelId) {
    console.log("Message received in game channel from " + message.author.username + ": " + message.content)
    if (StringUtils.startsWith(message.content, gameCommand)) {
      console.log("Message matched game command check")
      var eventMessage = new EventMessage(message.channelId, message.author.id, message.content);
      var response = headhunter.play(eventMessage);
      if(response) message.react('✅');
      console.log("Message processed by game")
    } else {
      message.react('❌');
      console.log("Message did not match game command check")
    }
  }
})

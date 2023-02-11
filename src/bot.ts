import { Client, Message } from 'discord.js'
import { MessageSender } from 'src/util/messageSender'
import { BufferedOutput } from 'src/util/bufferedOutput'
import * as dotenv from 'dotenv'
import path from 'path'
import interactionCreate from './hooks/interactionCreate'
import ready from './hooks/ready'
import { Headhunter } from 'src/games/headhunter'
import { StringUtils } from 'src/util/stringUtils'

dotenv.config({ path: path.resolve('./config.env') })
const token = process.env.DSCRD_BOT_TK

console.log('Bot is starting...')

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS']
})

ready(client)
interactionCreate(client)

client.login(token)

// Start discord message sender
var messageSender = new MessageSender(client);
// Start game
var headhunter = new Headhunter(messageSender);
var gameChannelId = headhunter.getGameChannelId();
var gameCommand = headhunter.getGameCommand();
  // pass message sender - game creates own queue system
  // db connection
// listen here for new input and run the game for the user
client.on('messageCreate', message => {
  if (message.author.id === client.user?.id) return
  if (message.channelId === gameChannelId) {
    // validate message starts with gameCommand
    if (StringUtils.startsWith(message.content, gameCommand)) {
      // run game
      // headhunter.play(message);
    }
  }
})

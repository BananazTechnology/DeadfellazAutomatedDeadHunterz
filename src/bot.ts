import { Client, Message } from 'discord.js'
import * as dotenv from 'dotenv'
import path from 'path'
import interactionCreate from './hooks/interactionCreate'
import ready from './hooks/ready'

dotenv.config({ path: path.resolve('./config.env') })
const token = process.env.DSCRD_BOT_TK

console.log('Bot is starting...')

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_MEMBERS', 'GUILD_MESSAGE_REACTIONS']
})

ready(client)
interactionCreate(client)

client.login(token)
client.on('messageCreate', message => {
  if (message.channelId === process.env.GAME_CHANNEL) {
    exampleMethod(message)
  }
})

function exampleMethod (message : Message) {
  console.log(message.content)
}

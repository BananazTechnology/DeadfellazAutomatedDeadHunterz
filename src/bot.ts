import { Client, Message } from 'discord.js'
import * as dotenv from 'dotenv'
import path from 'path'
import interactionCreate from './hooks/interactionCreate'
import ready from './hooks/ready'
import { User } from './classes/user'

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
  if (message.author.id === client.user?.id) return
  if (message.channelId === process.env.GAME_CHANNEL) {
    target(message)
  }
})

async function target (message: Message) {
  const text = message.content.toLowerCase().replace(/\s\s+/g, ' ').split(' ')
  const command = text[0]
  if (command === '!target') {
    const user = await User.getByDiscordId(message.author.id)
    if (user) {
      message.channel.send('Test worked!')
      // continue
    } else {
      // redirect to make an account
    }
    // check if user has created an account
  } else {
    // thumbs down
  }
  console.log(message.content)
}

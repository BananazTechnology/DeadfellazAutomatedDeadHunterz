import { Client, Message } from 'discord.js'
import * as dotenv from 'dotenv'
import path from 'path'
import ready from './hooks/ready'
import { Headhunter } from './games/headhunter'
import { StringUtils } from './utils/stringUtils'
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
let headhunter = new Headhunter(client);
headhunter.loadGame(process.env).then(() => {
  let gameChannelId = headhunter.getGameChannelId();
  let gameCommand = headhunter.getGameCommand();
  console.log("Listening for messages in game channel " + gameChannelId + " with command " + gameCommand)

  client.on('messageCreate', message => {

    if (message.author.id === client.user?.id) return
    if (message.channelId === gameChannelId) {
      // General message cleanup
      let cleanMessage = message.content.trim().toLowerCase();
      let matchedGameCmd = StringUtils.startsWith(cleanMessage, gameCommand);
      let msgWOGameCommand = cleanMessage.replace(`${gameCommand.toLowerCase()}`, "").trim();
      let matchedLeaderboardCmd = StringUtils.startsWith(cleanMessage, "!leaderboard");
      console.log("Message received in game channel from " + message.author.username + ": " + cleanMessage)
      console.log("Message: " + msgWOGameCommand)

      // Check for game command
      if (matchedGameCmd && msgWOGameCommand.length > 0) {
        console.log("Message matched game command check")
        let eventMessage = new EventMessage(message.channelId, message.author.id, undefined, cleanMessage);
        headhunter.play(eventMessage).then((state) => {
          if(state) message.react('✅');
          console.log("Message processed by game")
        });
      }
      // Check if leaderboard
      if (matchedLeaderboardCmd) {
        console.log("Message matched leaderboard command check")
        let eventMessage = new EventMessage(message.channelId, message.author.id, undefined, cleanMessage);
        headhunter.leaderboard(eventMessage).then((state) => {
          if(state) message.react('✅');
          console.log("Message processed by leaderboard")
        });
      }
    }
  })
});
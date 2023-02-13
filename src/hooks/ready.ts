import { Client } from 'discord.js'

export default (client: Client): void => {
  client.on('ready', async () => {
    if (!client.user || !client.application) {
      return
    }
    console.log("------")
    console.log(`${client.user.username} is online`)
    // console.log(`If you need to invite this bot to your server use ${client.generateInvite()}`)
    console.log("------")
  })
}

import { BaseCommandInteraction, Client, MessageEmbed, MessageOptions, MessagePayload, TextChannel } from 'discord.js'

export class DiscordUtil {
  // will keep adding fields to an embed. When out of room, adds another embed to the arry of embeds
  static embedLargeListBuilder (embedArray: MessageEmbed[], name: string, value: string, inline: boolean|undefined): MessageEmbed[] {
    if (embedArray[embedArray.length - 1].fields.length < 25) {
      embedArray[embedArray.length - 1].addField(name, value, inline)
    } else {
      const embed = new MessageEmbed()
        .setColor('#0099ff').addField('- - - - - - - - - - - - - - - - - - - - - - - - - - - - Cont. - - - - - - - - - - - - - - - - - - - - - - - - - - - -', '\u200B', false)
      embed.addField(name, value, inline)
      embedArray.push(embed)
    }

    return embedArray
  }

  static getOption (interaction: BaseCommandInteraction, name: string) {
    try {
      const option = interaction.options.get(name)
      if (option) {
        return option.value
      } else {
        return undefined
      }
    } catch (err) {
      return undefined
    }
  }

  static checkOption (interaction: BaseCommandInteraction, name: string) {
    try {
      let result = false

      interaction.options.data.forEach(option => {
        if (option.name === name) {
          result = true
        }
      })

      return result
    } catch (err) {
      return undefined
    }
  }

  static async sendToOne(client: Client, id: string, msg: string | MessagePayload | MessageOptions) {
    if (!id) return
    const channel = await client.channels.fetch(id)
    // Using a type guard to narrow down the correct type
    if (!((channel): channel is TextChannel => channel?.type === 'GUILD_TEXT')(channel)) return
    channel.send(msg)
  }
}

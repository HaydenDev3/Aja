import axios from 'axios';

interface SlashCommandBuilder {
  name: string;
  description: string;
  options?: SlashCommandOptionBuilder[];
}

interface SlashCommandOptionBuilder {
  type: number;
  name: string;
  description: string;
  required?: boolean;
  choices?: SlashCommandOptionChoiceBuilder[];
  options?: SlashCommandOptionBuilder[];
}

interface SlashCommandOptionChoiceBuilder {
  name: string;
  value: string | number;
}

export default class CommandsManager {
  private readonly baseUrl = `https://discord.com/api/v9/applications/${process.env.BOT_CLIENT_ID}/guilds/${process.env.BOT_GUILD_ID}/commands`;
  private readonly headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
    'Content-Type': 'application/json',
  };

  private readonly commands: SlashCommandBuilder[] = [
    {
      name: 'news',
      description: 'Allows news to be sent to you.',
      options: [
        {
          type: 7, // channel option type
          name: 'channel',
          description: 'Provide a channel for receiving news',
          required: false,
        },
      ],
    },
  ];

  public async init(): Promise<void> {
    try {
      await axios.put(this.baseUrl, this.commands, { headers: this.headers });
      console.log('Successfully registered application commands.');
    } catch (error) {
      console.error(error);
    }
  }
}
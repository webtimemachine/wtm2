import { ConsoleLogger } from '@nestjs/common';
import axios from 'axios';

import { appEnv } from '../../config';

export class CustomLogger extends ConsoleLogger {
  private discordLogWebhookUrl?: string;

  private discordLog: boolean;
  private discordError: boolean;
  private discordWarn: boolean;
  private discordDebug: boolean;
  private discordVerbose: boolean;

  constructor(context: string) {
    super(context);
    this.discordLogWebhookUrl = appEnv.DISCORD_LOG_WEBHOOK_URL;

    this.discordLog = appEnv.DISCORD_LOG || false;
    this.discordError = appEnv.DISCORD_ERROR || false;
    this.discordWarn = appEnv.DISCORD_WARN || false;
    this.discordDebug = appEnv.DISCORD_DEBUG || false;
    this.discordVerbose = appEnv.DISCORD_VERBOSE || false;
  }

  log(message: string) {
    if (this.discordLog) this.sendToDiscord('LOG', message);
    super.log(message);
  }

  error(message: string, trace?: string) {
    if (this.discordError) this.sendToDiscord('ERROR', message, trace);
    super.error(message, trace);
  }

  warn(message: string) {
    if (this.discordWarn) this.sendToDiscord('WARN', message);
    super.warn(message);
  }

  debug(message: string) {
    if (this.discordDebug) this.sendToDiscord('DEBUG', message);
    super.debug(message);
  }

  verbose(message: string) {
    if (this.discordVerbose) this.sendToDiscord('VERBOSE', message);
    super.verbose(message);
  }

  private async sendToDiscord(
    level: string,
    message: string,
    details?: string,
  ): Promise<void> {
    const embed = {
      embeds: [
        {
          title: `${level} Log`,
          description: message,
          color: this.getLogColor(level),
          fields: details
            ? [{ name: 'Details', value: `\`\`\`${details}\`\`\`` }]
            : [],
          footer: {
            text: `Logged by: ${this.context}`,
          },
          timestamp: new Date(),
        },
      ],
    };

    try {
      if (this.discordLogWebhookUrl) {
        await axios.post(this.discordLogWebhookUrl, embed);
      }
    } catch (error) {
      super.error(`Failed to send log to Discord: ${error.message}`);
    }
  }

  private getLogColor(level: string): number {
    switch (level) {
      case 'ERROR':
        return 0xff0000; // Red
      case 'WARN':
        return 0xffa500; // Orange
      case 'DEBUG':
        return 0xbf70d2; // Purple
      case 'VERBOSE':
        return 0x00ced1; // Dark Turquoise
      default:
        return 0x3498db; // Blue
    }
  }
}

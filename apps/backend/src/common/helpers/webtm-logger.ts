import { HttpException, Logger, LogLevel } from '@nestjs/common';
import axios from 'axios';

import { appEnv } from '../../config';

export class DiscordLogger {
  private readonly context: string;
  private readonly logger: Logger = new Logger(DiscordLogger.name);
  private readonly discordLogWebhookUrl?: string;

  private readonly discordLog: boolean;
  private readonly discordError: boolean;
  private readonly discordFatal: boolean;
  private readonly discordWarn: boolean;
  private readonly discordDebug: boolean;
  private readonly discordVerbose: boolean;

  constructor(context: string) {
    this.context = context;
    this.discordLogWebhookUrl = appEnv.DISCORD_LOG_WEBHOOK_URL;

    this.discordLog = appEnv.DISCORD_LOG || false;
    this.discordError = appEnv.DISCORD_ERROR || false;
    this.discordFatal = appEnv.DISCORD_FATAL || false;
    this.discordWarn = appEnv.DISCORD_WARN || false;
    this.discordDebug = appEnv.DISCORD_DEBUG || false;
    this.discordVerbose = appEnv.DISCORD_VERBOSE || false;
  }

  log(message: string, details?: string) {
    if (this.discordLog) this.sendToDiscord('log', message, details);
  }

  error(message: string, details?: string) {
    if (this.discordError) this.sendToDiscord('error', message, details);
  }

  fatal(message: string, details?: string) {
    if (this.discordFatal) this.sendToDiscord('fatal', message, details);
  }

  warn(message: string, details?: string) {
    if (this.discordWarn) this.sendToDiscord('warn', message, details);
  }

  debug(message: string, details?: string) {
    if (this.discordDebug) this.sendToDiscord('debug', message, details);
  }

  verbose(message: string, details?: string) {
    if (this.discordVerbose) this.sendToDiscord('verbose', message, details);
  }

  private async sendToDiscord(
    level: LogLevel,
    message: string,
    details?: string,
  ): Promise<void> {
    const embed = {
      embeds: [
        {
          title: `${level.toUpperCase()} Log`,
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
      this.logger.error(`Failed to send log to Discord: ${error.message}`);
    }
  }

  private getLogColor(logLevel: LogLevel): number {
    switch (logLevel) {
      case 'error':
      case 'fatal':
        return 0xff0000; // red

      case 'warn':
        return 0xffa500; // orange

      case 'debug':
        return 0xbf70d2; // purple

      case 'verbose':
        return 0x00ced1; // dark turquoise

      case 'log':
      default:
        return 0x3498db; // blue
    }
  }
}

export class WebTMLogger extends Logger {
  private readonly dicordLogger: DiscordLogger;

  constructor(context: string) {
    super(context);
    this.dicordLogger = new DiscordLogger(context);
  }

  error(message: any, ...optionalParams: [...any, string?]) {
    super.error(message, ...optionalParams);
    const { discordMessage, discordDetails } = this.handleDiscordMessage(
      message,
      optionalParams,
    );
    if (discordMessage) {
      this.dicordLogger.error(discordMessage, discordDetails);
    }
  }

  log(message: any, ...optionalParams: [...any, string?]) {
    super.log(message, ...optionalParams);
    const { discordMessage, discordDetails } = this.handleDiscordMessage(
      message,
      optionalParams,
    );
    if (discordMessage) {
      this.dicordLogger.log(discordMessage, discordDetails);
    }
  }

  warn(message: any, ...optionalParams: [...any, string?]) {
    super.warn(message, ...optionalParams);
    const { discordMessage, discordDetails } = this.handleDiscordMessage(
      message,
      optionalParams,
    );
    if (discordMessage) {
      this.dicordLogger.warn(discordMessage, discordDetails);
    }
  }

  debug(message: any, ...optionalParams: [...any, string?]) {
    super.debug(message, ...optionalParams);
    const { discordMessage, discordDetails } = this.handleDiscordMessage(
      message,
      optionalParams,
    );
    if (discordMessage) {
      this.dicordLogger.debug(discordMessage, discordDetails);
    }
  }

  verbose(message: any, ...optionalParams: [...any, string?]) {
    super.verbose(message, ...optionalParams);
    const { discordMessage, discordDetails } = this.handleDiscordMessage(
      message,
      optionalParams,
    );
    if (discordMessage) {
      this.dicordLogger.verbose(discordMessage, discordDetails);
    }
  }

  fatal(message: any, ...optionalParams: [...any, string?]) {
    super.fatal(message, ...optionalParams);
    const { discordMessage, discordDetails } = this.handleDiscordMessage(
      message,
      optionalParams,
    );
    if (discordMessage) {
      this.dicordLogger.fatal(discordMessage, discordDetails);
    }
  }

  private handleDiscordMessage(
    message: any,
    optionalParams?: [...any, string?],
  ) {
    let discordMessage: string | undefined;
    let discordDetails: string | undefined;

    if (typeof message == 'string') {
      discordMessage = message;
    }

    if (message instanceof HttpException) {
      if (message.getStatus() >= 500) {
        discordMessage = `Http Status: ${message.getStatus()} | ${message.message}`;
        discordDetails = message.stack;
      }
    }

    if (optionalParams) {
      const extraParamsDetails = optionalParams.map((v) => v.toString()).join();
      discordDetails = discordDetails
        ? `${discordDetails}\n${extraParamsDetails}`
        : extraParamsDetails;
    }

    return { discordMessage, discordDetails };
  }
}

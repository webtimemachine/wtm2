import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../../common/services';
import { WebTMLogger } from '../../common/helpers/webtm-logger';
import { OpenAIService } from '../../openai/service';

@Injectable()
export class ExplicitFilterService {
  private readonly logger = new WebTMLogger(ExplicitFilterService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly openAIService: OpenAIService,
  ) {}

  async filter(content: string, url: string): Promise<boolean> {
    let isBlacklisted =
      (await this.prismaService.blackList.count({
        where: { url },
      })) > 0;

    try {
      if (!isBlacklisted && content.length > 0 && content.length <= 128000) {
        const haveExplicitContent =
          await this.openAIService.checkForExplicitContent(content);

        if (haveExplicitContent) {
          await this.prismaService.blackList.create({
            data: { url },
          });
          isBlacklisted = true;
        }
      }
    } catch (error) {
      this.logger.error('Error while checking explicit content');
      this.logger.error(error);
      throw error;
    }

    if (isBlacklisted) {
      throw new UnprocessableEntityException(
        'Content contains explicit material',
      );
    }

    return isBlacklisted;
  }
}

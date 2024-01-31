import {
  applyDecorators,
  CanActivate,
  SetMetadata,
  Type,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserType } from '@prisma/client';
import { UserTypesGuard } from '../guards';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiDocsDescriptions } from '../../common/enums';
import { MessageResponse } from '../../common/dtos';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function JwtAccessToken(
  userTypes: UserType[] = [],
  guards: Type<CanActivate>[] = [],
) {
  return applyDecorators(
    SetMetadata('userTypes', userTypes),
    UseGuards(AuthGuard('jwt-access-token'), UserTypesGuard, ...guards),
    ApiBearerAuth('accessToken'),
    ApiOperation({ summary: buildSummary(userTypes) }),
    ApiBadRequestResponse({
      description: ApiDocsDescriptions.BAD_REQUEST,
      type: MessageResponse,
    }),
    ApiUnauthorizedResponse({
      description: ApiDocsDescriptions.UNAUTHORIZED,
      type: MessageResponse,
    }),
    ApiForbiddenResponse({
      description: ApiDocsDescriptions.FORBIDDEN,
      type: MessageResponse,
    }),
    ApiInternalServerErrorResponse({
      description: ApiDocsDescriptions.SERVER_ERROR,
      type: MessageResponse,
    }),
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function JwtRefreshToken(guards: Type<CanActivate>[] = []) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt-refresh-token'), ...guards),
    ApiBearerAuth('refreshToken'),
    ApiUnauthorizedResponse({ description: ApiDocsDescriptions.UNAUTHORIZED }),
    ApiForbiddenResponse({ description: ApiDocsDescriptions.FORBIDDEN }),
    ApiInternalServerErrorResponse({
      description: ApiDocsDescriptions.SERVER_ERROR,
    }),
  );
}

const toTitleCase = (str: string): string => {
  return str
    .split(' ')
    .map(
      ([firstChar, ...rest]) =>
        firstChar.toUpperCase() + rest.join('').toLowerCase(),
    )
    .join(' ');
};

const buildSummary = (userTypes: UserType[]): string => {
  let out = 'User Types: ';
  userTypes.forEach((userType) => (out += `${toTitleCase(userType)}, `));
  out = out.substring(0, out.length - 2);
  if (userTypes.length === 0) out = out.concat(': All  ');
  return out;
};

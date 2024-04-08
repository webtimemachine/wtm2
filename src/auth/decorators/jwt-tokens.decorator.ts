import {
  applyDecorators,
  CanActivate,
  SetMetadata,
  Type,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { MessageResponse } from '../../common/dtos';
import { ApiDocsDescriptions } from '../../common/enums';
import { UserTypesGuard } from '../guards';

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
    ApiUnauthorizedResponse({
      description: ApiDocsDescriptions.UNAUTHORIZED,
      type: MessageResponse,
    }),
  );
}

export function JwtPartialToken(guards: Type<CanActivate>[] = []) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt-partial-token'), ...guards),
    ApiBearerAuth('partialToken'),
    ApiUnauthorizedResponse({ description: ApiDocsDescriptions.UNAUTHORIZED }),
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function JwtRefreshToken(guards: Type<CanActivate>[] = []) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt-refresh-token'), ...guards),
    ApiBearerAuth('refreshToken'),
    ApiUnauthorizedResponse({ description: ApiDocsDescriptions.UNAUTHORIZED }),
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function JwtRecoveryToken(guards: Type<CanActivate>[] = []) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt-recovery-token'), ...guards),
    ApiBearerAuth('recoveryToken'),
    ApiUnauthorizedResponse({ description: ApiDocsDescriptions.UNAUTHORIZED }),
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

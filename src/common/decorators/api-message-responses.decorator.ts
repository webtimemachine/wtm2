import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MessageResponse } from '../dtos';

enum ApiDocsDescriptions {
  NOT_FOUND = 'Occurs in case the given resource does not exist',
  CONFLICT = 'Occurs in case the given resource already exists.',
  SERVER_ERROR = 'Occurs when there is a internal problem performing the task.',
  OK = 'Occurs when the task is successfully performed.',
  UNAUTHORIZED = 'Occurs in case the request lacks valid authentication credentials.',
  FORBIDDEN = 'Occurs in case user is not allowed to request this endpoint.',
  BAD_REQUEST = 'Occurs when there is a problem performing the task due a malformed request.',
  CREATED = 'CREATED',
}

/** 200 response code and ApiDocsDescriptions.OK message */
export const ApiOkMessageResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      description: ApiDocsDescriptions.OK,
      type: MessageResponse,
    }),
  );
};

/** 400 response code and ApiDocsDescriptions.BAD_REQUEST message */
export const ApiBadRequestMessageResponse = () => {
  return applyDecorators(
    ApiBadRequestResponse({
      description: ApiDocsDescriptions.BAD_REQUEST,
      type: MessageResponse,
    }),
  );
};

/** 401 response code and ApiDocsDescriptions.UNAUTHORIZED message */
export const ApiUnauthorizedMessageResponse = () => {
  return applyDecorators(
    ApiUnauthorizedResponse({
      description: ApiDocsDescriptions.UNAUTHORIZED,
      type: MessageResponse,
    }),
  );
};

/** 403 response code and ApiDocsDescriptions.FORBIDDEN message */
export const ApiForbiddenMessageResponse = () => {
  return applyDecorators(
    ApiForbiddenResponse({
      description: ApiDocsDescriptions.FORBIDDEN,
      type: MessageResponse,
    }),
  );
};

/** 404 response code and ApiDocsDescriptions.NOT_FOUND message */
export const ApiNotFoundMessageResponse = () => {
  return applyDecorators(
    ApiNotFoundResponse({
      description: ApiDocsDescriptions.NOT_FOUND,
      type: MessageResponse,
    }),
  );
};

/** 409 response code and ApiDocsDescriptions.CONFLICT message */
export const ApiConflictMessageResponse = () => {
  return applyDecorators(
    ApiConflictResponse({
      description: ApiDocsDescriptions.CONFLICT,
      type: MessageResponse,
    }),
  );
};

/** 500 response code and ApiDocsDescriptions.SERVER_ERROR message */
export const ApiInternalServerErrorMessageResponse = () => {
  return applyDecorators(
    ApiInternalServerErrorResponse({
      description: ApiDocsDescriptions.SERVER_ERROR,
      type: MessageResponse,
    }),
  );
};

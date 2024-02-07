import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationResponse } from '../dtos';
import { ApiDocsDescriptions } from '../enums';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const ApiPaginationResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(PaginationResponse, model),
    ApiOkResponse({
      schema: {
        description: ApiDocsDescriptions.OK,
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
          {
            properties: {
              offset: {
                type: 'number',
              },
              limit: {
                type: 'number',
              },
              count: {
                type: 'number',
              },
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

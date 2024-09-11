export enum ApiDocsDescriptions {
  NOT_FOUND = 'Occurs in case the given resource does not exist',
  CONFLICT = 'Occurs in case the given resource already exists.',
  SERVER_ERROR = 'Occurs when there is a internal problem performing the task.',
  OK = 'Occurs when the task is successfully performed.',

  UNAUTHORIZED = 'Occurs in case the request lacks valid authentication credentials.',
  FORBIDDEN = 'Occurs in case user is not allowed to perform the operation.',
  BAD_REQUEST = 'Occurs when there is a problem performing the task due a malformed request.',
  UNPROCESSABLE_ENTITY = 'Occurs when sent file mismatch the required mimetype.',
  CREATED = 'CREATED',
}

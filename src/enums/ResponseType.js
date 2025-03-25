const ResponseType = {
  BAD_REQUEST: { 
    code: 400, 
    message: 'Bad Request',
    details: 'The request could not be understood by the server due to invalid syntax'
  },
  UNAUTHORIZED: {
    code: 401,
    message: 'Unauthorized',
    details: 'Authentication is required and has failed or not been provided'
  },
  FORBIDDEN: {
    code: 403,
    message: 'Forbidden',
    details: 'The server understood the request but refuses to authorize it'
  },
  NOT_FOUND: {
    code: 404,
    message: 'Not Found',
    details: 'The requested resource could not be found on the server'
  },
  UNSUPPORTED_METHOD: {
    code: 405,
    message: 'Unsupported method',
    details: 'Unsupported method'
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Internal Server Error',
    details: 'An unexpected condition was encountered preventing the server from fulfilling the request'
  },

  OK: {
    code: 200,
    message: 'OK',
    contentType: 'application/json'
  },
  CREATED: {
    code: 201,
    message: 'Created',
    contentType: 'application/json'
  },
  NO_CONTENT: {
    code: 204,
    message: 'No Content',
    contentType: 'application/json'
  }
};

export default ResponseType;

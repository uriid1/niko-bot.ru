import ResponseType from '#src/enums/ResponseType.js'

const error = (req, res) => {
  res.error = (errorType, customDetails = null) => {
    const conf = errorType || ResponseType.INTERNAL_SERVER_ERROR;
    
    const respons = JSON.stringify({
      error: {
        code: conf.code,
        message: conf.message,
        details: customDetails || conf.details
      }
    });

    res.writeHead(conf.code, { 'Content-Type': 'application/json' });
    res.end(respons);
  };
};

export default error;

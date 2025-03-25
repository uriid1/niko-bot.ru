import ResponseType from '#src/enums/ResponseType.js'

const json = (req, res) => {
  res.json = (responseType, data = null) => {
    const conf = responseType || ResponseType.OK;
    
    // Если данные не переданы, используем пустой объект
    const body = data !== null 
      ? JSON.stringify(data)
      : JSON.stringify({ message: conf.message });

    res.writeHead(conf.code, { 'Content-Type': conf.contentType });
    res.end(body);
  };
};

export default json;

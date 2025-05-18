const logData = (...data: any) => {
  console.log(...data);
};

const logInfo = (...data: any) => {
  console.info(...data);
};

const logWarn = (...data: any) => {
  console.warn(...data);
};

const logError = (...data: any) => {
  console.error(...data);
};

const oplog = {
  log: logData,
  info: logInfo,
  warn: logWarn,
  error: logError,
};

export default oplog;

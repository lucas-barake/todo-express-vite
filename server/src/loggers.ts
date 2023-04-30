const loggers = {
  error(message: string, error: unknown) {
    console.error(`❌ Error - ${message}`, error);
  },
};

export default loggers;

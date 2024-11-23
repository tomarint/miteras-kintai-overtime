import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

// Register and apply the prefix plugin
try {
  prefix.reg(log);
  prefix.apply(log, {
    template: "%t %l %n",  // timestamp, log level, and name of the logger
    timestampFormatter: (date) => date.toLocaleTimeString(),
  });
} catch (error) {
  console.error("Failed to apply loglevel-plugin-prefix:", error);
}


const isDevelopment: boolean = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  log.setLevel('trace');
} else {
  log.setLevel('silent');
}

export default log;

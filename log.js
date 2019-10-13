
// const winston = require('winston');

// // Logger configuration
// const logConfiguration = {
//     transports: [
//         new winston.transports.Console({
//             level: 'verboseaa'
//         }),
//         new winston.transports.File({
//             level: 'error',
//             filename: './logs/example-3.log'
//         })
//     ]
// };

// // Create the logger
// const logger = winston.createLogger(logConfiguration);

// // Log some messages
// logger.silly('Trace message, Winston!');
// logger.debug('Debug message, Winston!');
// logger.verbose('A bit more info, Winston!');
// logger.info('Hello, Winston!');
// logger.warn('Heads up, Winston!');
// logger.error('Danger, Winston!');
// let ts = Date.now();

// let date_ob = new Date(ts);
// let date = date_ob.getDate();
// let month = date_ob.getMonth() + 1;
// let year = date_ob.getFullYear();

// // prints date & time in YYYY-MM-DD format
// console.log(year + "-" + month + "-" + date);
let date_ob = new Date();

// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date & time in YYYY-MM-DD HH:MM:SS format
var t=year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
console.log(t);

// prints time in HH:MM format

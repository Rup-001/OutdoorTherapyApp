const logger = require('../config/logger');

const socketIO = (io) => {
  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on('join', (userId) => {
      socket.join(userId);
      logger.info(`User ${userId} joined room`);
    });

    socket.on('disconnect', () => {
      logger.info('Client disconnected');
    });
  });
};

module.exports = socketIO;

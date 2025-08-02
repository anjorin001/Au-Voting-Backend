const Result = require('../models/resultModel');

const activeLiveLoops = {};

module.exports = function initResultSocket(io) {
  io.on('connection', (socket) => {
    console.log('🟢 New client connected');

    socket.on('join-live', (electionId) => {
      console.log(`📡 Client joined live for election ${electionId}`);
      if (!activeLiveLoops[electionId]) {
        activeLiveLoops[electionId] = setInterval(async () => {
          const result = await Result.findOne({ election: electionId }).populate('votes.candidate');
          io.emit(`result-update-${electionId}`, result);
        }, 5000);
      }
    });

    socket.on('leave-live', (electionId) => {
      console.log(`🚪 Client left live for election ${electionId}`);
      clearInterval(activeLiveLoops[electionId]);
      delete activeLiveLoops[electionId];
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected');
    });
  });
};

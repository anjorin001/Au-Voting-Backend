const cron = require('node-cron');
const Election = require('../models/electionModel');

// Run every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();

  try {
    // ✅ Start elections where startTime has passed and status is still 'pending'
    const electionsToStart = await Election.find({
      status: 'upcoming',
      startTime: { $lte: now },
    });

    for (const election of electionsToStart) {
      election.status = 'ongoing';
      election.result = ""
      await election.save();
      console.log(`⏳ Election "${election.title}" started.`);
    }

    // ✅ End elections where endTime has passed and status is still 'ongoing'
    const electionsToEnd = await Election.find({
      status: 'ongoing',
      endTime: { $lte: now },
    });

    for (const election of electionsToEnd) {
      election.status = 'ended';
      await election.save();
      console.log(`✅ Election "${election.title}" ended.`);
    }
  } catch (err) {
    console.error('Election cron job error:', err.message);
  }
});


// TODO send email or notification triggers when elections start or end.
// 10.25 -10.35
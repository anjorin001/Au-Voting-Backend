module.exports = {
  async up(db) {
    const results = await db.collection('results').find({ candidate: { $exists: true } }).toArray();

    const bulkOps = results.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id },
        update: {
          $set: {
            votes: [
              {
                candidate: doc.candidate,
                vote: doc.votes || 0,
              },
            ],
          },
          $unset: {
            candidate: "",
            votes: "", // remove old flat structure
          },
        },
      },
    }));

    if (bulkOps.length > 0) {
      await db.collection('results').bulkWrite(bulkOps);
    }
  },

  async down(db) {
    const results = await db.collection('results').find({ votes: { $type: 'array' } }).toArray();

    const bulkOps = results.map((doc) => {
      const voteData = doc.votes[0] || {};
      return {
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $set: {
              candidate: voteData.candidate || null,
              votes: voteData.vote || 0,
            },
            $unset: {
              votes: "",
            },
          },
        },
      };
    });

    if (bulkOps.length > 0) {
      await db.collection('results').bulkWrite(bulkOps);
    }
  },
};

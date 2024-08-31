import cron from 'node-cron';
import sequelize from '../config/database.js'; // Adjust the path as necessary

// Define the cron job
cron.schedule('0 0 * * *', async () => { // This will run every night at midnight
  try {
    console.log('Running nightly archive job...');
    
    // Begin a transaction
    const transaction = await sequelize.transaction();
    
    // Move all messages to ArchivedChat
    await sequelize.query(`
      INSERT INTO ArchivedChat (message, userId, recipientId, groupId, fileUrl, createdAt)
      SELECT message, userId, recipientId, groupId, fileUrl, createdAt
      FROM Message
    `, { transaction });
    
    // Clear the Message table
    await sequelize.query('DELETE FROM Message', { transaction });
    
    // Commit the transaction
    await transaction.commit();
    
    console.log('Archive job completed successfully.');
  } catch (error) {
    console.error('Error running archive job:', error);
    // Rollback the transaction in case of error
    if (transaction) {
      await transaction.rollback();
    }
  }
});

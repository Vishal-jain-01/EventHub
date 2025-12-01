import mongoose from 'mongoose';

async function dropProblematicIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    console.log('✅ Connected to MongoDB');
    
    const collection = mongoose.connection.db.collection('eventregisters');
    
    // List all indexes first
    const indexes = await collection.listIndexes().toArray();
    console.log('📋 Current indexes:', indexes.map(idx => idx.name));
    
    // Drop the problematic unique indexes
    const indexesToDrop = ['email_1', 'phone_1'];
    
    for (const indexName of indexesToDrop) {
      try {
        await collection.dropIndex(indexName);
        console.log(`✅ Successfully dropped index: ${indexName}`);
      } catch (error) {
        if (error.message.includes('not found')) {
          console.log(`ℹ️ Index ${indexName} not found (already dropped)`);
        } else {
          console.log(`❌ Error dropping index ${indexName}:`, error.message);
        }
      }
    }
    
    // Show remaining indexes
    const remainingIndexes = await collection.listIndexes().toArray();
    console.log('📋 Remaining indexes:', remainingIndexes.map(idx => idx.name));
    
    console.log('🎉 Database cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📤 Database connection closed');
    process.exit(0);
  }
}

dropProblematicIndexes();
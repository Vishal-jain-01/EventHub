import mongoose from 'mongoose';

async function checkDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/Event%20Management%20Backend');
    console.log('✅ Connected to MongoDB');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(col => col.name));
    
    // Check if eventregisters collection exists
    const eventRegistersCol = collections.find(col => 
      col.name.toLowerCase().includes('eventregister') || 
      col.name.toLowerCase().includes('register')
    );
    
    if (eventRegistersCol) {
      console.log(`🔍 Found collection: ${eventRegistersCol.name}`);
      
      const collection = mongoose.connection.db.collection(eventRegistersCol.name);
      const indexes = await collection.listIndexes().toArray();
      console.log('📋 Indexes in this collection:', indexes.map(idx => `${idx.name} (${JSON.stringify(idx.key)})`));
      
      // Drop problematic indexes if they exist
      const problemIndexes = indexes.filter(idx => 
        idx.name === 'email_1' || idx.name === 'phone_1'
      );
      
      if (problemIndexes.length > 0) {
        console.log('🚨 Found problematic indexes, dropping them...');
        for (const idx of problemIndexes) {
          try {
            await collection.dropIndex(idx.name);
            console.log(`✅ Dropped index: ${idx.name}`);
          } catch (error) {
            console.log(`❌ Error dropping ${idx.name}:`, error.message);
          }
        }
      } else {
        console.log('✅ No problematic indexes found');
      }
    } else {
      console.log('ℹ️ No eventregisters collection found yet');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📤 Database connection closed');
    process.exit(0);
  }
}

checkDatabase();
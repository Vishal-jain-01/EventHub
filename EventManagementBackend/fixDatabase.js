import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DB_NAME = "Event Management Backend";

async function fixDatabase() {
  try {
    // Connect using the same configuration as the app
    const mongoUri = `${process.env.MONGODB_URI}/${encodeURIComponent(DB_NAME)}`;
    console.log('🔗 Connecting to:', mongoUri.replace(/:[^:@]*@/, ':****@')); // Hide password
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(col => col.name));
    
    // Look for eventregisters collection (might be named differently)
    let targetCollection = null;
    const possibleNames = ['eventregisters', 'EventRegisters', 'EventRegister'];
    
    for (const name of possibleNames) {
      const found = collections.find(col => col.name === name);
      if (found) {
        targetCollection = name;
        break;
      }
    }
    
    if (targetCollection) {
      console.log(`🔍 Found collection: ${targetCollection}`);
      
      const collection = mongoose.connection.db.collection(targetCollection);
      const indexes = await collection.listIndexes().toArray();
      console.log('📋 Current indexes:', 
        indexes.map(idx => `${idx.name} -> ${JSON.stringify(idx.key)}`)
      );
      
      // Drop problematic unique indexes
      const problemIndexes = ['email_1', 'phone_1'];
      let droppedAny = false;
      
      for (const indexName of problemIndexes) {
        const indexExists = indexes.find(idx => idx.name === indexName);
        if (indexExists) {
          try {
            await collection.dropIndex(indexName);
            console.log(`✅ Dropped problematic index: ${indexName}`);
            droppedAny = true;
          } catch (error) {
            console.log(`❌ Failed to drop ${indexName}:`, error.message);
          }
        } else {
          console.log(`ℹ️ Index ${indexName} doesn't exist`);
        }
      }
      
      if (droppedAny) {
        console.log('🎉 Problematic indexes have been removed!');
        console.log('💡 You can now register for events without duplicate key errors.');
      } else {
        console.log('✅ No problematic indexes found - database is clean!');
      }
      
    } else {
      console.log('ℹ️ EventRegisters collection not found yet.');
      console.log('💡 It will be created when someone first registers for an event.');
      console.log('✅ With the updated model, there should be no duplicate key errors.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('📤 Database connection closed');
    process.exit(0);
  }
}

fixDatabase();
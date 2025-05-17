import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';

const sampleData = [
  { name: 'Alice', password: 25, email: 'alice@example.com' },
  { name: 'Bob', password: 30, email: 'bob@example.com' },
  { name: 'Charlie', password: 28, email: 'charlie@example.com' }
];

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const database = client.db('sledjeWebpvt');
    const collection = database.collection('users');

    const result = await collection.insertMany(sampleData);
    console.log(`📥 Inserted ${result.insertedCount} documents`);
  } catch (err) {
    console.error('❌ Error inserting data:', err.message);
  } finally {
    await client.close();
  }
}

run();
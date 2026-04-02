
import * as bcrypt from 'bcrypt';
import { db } from '../db.module';
import path from 'path';
import * as fs from 'fs';


export async function seedDatabase() {

  const seedFilePath = path.join(process.cwd(), 'src/database/seed/seed.json');
  const seedFileContent = fs.readFileSync(seedFilePath, 'utf-8');
  const seedData = JSON.parse(seedFileContent);

  if (db.users.length > 0) {
    console.log('📦 Database already has data, skipping seed...');
    return;
  }

  const usersWithHashedPasswords = await Promise.all(
    seedData.users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  db.users = usersWithHashedPasswords;
  db.categories = seedData.categories;
  db.articles = seedData.articles;
  db.comments = seedData.comments;

  console.log('Seed data loaded successfully!');
}
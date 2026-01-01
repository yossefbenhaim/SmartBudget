import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectionConfig = {
  host: process.env.VITE_DB_HOST,
  port: parseInt(process.env.VITE_DB_PORT || '5432'),
  database: process.env.VITE_DB_NAME,
  user: process.env.VITE_DB_USER,
  password: process.env.VITE_DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
};

async function runMigrations() {
  const client = new Client(connectionConfig);

  try {
    console.log('🔌 מתחבר למסד הנתונים...');
    await client.connect();
    console.log('✅ התחברות הצליחה!');

    // Read migration file
    const migrationPath = join(__dirname, '..', 'supabase', 'migrations', '20260101000000_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📦 מריץ migration...');
    await client.query(migrationSQL);
    console.log('✅ Migration הושלם בהצלחה!');

    console.log('\n🎉 מסד הנתונים מוכן!');
    console.log('📊 נוצרו 7 טבלאות:');
    console.log('   ✅ profiles');
    console.log('   ✅ categories');
    console.log('   ✅ transactions');
    console.log('   ✅ budgets');
    console.log('   ✅ investments');
    console.log('   ✅ savings_goals');
    console.log('   ✅ recurring_transactions');

  } catch (error) {
    console.error('❌ שגיאה:', error.message);

    if (error.message.includes('already exists')) {
      console.log('\n⚠️  הטבלאות כבר קיימות במסד הנתונים');
      console.log('אם אתה רוצה להריץ מחדש, מחק את הטבלאות תחילה.');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\n⚠️  הסיסמה שגויה!');
      console.log('בדוק את VITE_DB_PASSWORD בקובץ .env');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      console.log('\n⚠️  לא ניתן להתחבר לשרת');
      console.log('בדוק את פרטי ההתחברות בקובץ .env');
    }

    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();

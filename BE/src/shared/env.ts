import dotenv from 'dotenv';

dotenv.config({
  path: ['.env.desarrollo', '.env', '../.env.desarrollo', '../.env'],
});

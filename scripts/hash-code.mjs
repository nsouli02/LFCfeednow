import bcrypt from 'bcryptjs';

const code = process.argv[2] || process.env.CODE;
if (!code) {
  console.error('Usage: npm run hash:code -- <your_code>');
  process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(code, salt);
console.log(hash);



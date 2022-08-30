const mongoose = require('mongoose');
require('dotenv').config();

async function main() {
  await mongoose.connect(process.env.MONGOOSE_URL);
  console.log('Conectado ao mongoose.');
}

main().catch( error => console.log(error));

module.exports = mongoose;
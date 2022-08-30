require('dotenv').config();
const app = require('./src/server');
require('./src/db/db');

app.listen(app.get('port'), () => {
  console.log(`Server executando na porta ${app.get('port')}`);
});
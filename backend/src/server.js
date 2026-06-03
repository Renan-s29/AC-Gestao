require('dotenv').config();
const app = require('./app');

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`AC-Gestão API ouvindo em http://localhost:${port}`);
});

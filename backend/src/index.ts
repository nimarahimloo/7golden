import 'dotenv/config';
import app from './app.js';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`7Golden backend running on http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
});

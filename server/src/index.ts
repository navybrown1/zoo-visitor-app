import app from './app.js';

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Zoo Visitor API listening on http://localhost:${PORT}`);
});

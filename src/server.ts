import app from './app';

const PORT = process.env.PORT || 5000;

app
  .listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  })
  .on('error', (err) => {
    console.error('Failed to start server: ', err);
  });

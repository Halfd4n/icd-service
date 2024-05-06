import app from './app';

const PORT = process.env.PORT || 5000;

app
  .listen(PORT, () => {
    console.log(
      `Server running on: ${PORT === 5000 ? 'http://localhost:5000' : PORT}`
    );
  })
  .on('error', (err) => {
    console.error('Failed to start server: ', err);
  });

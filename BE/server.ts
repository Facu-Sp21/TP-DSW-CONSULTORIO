import * as http from 'http';
import { app } from './app.js'; // o './app.ts' según compilación

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

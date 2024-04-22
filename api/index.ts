import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import patrolDb from './db/Patrols';

// Import Routers
import helloRoutes from './routes/hello';

const app = express();
config();

// const databaseUrl: string = process.env.DATABASE_URL!;
// connect(databaseUrl);

app.use(json());
app.use(cors());
app.use(express.static('public'));

// Routes
app.use('/hello', helloRoutes);

/**
 * This block of code is temporary, need to find a way to link it succinctly with express
 * just to see if it works
 */
async function test() {
  await patrolDb.createSomeDummyPatrols();
  
  const patrolEmail = "john@cpnz.com";
  
  const patrol = await patrolDb.testCredentials(patrolEmail)
  
  console.log("patrol: " + JSON.stringify(patrol))
}

test()
/**
 * END
 */

const port = Number.parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

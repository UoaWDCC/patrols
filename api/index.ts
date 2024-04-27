import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import patrolDb from './db/Patrols';

// Import Routers
import helloRoutes from './routes/hello';
import authLoginRoute from './routes/auth/login';

const app = express();
config();

// const databaseUrl: string = process.env.DATABASE_URL!;
// connect(databaseUrl);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/hello', helloRoutes);
app.use('/auth', authLoginRoute);

/**
 * This block of code is temporary, need to find a way to link it succinctly with express,
 * or when front-end calling api-routes in backend, these db functions can be directly access
 * in api-routes, and return data to front-end
 */
async function test() {
  try {
    const patrolEmail = "john@cpnz.com";
    console.log("Testing: Find John Smith......")
    const patrol = await patrolDb.testCredentials(patrolEmail)
    console.log("patrol: " + JSON.stringify(patrol))

  } catch (e: any) {
    console.log(e.message)
  }
}

// test()
/**
 * END
 */

const port = Number.parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

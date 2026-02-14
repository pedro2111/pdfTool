import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);

// Basic route
app.get('/', (req, res) => {
    res.send('PDF Tool API is running');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

export default app;

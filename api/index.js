import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import swaggerUiExpress from 'swagger-ui-express';
import * as fs from 'fs';
import path from 'path';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import noteRoutes from './routes/note.route.js';
import commentRoutes from './routes/comment.route.js';

dotenv.config();

mongoose.connect(process.env.MONGOURI)
        .then(() => {
            console.log('MongoDb is connected');
        })
        .catch((err) => {
            console.log(err);
        });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/dist')));

const port = process.env.PORT || 3000;

app.listen(port, error => {
    if (error) throw error;
    console.log('Server running on port ' + port);
});

const swaggerFile = JSON.parse(fs.readFileSync('./docs/swagger-output.json'));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerFile));

//app.use('/api/test', userRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/comment', commentRoutes);

// app.get('/api/test', (req, res) => {
//     res.json({message: 'API is working'});
// });


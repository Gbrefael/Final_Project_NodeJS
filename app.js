const express = require('express');
const app = express();
const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/users');
const cardRouter = require('./routers/cards');
const port = 3000;
const cors = require('cors');
require('./dal/dal');

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/cards', cardRouter);

app.listen(port, () => console.log(`Listening to port ${port}`));

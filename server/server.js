
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

/*------------------------- Import Routes -------------------------*/
const userRouter = require('./routes/user.router');
const quotesRouter = require('./routes/quotes.router');
const dealsRouter = require('./routes/deals.router');
const typesRouter = require('./routes/types.router');
const userListRouter = require('./routes/userList.router');
const nodeMailerRouter = require('./routes/nodeMailer.router');
const employerDashboradRouter = require('./routes/employerDashborad.router');
const employeesRouter = require('./routes/employees.router');
const demoDataRouter = require('./routes/demoData.router')

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/*------------------------- Routes -------------------------*/
app.use('/api/user', userRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/deals', dealsRouter)
app.use('/types', typesRouter);
app.use('/users', userListRouter);
app.use('/send', nodeMailerRouter);
app.use('/api/company_id', employerDashboradRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/demoData', demoDataRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const doctorRouter = require('./routes/doctors');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// All routes will be available from /doctors
app.use('/doctors', doctorRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
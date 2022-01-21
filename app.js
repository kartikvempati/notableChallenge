const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("hello world");
})

app.get('/fuckthis', (req, res) => {
    res.send('lol yeah fuck this');
})

app.post('/', (req, res) => {

})

// app.delete('/', (req, res) => {

// })

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
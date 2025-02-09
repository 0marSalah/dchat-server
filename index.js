const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());


app.get('/', (req, res) => {
    console.log(req.url);
    res.json({message:'Hello, world!'});
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
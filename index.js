'use strict';

const express = require('express');

const PORT = '3000';
const app = express();

app.use((req, res, next) => {
	res.send('Hello brossssssssssssssssssssssss');
});

app.listen(PORT);

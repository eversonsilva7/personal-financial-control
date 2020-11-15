//const express = require('express');
//const transactionRouter = express.Router();
import express from 'express';

//module.exports = transactionRouter;
//const services = require('./services/transactionService.js');
import services from '../services/transactionService.js';

const app = express();

app.get('/transaction/', services.findAll);
app.get('/transaction/AllYearsMonth', services.findAllYearsMonths);
app.get('/transaction/totalYearMonth', services.totalYearMonth);
app.get('/transaction/:id', services.findOne);
app.post('/transaction', services.insert);
app.put('/transaction/:id', services.update);
app.delete('/transaction/:id', services.remove);

export default { app };

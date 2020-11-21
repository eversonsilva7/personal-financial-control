import express from 'express';
import services from '../services/transactionService.js';

const app = express();

app.get('/', services.findAll);
app.get('/AllYearsMonths', services.findAllYearsMonths);
app.get('/totalYearMonth', services.totalYearMonth);
app.post('/', services.insert);
app.put('/:id', services.update);
app.delete('/:id', services.remove);
app.get('/:id', services.findOne);

export default { app };

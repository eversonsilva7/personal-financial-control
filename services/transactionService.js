import mongoose from 'mongoose'; // mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
import { TransactionModel } from '../models/TransactionModel.js';

const VALIDATION_YEAR_MONTH =
  'É necessário informar o parâmetro "period", no formato yyyy-mm.';

const VALIDATION_FIELDS =
  'É necessário informar os campos description, value, category, yearMonthDay (yyyy-mm-dd) e type (- ou +).';

const VALIDATION_FIELD_TYPE = 'Type só aceita - ou +.';

const findAll = async (req, res) => {
  try {
    const period = req.query.period;
    const description = req.query.description;

    if (!period) {
      return res.status(404).send({ message: VALIDATION_YEAR_MONTH });
    }
    //condicao para o filtro no findAll
    var condition = description
      ? {
          yearMonth: period,
          description: { $regex: new RegExp(description), $options: 'i' },
        }
      : { yearMonth: period };

    const transactions = await TransactionModel.find(condition);
    res.status(200).send({ length: transactions.length, transactions });
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
  }
};

const findAllYearsMonths = async (req, res) => {
  try {
    const transactions = await TransactionModel.aggregate([
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          year: { $first: '$year' },
          month: { $first: '$month' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).send(transactions);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
  }
};

const totalYearMonth = async (req, res) => {
  try {
    const period = req.query.period;
    const description = req.query.description;

    if (!period) {
      return res.status(404).send({ message: VALIDATION_YEAR_MONTH });
    }

    //condicao para o filtro no findAll
    var condition = description
      ? {
          yearMonth: period,
          description: { $regex: new RegExp(description), $options: 'i' },
        }
      : { yearMonth: period };

    const transactions = await TransactionModel.aggregate([
      {
        $match: {
          yearMonth: period,
          description: { $regex: new RegExp(description), $options: 'i' },
        },
      },
      {
        $group: {
          _id: { type: '$type' },
          type: { $first: '$type' },
          total: { $sum: '$value' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.status(200).send(transactions);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
  }
};

const findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await TransactionModel.findById(id);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar a transaction id: ' + id });
  }
};

const objectStructure = (objectReq) => {
  const { description, value, category, yearMonthDay, type } = objectReq;
  if (!description || !value || !category || !type || !yearMonthDay) {
    return null;
  }
  const dateResult = yearMonthDay.split('-');
  //console.log(dateResult);
  const objectData = {
    description,
    value,
    category,
    type,
    yearMonthDay,
    yearMonth: `${dateResult[0]}-${dateResult[1]}`,
    year: Number(dateResult[0]),
    month: Number(dateResult[1]),
    day: Number(dateResult[2]),
  };
  return objectData;
};

const insert = async (req, res) => {
  const data = objectStructure(req.body);
  if (!data) {
    return res.status(404).send({ message: VALIDATION_FIELDS });
  }

  if (data.type === '-' || data.type === '+') {
  } else {
    return res.status(404).send({ message: VALIDATION_FIELD_TYPE });
  }
  const newTransaction = new TransactionModel(data);
  try {
    const transaction = await newTransaction.save(newTransaction);
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const id = req.params.id;
  const updateData = objectStructure(req.body);
  if (!updateData) {
    return res.status(404).send({ message: VALIDATION_FIELDS });
  }

  if (updateData.type === '-' || updateData.type === '+') {
  } else {
    return res.status(404).send({ message: VALIDATION_FIELD_TYPE });
  }
  try {
    const query = { _id: id };
    const data = await TransactionModel.findByIdAndUpdate(query, updateData, {
      new: true,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send({
      error: 'É necessário informar o parâmetro "id"',
    });
  }

  try {
    await TransactionModel.deleteOne({ _id: id });

    res.status(200).json({ message: 'Dados deletado!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  findAll,
  findAllYearsMonths,
  totalYearMonth,
  findOne,
  insert,
  update,
  remove,
};

import axios from 'axios';

const url = axios.create({
  baseURL: REACT_APP_URL_API + '/api/transaction',
  headers: {
    'Content-type': 'application/json',
  },
});

async function getPeriodTransaction(period) {
  const response = await url.get(`?period=${period}`);
  return response.data;
}

async function getAllYearsMonths() {
  const response = await url.get('/AllYearsMonths');
  console.log(response);
  return response.data;
}

async function create(data) {
  const response = await url.post('', data);
  return response.data;
}

async function update(data) {
  console.log(data);
  console.log(data.id);
  const response = await url.put(`${data.id}`, data);
  return response.data;
}

async function remove(data) {
  const response = await url.delete(`${data.id}`);
  return response.data;
}

export { getPeriodTransaction, getAllYearsMonths, create, update, remove };

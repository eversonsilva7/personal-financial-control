//import * as api from '../api/apiService';

const MONTH_NAME = [
  '',
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const getPeriod = () => {
  let _month = 0;
  let _year = 2019;
  //implementar em uma outra versão
  // const allPeriods = async () => {
  //   return await api.getAllYearsMonths();
  // };

  // allPeriods();
  const array = Array.from({ length: 48 }).map((_) => {
    if (_month++ >= 12) {
      _month = 1;
      _year++;
    }

    const monthYear = `${_year}-${_month.toString().padStart(2, '0')}`;
    const descriptionMonthYear = `${MONTH_NAME[_month]} - ${_year}`;

    return { monthYear, descriptionMonthYear };
  });

  return array;
};

const getDescriptionMonth = (month) => {
  return MONTH_NAME[month];
};

export { getPeriod, getDescriptionMonth };

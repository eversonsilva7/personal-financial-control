import React from 'react';
import { formatMoney } from '../../helpers/formatNumber';
import { getDescriptionMonth } from '../../helpers/monthsYears';
import './transaction.css';

export default function Transaction({
  data,
  onRemoveData,
  onEditData,
  newDay,
}) {
  const {
    id,
    type,
    category,
    day,
    description,
    value,
    yearMonthDay,
    month,
  } = data;

  const classColor = data.type === '-' ? 'red lighten-1' : 'teal darken-1';

  const handleActionClick = () => {
    onEditData({
      id,
      type,
      category,
      day,
      description,
      value,
      yearMonthDay,
    });
  };

  return (
    <>
      {newDay && (
        <div className="new-date">
          <span>{`${day} de ${getDescriptionMonth(month)}`}</span>
        </div>
      )}
      <div id="card-transaction" className={classColor}>
        <strong className="day-card">{day.toString().padStart(2, '0')}</strong>
        <div className="body-card">
          <div className="card-description font-normal">
            <strong>{category}</strong>
            <span>{description}</span>
          </div>
          <div className="value-card">
            <span>{formatMoney(value)}</span>
          </div>
        </div>
        <div className="div-icons">
          <i className="material-icons" onClick={handleActionClick}>
            edit
          </i>
          <i className="material-icons" onClick={() => onRemoveData(id)}>
            delete
          </i>
        </div>
      </div>
    </>
  );
}

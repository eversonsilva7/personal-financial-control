import React, { useState } from 'react';
import TransactionList from './components/TransactionList/transactionList';
import * as api from './api/apiService';
import Overview from './components/Overview/overview';
import M from 'materialize-css';
import Modal from './components/TransactionModal/transactionModal';

export default function App() {
  const [filterText, setFilterText] = useState('');
  const [listFilter, setListFilter] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dataSelected, setDataSelected] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreloader, setIsPreloader] = useState(false);

  const [period, setPeriod] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0')}`
  );

  React.useEffect(() => {
    M.AutoInit();
  }, []);

  React.useEffect(() => {
    const getTransactionsList = async () => {
      const newList = await api.getPeriodTransaction(period);
      setTransactions(newList.transactions);
    };
    getTransactionsList();
    setIsPreloader(false);
  }, [period]);

  React.useEffect(() => {
    setIsPreloader(true);
    const newList =
      filterText.length > 0
        ? transactions
            .filter((item) => {
              const textDescription = item.description.toLowerCase();
              return textDescription.indexOf(filterText.toLowerCase()) >= 0;
            })
            .sort((a, b) => b.day - a.day)
        : Object.assign(
            [],
            transactions.sort((a, b) => b.day - a.day)
          );
    setListFilter(newList);
  }, [transactions, filterText]);

  const hadleChangeSelected = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleFilterText = (newDescription) => {
    setFilterText(newDescription);
  };

  const handlePersistData = async (formData, isEdit) => {
    const newTransaction = isEdit
      ? await api.update(formData)
      : await api.create(formData);

    let newList = isEdit
      ? Object.assign(
          [],
          [
            ...transactions.filter(({ id }) => id !== newTransaction.id),
            newTransaction,
          ]
        )
      : Object.assign([], [...transactions, newTransaction]);
    setTransactions(newList);
    setIsModalOpen(false);
  };

  const handleRemove = async (_id) => {
    const transactionData = listFilter.find(({ id }) => id === _id);
    await api.remove(transactionData);
    const newList = transactions.filter(({ id }) => id !== _id);
    setTransactions(newList);
  };

  const handlePersist = () => {
    const newFormData = {
      value: 0,
      category: 'Outros',
      description: '',
      type: '-',
      yearMonthDay: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${new Date().getDate()}`,
    };
    setIsEdit(false);
    setDataSelected(newFormData);
    setIsModalOpen(true);
  };

  const handleEditData = (data) => {
    setDataSelected(data);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <header>
        <div className="navbar-wrapper">
          <nav className="teal darken-1">
            <div className="navbar-home">
              <div className="content-header">
                <strong className="font-xlarge">
                  Controle Financeiro Pessoal
                </strong>
                <span className="font-medium">
                  Bootcamp Full Stack - Desafio Final (Everson)
                </span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main className="container-main">
        <div className="row">
          <Overview
            listFilter={listFilter}
            period={period}
            onPeriod={hadleChangeSelected}
            isModalOpen={isModalOpen}
            isPreloader={isPreloader}
          />
          <TransactionList
            listFilter={listFilter}
            filterText={filterText}
            onFilterText={handleFilterText}
            onRemove={handleRemove}
            onNew={handlePersist}
            onEdit={handleEditData}
            isModalOpen={isModalOpen}
          />
        </div>
      </main>

      {isModalOpen && (
        <Modal
          onSave={handlePersistData}
          dataSelected={dataSelected}
          isEdit={isEdit}
          onClose={handleClose}
        />
      )}
    </>
  );
}

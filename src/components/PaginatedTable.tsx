import React, { useState} from "react";
import '../styles/PaginatedTable.css';
import {FormattedTransaction} from "~/hooks/useFetchAddressTransactions";

export type PaginatedTableProps = {
  transactions: Array<FormattedTransaction>,
  isLoading: boolean,
  error:string|null;
}

const PaginatedTable = ({transactions, isLoading, error}: PaginatedTableProps) => {
  const [txData, setTxData] = useState<Array<FormattedTransaction>>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  if(transactions?.length > 0 && transactions.length != totalItems) {
    setTxData(transactions)
    setTotalItems(transactions?.length)
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = txData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(txData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>TX ID</th>
            <th>Amount (BTC)</th>
            <th>Fee (Sats)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.txId}</td>
              <td>{item.amount.toFixed(8)}</td>
              <td>{item.fee ? item.fee : '0'}</td>
              <td>
                <span className={`status ${item.status.toLowerCase()}`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;
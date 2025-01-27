import React, { useState} from "react";
import '../styles/PaginatedTable.css';
import {FormattedTransaction} from "~/hooks/useFetchAddressTransactions";
import {useFavoriteStore} from '../store/useFavoriteTxnsStore'

export type PaginatedTableProps = {
  transactions: FormattedTransaction[]|null,
  isLoading: boolean,
  error:string|null;
}

const PaginatedTable = ({transactions, isLoading, error}: PaginatedTableProps) => {
  const [txData, setTxData] = useState<Array<FormattedTransaction>>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoriteStore()
  const itemsPerPage = 10;

  if(transactions?.length && transactions.length > 0 && transactions.length != totalItems) {
    setTxData(transactions)
    setTotalItems(transactions?.length)
    setCurrentPage(1)
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = txData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(txData.length / itemsPerPage);

  const handlePageChange = (pageNumber:number) => {
    setCurrentPage(pageNumber);
  };

  const handleFavoriteToggle = (item: FormattedTransaction) => {
    if (isFavorite(item.txId)) {
      removeFavorite(item.txId)
    } else {
      addFavorite(item)
    }
  }

  return (
    <div>
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b border-slate-200 bg-slate-50">
              <p className="text-sm font-normal leading-none text-slate-500">
                Type</p>
            </th>
            <th className="p-4 border-b border-slate-200 bg-slate-50">
              <p className="text-sm font-normal leading-none text-slate-500">Date</p></th>
            <th className="p-4 border-b border-slate-200 bg-slate-50">
              <p className="text-sm font-normal leading-none text-slate-500">TX ID</p></th>
            <th className="p-4 border-b border-slate-200 bg-slate-50">
              <p className="text-sm font-normal leading-none text-slate-500">Amount (BTC)</p></th>
            <th className="p-4 border-b border-slate-200 bg-slate-50">
              <p className="text-sm font-normal leading-none text-slate-500">Fee (Sats)</p></th>
            <th className="p-4 border-b border-slate-200 bg-slate-50">
              <p className="text-sm font-normal leading-none text-slate-500">Status</p></th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>
                <button
                  id="fav"
                  onClick={() => handleFavoriteToggle(item)}
                  className={isFavorite(item.txId) ? 'favorite' : ''}
                >
                  {isFavorite(item.txId) ? '★' : '☆'}
                </button>
                {item.type}
              </td>
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
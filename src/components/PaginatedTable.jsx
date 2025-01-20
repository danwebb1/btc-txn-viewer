import {useLoading} from "../context/LoadingContext.jsx";
import React, {useEffect, useState} from "react";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.jsx";
import '../styles/PaginatedTable.css';
import {convertDate, getTransactionDetails} from "../utils";
const formatTxnData = async (txnData, address) => {
  const txns = []
   for (let index = 0; index < txnData.length; index++) {
     const txn = txnData[index]
     const details = await getTransactionDetails(txn.txid, address)
     const txnDetails = {
       type: details.type.toUpperCase(),
       txId: txn.txid,
       date: convertDate(txn?.status?.block_time),
       amount: details.amount || 0.00,
       status: txn.status.confirmed? 'CONFIRMED' : 'PENDING',
     }
     txns.push(txnDetails)
   }
   return txns
}

const PaginatedTable = (props) => {
  const {address} = props
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [txData, setTxData] = useState([]);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentAddress, setCurrentAddress] = useState(address)
  const itemsPerPage = 10;

  if (currentAddress !== address) {
    setCurrentAddress(address)
    setCurrentPage(1)
  }


  useEffect(() => {
    fetchData(address);
  }, [currentAddress]);

  const fetchData = async (address) => {
    if (address) {
      try {
        startLoading();
        const response = await axios.get(`https://mempool.space/api/address/${address}/txs`, {
          params: {
            page: currentPage,
            limit: itemsPerPage,
          }
        });
        const formatted = await formatTxnData(response.data, address)
        setTxData(formatted);
        setTotalItems(response.data.length);
        setError(null);
        setCurrentAddress(null)
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        stopLoading();
      }
    }
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = txData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(txData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <LoadingSpinner/>
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Date</th>
            <th>TX ID</th>
            <th>Amount (BTC)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.txId}</td>
              <td>{item.amount.toFixed(2)}</td>
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
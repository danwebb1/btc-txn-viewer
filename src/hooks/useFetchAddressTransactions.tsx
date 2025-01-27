import React, { useState, useEffect } from 'react';

interface Transaction {
  txid: string;
  version: number;
  locktime: number;
  vin: {
    txid: string;
    vout: number;
    prevout: {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
      value: number;
    };
    scriptsig: string;
    scriptsig_asm: string;
    witness: string[];
    is_coinbase: boolean;
    sequence: number;
  }[];
  vout: {
    value: number;
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
  }[];
  size: number;
  weight: number;
  fee: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
}

interface AddressTransactionsResponse {
  address: string;
  chain_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  mempool_stats: {
    funded_txo_count: number;
    funded_txo_sum: number;
    spent_txo_count: number;
    spent_txo_sum: number;
    tx_count: number;
  };
  transactions: Transaction[];
}

interface UseFetchTransactionsResult {
  transactions: Array<FormattedTransaction> | null;
  isLoading: boolean;
  error: string | null;
}

export interface FormattedTransaction {
  type: string;
  txId: string;
  amount: string;
  status: string;
  date: string;
  fee: number|null,
}
export const calculateTransactionDetails = (transactions: Transaction[], address: string): Array<FormattedTransaction> => {
  const txns:Array<any> = []

  transactions.forEach((transaction) => {
    let sendAmount:number|undefined = 0;
    let receiveAmount:number|undefined  = 0;
    let isFromAddress:boolean = false;
    let isSelfTransfer:boolean = false;

     // Process inputs (funds spent from the address)
    transaction.vin.forEach((input) => {
      if (input?.prevout?.scriptpubkey_address === address) {
         sendAmount += input.prevout.value;
         isFromAddress = true;
      }
    });

    // Process outputs (funds sent to the address)
    transaction.vout.forEach((output, index) => {
      if (output.scriptpubkey_address === address) {
        receiveAmount += output.value;
      }
    });

     if (isFromAddress && receiveAmount > 0) {
      const totalOutputs = transaction.vout.reduce((sum, output) => sum + output.value, 0);
      if (totalOutputs + transaction.fee === sendAmount) {
        isSelfTransfer = true;
      }
    }
    const type: 'send' | 'receive' | 'self' = isSelfTransfer
      ? 'self'
      : isFromAddress
        ? 'send'
        : 'receive';

    const effectiveFee = type === 'send' ? transaction.fee : 0;

    let date:Date|string = new Date();
    if (transaction?.status?.block_time && transaction?.status?.confirmed === true) {
      date = new Date(transaction?.status?.block_time * 1000);
    }
    date = (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + date.getFullYear()
    // Calculate net amount and transaction type
    if (sendAmount > 0) {
      const amount = -1 * sendAmount / 100000000;
      txns.push({
        type: 'SEND',
        txId: transaction.txid,
        amount,
        status: transaction.status.confirmed? 'CONFIRMED' : 'PENDING',
        date,
        fee: effectiveFee
      })
    } else {
      // This is a receive transaction
      txns.push({
        type: 'RECEIVE',
        txId: transaction.txid,
        amount: receiveAmount / 100000000,
        status: transaction.status.confirmed? 'CONFIRMED' : 'PENDING',
        date,
        fee: effectiveFee
      });
    }
  });
  return txns
}

const useFetchTransactions = (address: string|null): UseFetchTransactionsResult => {
  const [transactions, setTransactions] = useState<Array<FormattedTransaction> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      // If address is null or empty, reset states and return early
      setTransactions(null);
      setIsLoading(false);
      setError(null);
      return;
    }
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch<AddressTransactionsResponse>(`https://mempool.space/api/address/${address}/txs`);
        if (!response.ok) {
          throw new Error(`Error fetching transactions: ${response.statusText}`);
        }
        const data: Transaction[] = await response.json();
        const transactionsFormatted:Array<FormattedTransaction> = calculateTransactionDetails(data, address);
        transactionsFormatted.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
        setTransactions(transactionsFormatted);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address]);

  return { transactions, isLoading, error };
};
export default useFetchTransactions
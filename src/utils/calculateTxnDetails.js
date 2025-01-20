
export const calculateTransactionDetails = (tx, walletAddress) => {
  let inputAmount = 0;
  let outputAmount = 0;
  let changeAmount = 0;
  let netAmount = 0;

  // Calculate amount spent from inputs (vin)
  for (const input of tx.vin) {
    if (input?.prevout?.scriptpubkey_address === walletAddress) {
      inputAmount += input?.prevout.value;
    }
  }

  // Calculate amount received and change from outputs (vout)
  for (const output of tx.vout) {
    if (output?.scriptpubkey_address === walletAddress) {
      changeAmount += output.value;
    } else {
      outputAmount += output.value;
    }
  }

  // Calculate net amount and transaction type
  if (inputAmount > 0) {
    // This is a send transaction
    netAmount = -(inputAmount - changeAmount);
    return {
      type: 'send',
      totalSpent: inputAmount / 100000000,
      changeReceived: changeAmount / 100000000,
      netAmount: netAmount / 100000000,
      fee: (inputAmount - (outputAmount + changeAmount)) / 100000000
    };
  } else {
    // This is a receive transaction
    netAmount = changeAmount;
    return {
      type: 'receive',
      amount: changeAmount / 100000000,
      netAmount: netAmount / 100000000,
      fee: 0 // Receiver doesn't pay the fee
    };
  }
}

export async function getTransactionDetails(txid, address) {
  const response = await fetch(`https://mempool.space/api/tx/${txid}`);
  const tx = await response.json();
  return calculateTransactionDetails(tx, address);
}

export async function getAddressBalance(address) {
  // Get address UTXOs
  const response = await fetch(`https://mempool.space/api/address/${address}/utxo`);
  const utxos = await response.json();

  // Calculate total balance from UTXOs
  const balance = utxos.reduce((total, utxo) => total + utxo.value, 0);

  return {
    confirmedBalance: balance,
    satoshis: balance,
    bitcoin: balance / 100000000 // Convert sats to BTC
  };
}
import React, { useState,useEffect } from 'react';
import { validate, Network } from 'bitcoin-address-validation';
import '../styles/input.css';


type AddressInputProps = {
 onAddressChange: (value: string) => void;
}

async function getAddressBalance(address) {
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
const AddressInput = ({ onAddressChange}: AddressInputProps) => {
  const [inputText, setInputText] = useState<string>('');
  const [submittedAddress, setSubmittedAddress] = useState<string>('');
  const [addressBalance, setAddressBalance] = useState<number>(0)
  const [error, setError] = useState<string|null>(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate(inputText, Network.mainnet)) {
      setSubmittedAddress(inputText);
      onAddressChange(inputText)
      setError(null)
    } else {
      setError('Invalid address: '+inputText);
    }
    setInputText('');
  };

  useEffect(() => {
    async function fetchAddressData(address) {
      if(address !== '') {
      const balance = await getAddressBalance(address)
        setAddressBalance(balance.bitcoin)
      }
    }
    fetchAddressData(submittedAddress)
  }, [submittedAddress]);

  const handleChange = (e) => {
    setInputText(e.target.value);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={handleChange}
          placeholder="Enter address..."
        />
        <button type="submit">Search</button>
      </form>
      {(submittedAddress && !error) ? (
          <div className="addressBox">
            <p>
              <span>Address</span> {submittedAddress}
            </p>
            <p>
              <span>Balance</span> {addressBalance}
            </p>
        </div>
      ) : (submittedAddress && error) && (
           <h3 className="error">
             {error}
           </h3>
      )}
    </div>
  );
}
export default  AddressInput;
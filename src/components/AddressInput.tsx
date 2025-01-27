import React, { useState,useEffect } from 'react';
import { validate, Network } from 'bitcoin-address-validation';
import '../styles/input.css';


type AddressInputProps = {
 onAddressChange: (value: string) => void;
}

interface TransactionUTXO {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
}

async function getAddressBalance(address:string) {
  // Get address UTXOs
  const response = await fetch(`https://mempool.space/api/address/${address}/utxo`);
  const utxos = await response.json();

  // Calculate total balance from UTXOs
  const balance = utxos.reduce((total:number, utxo:TransactionUTXO) => total + utxo.value, 0);

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

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (validate(inputText, Network.mainnet)) {
      setSubmittedAddress(inputText);
      onAddressChange(inputText)
      setError(null)
    } else {
      setSubmittedAddress(' ');
      setError('Invalid address: '+inputText);
    }
    setInputText('');
  };

  useEffect(() => {
    async function fetchAddressData(address:string) {
      if(address !== '') {
      const balance = await getAddressBalance(address)
        setAddressBalance(balance.bitcoin)
      }
    }
    fetchAddressData(submittedAddress)
  }, [submittedAddress]);

  const handleChange = (e:any) => {
    setInputText(e.target.value);
  };
  return (
      <div>
        <div className="w-xl mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputText}
              onChange={handleChange}
              placeholder="Enter address..."
            />
            <button type="submit">Search</button>
          </form>
            <div className="addressBox">
          {(submittedAddress && !error) ? (
              <div>
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
      </div>
    </div>
  );
}
export default  AddressInput;
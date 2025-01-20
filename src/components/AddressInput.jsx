import React, { useState,useEffect } from 'react';
import { validate, Network } from 'bitcoin-address-validation';
import '../styles/input.css';
import {getAddressBalance} from "../utils/index.js";

function AddressInput({onAddressChange}) {
  const [inputText, setInputText] = useState('');
  const [submittedAddress, setSubmittedAddress] = useState('');
  const [addressBalance, setAddressBalance] = useState(0)
  const [error, setError] = useState(null);
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
    fetchAddressData(submittedAddress);
  }, [submittedAddress]);
  const fetchAddressData = async (address) => {
    if(address !== '') {
      const balance = await getAddressBalance(address)
      setAddressBalance(balance.bitcoin)
    }
  }

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
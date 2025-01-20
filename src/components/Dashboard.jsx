import React, {useState, useEffect} from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaginatedTable from "./PaginatedTable.jsx";
import AddressInput from "./AddressInput.jsx";
const Dashboard = ({ children }) => {
  const { user } = useAuth();
  const [address, setAddress] = useState(null);
  if (!user) {
    return <Navigate to="/login" />;
  }
  const handleAddressChange = (addressValue) => {
    setAddress(addressValue);
  };
  return (
      <div>
          <AddressInput onAddressChange={handleAddressChange}/>
          <PaginatedTable address={address} />
        {children}
      </div>
  )
};
export default Dashboard;

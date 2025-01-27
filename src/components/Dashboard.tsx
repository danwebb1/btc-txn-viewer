import React, {useState} from 'react'
import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import PaginatedTable from "./PaginatedTable";
import AddressInput from "./AddressInput";
import useFetchTransactions from "~/hooks/useFetchAddressTransactions";

interface DashboardProps {
    children?: React.ReactNode
}
const Dashboard = ({ children }: DashboardProps) => {
  const { user } = useAuth();
  const [address, setAddress] = useState<string | null>(null);
  const { transactions = [], isLoading, error } = useFetchTransactions(address)

  if (!user) {
    return <Navigate to="/login" />;
  }
  const handleAddressChange = (addressValue:string) => {
    setAddress(addressValue);
  };
  return (
      <div>
          <AddressInput onAddressChange={handleAddressChange}/>
          <PaginatedTable transactions={transactions} isLoading={isLoading} error={error} />
        {children}
      </div>
  )
};
export default Dashboard;

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
      <div className="w-xl mx-auto">
          <div>
            <AddressInput onAddressChange={handleAddressChange}/>
          </div>
          <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
            <PaginatedTable transactions={transactions} isLoading={isLoading} error={error} />
          </div>
        {children}
      </div>
  )
};
export default Dashboard;

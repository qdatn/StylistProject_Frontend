import React, { useEffect, useState } from 'react';
import MenuSidebar from './MenuSidebar';
import AccountDetails from './AccountDetail';
import { UserAccount } from '@src/types/UserAccount';

const AccountPage = () => {
  const [user, setUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    const userID = localStorage.getItem('userID');
    if (userID) {
      fetch(`/api/user/${userID}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, []);

  return (
    <div className="container mx-auto p-10 max-w-7xl flex">
      <MenuSidebar />
      <AccountDetails user={user} />
    </div>
  );
};

export default AccountPage;

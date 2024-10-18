'use client';
import React from 'react';
import RegisteredUsers from '@/components/dashboard/RegisterdUsers';
import styles from "../../components/common/table/DataTable.module.scss";

const Page: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Registered Users</h2>
      <div className={styles.registeredUsers}>
      <RegisteredUsers showButton={true} />
      </div>
    </div>
  );
};

export default Page;

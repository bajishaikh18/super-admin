'use client';
import React from 'react';
import RegisteredUsers from '@/components/dashboard/RegisterdUsers';
import styles from "../../components/common/table/DataTable.module.scss";

const Page: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Registered Users</h1>
      <div className={styles.registeredUsers}>
        <RegisteredUsers />
      </div>
    </div>
  );
};

export default Page;

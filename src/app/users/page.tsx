'use client';
import React from 'react';
import RegisteredUsers from '@/components/dashboard/RegisterdUsers';
import styles from "../../components/common/table/DataTable.module.scss";
import { Authorize } from '@/components/common/Authorize';
import { ROLE } from '@/helpers/constants';

const Page: React.FC = () => {
  return (
    <Authorize roles={[ROLE.superAdmin]}>

    <div className={styles.container}>
      <h2 className={styles.heading}>Registered Users</h2>
      <div className={styles.registeredUsers}>
      <RegisteredUsers showButton={true} />
      </div>
    </div>
    </Authorize>
  );
};

export default Page;

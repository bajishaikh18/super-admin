'use client';
import React from 'react';
import EmployersList from '@/components/employers/EmployersList';
import styles from "../../components/common/table/DataTable.module.scss";
import { Authorize } from '@/components/common/Authorize';
import { ROLE } from '@/helpers/constants';

const Page: React.FC = () => {
  return (
    <Authorize roles={[ROLE.superAdmin]}>

    <div className={styles.container}>
      <EmployersList />
    </div>
    </Authorize>
  );
};

export default Page;

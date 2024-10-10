'use client';
import React, { useState } from 'react';
import RegisteredUsers from '@/components/dashboard/RegisterdUsers';
import CreateUserForm from '@/components/Users/CreateUsers';
import styles from "../../components/common/table/DataTable.module.scss";
import { Button, Modal } from 'react-bootstrap';
import UsersRegistered from '@/components/Users/UsersRegisterd';

const Page: React.FC = () => {
  const [showCreateUser, setShowCreateUser] = useState(false);

  const handleCreateUserClick = () => {
    setShowCreateUser(true);
  };

  const handleCancelCreateUser = () => {
    setShowCreateUser(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Registered Users</h1>
      <div className={styles.registeredUsers}>
        <RegisteredUsers />
      </div>
      <Button onClick={handleCreateUserClick} className="btn-img">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"></svg> Create User +
      </Button>

      {/* Modal for Create User Form */}
      <Modal show={showCreateUser} onHide={handleCancelCreateUser} backdrop={false}>
        <Modal.Body>
          <CreateUserForm onCancel={handleCancelCreateUser} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Page;

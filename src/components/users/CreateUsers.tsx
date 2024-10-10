import { useState } from 'react';
import styles from "./CreateJob.module.scss";
import { Button, Form } from "react-bootstrap";
import { IoClose } from "react-icons/io5";

const CreateUserForm = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    mobileNumber: '',
    landlineNumber: '',
    email: '',
    address: '',
    state: '',
    country: ''
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleCancel = () => {
    setForm({
      firstName: '',
      lastName: '',
      companyName: '',
      mobileNumber: '',
      landlineNumber: '',
      email: '',
      address: '',
      state: '',
      country: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add logic to handle form submission, like API call
    console.log(form);
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h2>Create Employer</h2>
        <IoClose
          className={styles.closeButton}
          onClick={handleCancel}
        />
      </div>
      <Form className="post-form" onSubmit={handleSubmit}>
        <Form.Group className={styles.formGroup}>
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Company Name</Form.Label>
          <Form.Control
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Mobile Number</Form.Label>
          <Form.Control
            type="text"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Landline Number</Form.Label>
          <Form.Control
            type="text"
            name="landlineNumber"
            value={form.landlineNumber}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Company Email ID</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>State</Form.Label>
          <Form.Control
            as="select"
            name="state"
            value={form.state}
            onChange={handleChange}
            required
          >
            <option value="Maharashtra">Maharashtra</option>
            {/* Add more options */}
          </Form.Control>
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={form.country}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className={styles.actions}>
          <Button
            type="button"
            className="outlined action-buttons"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="action-buttons"
          >
            Proceed
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateUserForm;

import { useState } from 'react';
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import styles from './Registeredusers.module.scss';

const COUNTRIES = [
  { isdCode: "+1", name: "USA" },
  { isdCode: "+91", name: "India" },
  { isdCode: "+44", name: "UK" },
  // Add more countries as needed
];

const phoneRegex = /^[0-9]{10}$/; // Example regex for a 10-digit phone number

const CreateUserForm = ({ onCancel }: { onCancel: () => void }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    mobileNumber: '',
    landlineNumber: '',
    email: '',
    address: '',
    state: '',
    country: '',
    mobileCountryCode: '', 
    landlineCountryCode: ''
  });

  // Track if the user has interacted with the phone fields
  const [touched, setTouched] = useState({
    mobileNumber: false,
    landlineNumber: false,
  });

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value
    });
  };

  const handleTouch = (field: string) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
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
      country: '',
      mobileCountryCode: '',
      landlineCountryCode: ''
    });
    setTouched({ mobileNumber: false, landlineNumber: false }); // Reset touch state
    onCancel();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.companyName || !form.mobileNumber || !form.email || !form.address || !form.state || !form.country) {
      alert("Please fill in all required fields.");
      return;
    }
    console.log(form);
  };

  const isValid = form.firstName && form.lastName && form.companyName && form.mobileNumber && form.email && form.address && form.state && form.country;

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h3>Create User</h3>
        <IoClose className={styles.closeButton} onClick={handleCancel} />
      </div>
      <Form className={styles.postForm} onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className={styles.inputField}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className={styles.inputField}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Mobile Number</Form.Label>
              <InputGroup className={`contact-field`}>
                <Form.Select
                  className={styles.input}
                  name="mobileCountryCode"
                  value={form.mobileCountryCode}
                  onChange={handleChange}
                  required
                >
                  {COUNTRIES.map(country => (
                    <option value={country.isdCode} key={country.isdCode}>{country.isdCode}</option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="text"
                  name="mobileNumber"
                  value={form.mobileNumber}
                  onChange={handleChange}
                  onBlur={() => handleTouch('mobileNumber')} // Mark as touched on blur
                  required
                  aria-label="Contact number"
                  pattern={phoneRegex.source}
                />
              </InputGroup>
              {touched.mobileNumber && form.mobileNumber.length !== 10 && (
                <Form.Text className="error">
                  Enter a valid contact number
                </Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Landline Number</Form.Label>
              <InputGroup className={`contact-field`}>
                <Form.Select
                  className={styles.input}
                  name="landlineCountryCode"
                  value={form.landlineCountryCode}
                  onChange={handleChange}
                >
                  {COUNTRIES.map(country => (
                    <option value={country.isdCode} key={country.isdCode}>{country.isdCode}</option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="text"
                  name="landlineNumber"
                  value={form.landlineNumber}
                  onChange={handleChange}
                  onBlur={() => handleTouch('landlineNumber')} // Mark as touched on blur
                  aria-label="Landline number"
                  pattern={phoneRegex.source}
                />
              </InputGroup>
              {touched.landlineNumber && form.landlineNumber.length !== 10 && (
                <Form.Text className="error">
                  Enter a valid landline number
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Email ID</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={styles.inputField}
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
            className={styles.inputField}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Country</Form.Label>
              <CountryDropdown
                value={form.country}
                onChange={(val) => handleSelectChange('country', val)}
                classes={styles.inputField}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>State</Form.Label>
              <RegionDropdown
                country={form.country}
                value={form.state}
                onChange={(val) => handleSelectChange('state', val)}
                classes={styles.inputField}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className={styles.actions}>
          <Button
            type="button"
            className={`outlined action-buttons`}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className={`action-buttons ${isValid ? "" : styles.disabled}`}
            disabled={!isValid}
          >
            Proceed
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateUserForm;

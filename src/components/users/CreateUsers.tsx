import { useForm } from 'react-hook-form';
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { IoClose } from "react-icons/io5";
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import styles from './Registeredusers.module.scss';
import { useState } from 'react'; 

const COUNTRIES = [
  { isdCode: "+1", name: "USA" },
  { isdCode: "+91", name: "India" },
  { isdCode: "+44", name: "UK" },
  // Add more countries as needed
];

const phoneRegex = /^[0-9]{10}$/; // for a 10-digit phone number

const CreateUserForm = ({ onCancel }: { onCancel: () => void }) => {
  const { register, handleSubmit, formState: { errors, touchedFields }, reset, setValue, watch } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      mobileNumber: '',
      landlineNumber: '',
      email: '',
      address: '',
      state: '',
      country: '',
      mobileCountryCode: COUNTRIES[0].isdCode,
      landlineCountryCode: COUNTRIES[0].isdCode
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleCancel = () => {
    reset(); // Resets the form
    onCancel();
  };

  
  const selectedCountry = watch('country');

  return (
    <div className={styles.modal}>
      <div className={styles.modalHeader}>
        <h3>Create User</h3>
        <IoClose className={styles.closeButton} onClick={handleCancel} />
      </div>
      <Form className={styles.postForm} onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                {...register('firstName', { required: 'First name is required' })}
                className={styles.inputField}
              />
              {errors.firstName && <Form.Text className="error">{errors.firstName.message}</Form.Text>}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                {...register('lastName', { required: 'Last name is required' })}
                className={styles.inputField}
              />
              {errors.lastName && <Form.Text className="error">{errors.lastName.message}</Form.Text>}
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
                  {...register('mobileCountryCode')}
                >
                  {COUNTRIES.map(country => (
                    <option value={country.isdCode} key={country.isdCode}>{country.isdCode}</option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="text"
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: phoneRegex,
                      message: 'Enter a valid 10-digit mobile number'
                    }
                  })}
                  aria-label="Mobile number"
                />
              </InputGroup>
              {touchedFields.mobileNumber && errors.mobileNumber && (
                <Form.Text className="error">
                  {errors.mobileNumber.message}
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
                  {...register('landlineCountryCode')}
                >
                  {COUNTRIES.map(country => (
                    <option value={country.isdCode} key={country.isdCode}>{country.isdCode}</option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="text"
                  {...register('landlineNumber', {
                    pattern: {
                      value: phoneRegex,
                      message: 'Enter a valid 10-digit landline number'
                    }
                  })}
                  aria-label="Landline number"
                />
              </InputGroup>
              {touchedFields.landlineNumber && errors.landlineNumber && (
                <Form.Text className="error">
                  {errors.landlineNumber.message}
                </Form.Text>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Email ID</Form.Label>
          <Form.Control
            type="email"
            {...register('email', { required: 'Email is required' })}
            className={styles.inputField}
          />
          {errors.email && <Form.Text className="error">{errors.email.message}</Form.Text>}
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            {...register('address', { required: 'Address is required' })}
            className={styles.inputField}
          />
          {errors.address && <Form.Text className="error">{errors.address.message}</Form.Text>}
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>Country</Form.Label>
              <CountryDropdown
                value={watch('country') || ''} 
                onChange={(val) => {
                  setValue('country', val);  
                }}
                classes={styles.inputField}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className={styles.formGroup}>
              <Form.Label>State</Form.Label>
              <RegionDropdown
                country={watch('country') || ''} 
                value={watch('state') || ''} 
                onChange={(val) => {
                  setValue('state', val);  
                }}
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
            className={`action-buttons`}
          >
            Proceed
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateUserForm;

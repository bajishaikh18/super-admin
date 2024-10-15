import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { debounce } from 'lodash';
import styles from './Registeredusers.module.scss';

const COUNTRIES = [
  { isdCode: "+1", name: "USA" },
  { isdCode: "+91", name: "India" },
  { isdCode: "+44", name: "UK" },
];
const phoneRegex = /^[0-9]{10}$/;

  interface CreateUserFormProps {
    onCancel: () => void;
  }
const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCancel }) => {
  const { register, handleSubmit, formState: { errors,}, reset, setValue, watch, trigger} = useForm({
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
    console.log(errors);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const loadCountriesDebounced = useCallback(debounce((inputValue: string) => {
    console.log("Fetching countries for:", inputValue);
  }, 500), []);

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
                {...register('firstName', { 
                  required: 'First name is required',
                  onChange: () => trigger('firstName'), 
                })}
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
                {...register('lastName', { 
                  required: 'Last name is required',
                  onChange: () => trigger('lastName'), 
                })}
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
                  {...register('mobileCountryCode', {
                    required: 'Country code is required',
                    onChange: () => trigger('mobileCountryCode'),
                  })}
                >
                {
                  Object.values(COUNTRIES).map(country => (
                    <option value={country.isdCode} key={country.isdCode}>
                      {country.isdCode} 
                    </option>
                  ))
                }
                </Form.Select>
                <Form.Control
                  aria-label="Mobile number"
                  {...register('mobileNumber', {
                    required: 'Mobile number is required',
                    pattern: {
                      value: phoneRegex,
                      message: 'Enter a valid mobile number',
                    },
                    onChange: () => trigger('mobileNumber'),
                  })}
                  isInvalid={!!errors.mobileNumber}
                />
              </InputGroup>
              {errors.mobileNumber && (
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
            {...register('landlineCountryCode', {
            required: 'Country code is required',
            onChange: () => trigger('landlineCountryCode'),
            })}
          >
          {Object.values(COUNTRIES).map((country) => (
            <option value={country.isdCode} key={country.isdCode}>
              {country.isdCode}
            </option>
          ))}
        </Form.Select>
        <Form.Control
          aria-label="Landline number"
          {...register('landlineNumber', {
            required: 'Landline number is required',
            pattern: {
              value: phoneRegex,
              message: 'Enter a valid Landline number',
            },
            onChange: () => trigger('landlineNumber'),
          })}
        />
      </InputGroup>
      {errors.landlineNumber && (
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
            type="text"
            placeholder="Enter Email Id"
            className={styles.input}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
              onChange: () => trigger('email'),
            })}
          />
            {errors.email && (
              <Form.Text className="error">{errors.email.message}</Form.Text>
            )}        
        </Form.Group>

        <Form.Group className={styles.formGroup}>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            {...register('address', { 
              required: 'Address is required',
              onChange: () => trigger('address'), 
            })}
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
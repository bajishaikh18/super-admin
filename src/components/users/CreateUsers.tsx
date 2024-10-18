import React, {useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Form, Row, Col, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import { GetCountries, GetStates } from 'react-country-state-city';
import { debounce } from 'lodash';
import { inviteUser } from "@/apis/user";
import { toast } from 'react-hot-toast';
import styles from './Registeredusers.module.scss';

const COUNTRIES = [
  { isdCode: "+1", name: "USA" },
  { isdCode: "+91", name: "India" },
  { isdCode: "+44", name: "UK" },
];
const phoneRegex = /^[0-9]{10}$/;

interface Country {
  id: string;
  name: string;
}

interface State {
  id: string; 
  name: string;
}

  interface CreateUserFormProps {
    onCancel: () => void;
  }
const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCancel }) => {
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [countrySearch, setCountrySearch] = useState('');
  const [stateSearch, setStateSearch] = useState('');
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [countryDropdownVisible, setCountryDropdownVisible] = useState(false);
  const [stateDropdownVisible, setStateDropdownVisible] = useState(false);

  const { register, handleSubmit, formState: { errors,}, reset, setValue, watch, trigger} = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
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
  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await GetCountries();
      setCountryList(countries);
      setFilteredCountries(countries);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountryId) {
        const states = await GetStates(selectedCountryId);
        setStateList(states);
        setFilteredStates(states); 
      }
    };
  
    fetchStates();
  }, [selectedCountryId]);

  const onSubmit = async (data: any) => {
    console.log("Data:", data);
    setLoading(true);
    try {
      const userDetails = {
        ...data,
        role: 3, 
        pass: "123",
      };
      const response = await inviteUser(userDetails);
      console.log("Submitting data:", response);
      toast.success("User invited successfully");
      reset();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Error inviting user. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const loadCountriesDebounced = useCallback(
    debounce((searchTerm: string) => {
      const filtered = countryList.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }, 500),
    [countryList]
  );

  const handleCountrySearch = (searchTerm: string) => {
    setCountrySearch(searchTerm);
    loadCountriesDebounced(searchTerm);
    setCountryDropdownVisible(true); 
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountryId(country.id);
    setSelectedCountryName(country.name);
    setCountrySearch(''); 
    setCountryDropdownVisible(false); 
    setSelectedStateId(''); 
    setStateDropdownVisible(false); 
  };

  const handleStateSearch = (searchTerm: string) => {
    setStateSearch(searchTerm);
    const filtered = stateList.filter((state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStates(filtered);
    setStateDropdownVisible(filtered.length > 0); 
  };

  const handleStateSelect = (stateId: string) => {
    setSelectedStateId(stateId);
    setStateDropdownVisible(false);
    setStateSearch('');
};
  
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
      <div className={styles.dropdownContainer}>
        <Form.Control
          type="text"
          value={selectedCountryName || countrySearch}
          onChange={(e) => handleCountrySearch(e.target.value)}
          onFocus={() => setCountryDropdownVisible(true)}
          placeholder="Select a country"
        />
        {countryDropdownVisible && (
          <Dropdown className={styles.dropdownMenu}>
            {filteredCountries.map((country) => (
              <Dropdown.Item
                key={country.id}
                onClick={() => handleCountrySelect(country)}
              >
                {country.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        )}
      </div>
    </Form.Group>
  </Col>
  <Col md={6}>
      <Form.Group className={styles.formGroup}>
        <Form.Label>State</Form.Label>
        <div className={styles.dropdownContainer}>
          <Form.Control
            type="text"
            value={stateSearch}
            onChange={(e) => handleStateSearch(e.target.value)}
            onFocus={() => setStateDropdownVisible(true)}
            placeholder="Select a state"
            readOnly={!selectedCountryId} 
          />
          {stateDropdownVisible && filteredStates.length > 0 && (
            <Dropdown className={styles.dropdownMenu}>
              {filteredStates.map((state) => (
                <Dropdown.Item
                  key={state.id}
                  onClick={() => handleStateSelect(state.id)} 
                >
                  {state.name}
                </Dropdown.Item>
              ))}
            </Dropdown>
          )}
        </div>
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
            disabled={loading}
          >
        {loading ? <div className={styles.spinner}></div> : "Create"}          
        </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateUserForm;
import { Form } from "react-bootstrap";
import {
  Control,
  Controller,
  FieldError,
  RegisterOptions,
} from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.scss";
import Image from "next/image";

export const CustomDatePicker = ({
  name,
  control,
  error,
  rules,
  minDate,
  defaultValue,
}: {
  name: string;
  control: Control<any, any>;
  error?: FieldError;
  defaultValue?:string;
  rules?: Omit<
    RegisterOptions<any, string>,
    "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate"
  >;
  minDate?: Date;
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <>
            <DatePicker
              selected={value}
              onChange={onChange}
              dateFormat="dd-MM-yyyy"
              placeholderText="DD-MM-YYYY"
              popperClassName="custom-date-picker"
              minDate={minDate}
              showFullMonthYearPicker
              customInput={
                <Form.Control
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChange={onChange}
                  readOnly
                  isInvalid={!!error}
                />
              }
              popperPlacement="bottom"
            />
            <Image src="/calendar.svg" className="calendar-icon" alt="Calendar" width={18} height={20.8} />
          </>
        )}
        rules={rules}
      />
      {error && <Form.Text className="error">{error.message}</Form.Text>}
    </>
  );
};

export const CustomDateTimePicker = ({
  name,
  control,
  error,
  rules,
  minDate,
  defaultValue,
}: {
  name: string;
  control: Control<any, any>;
  error?: FieldError;
  defaultValue?:string;
  rules?: Omit<
    RegisterOptions<any, string>,
    "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate"
  >;
  minDate?: Date;
}) => {
  console.log(defaultValue);
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <>
            <DatePicker
              selected={value}
              showYearDropdown
              onChange={onChange}
              showTimeSelect
              dateFormat="dd-MM-yyyy h:mm aa"
              placeholderText="DD-MM-YYYY"
              popperClassName="custom-date-picker"
              minDate={minDate}
              customInput={
                <Form.Control
                  type="text"
                  placeholder="YYYY-MM-DD"
                  value={value}
                  onChange={onChange}
                  readOnly
                  isInvalid={!!error}
                />
              }
              popperPlacement="bottom"
            />
            <Image src="/calendar.svg" className="calendar-icon" alt="Calendar" width={18} height={20.8} />
          </>
        )}
        rules={rules}
      />
      {error && <Form.Text className="error">{error.message}</Form.Text>}
    </>
  );
};

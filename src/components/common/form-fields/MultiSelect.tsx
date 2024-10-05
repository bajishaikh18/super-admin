import { SelectOption } from "@/helpers/types";
import { Form } from "react-bootstrap";
import { Control, Controller, FieldError, RegisterOptions } from "react-hook-form";
import Select, { GroupBase, StylesConfig } from "react-select";

export const MultiSelect = ({
  name,
  control,
  options,
  error,
  rules,
  defaultValue,
  customStyles,
  valueContainerStyles={},
  menuListStyles={}
}: {
  name: string;
  control: Control<any, any>;
  options: SelectOption[];
  error?: FieldError;
  rules?: Omit<
    RegisterOptions<any, string>,
    "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate"
  >;
  defaultValue?: string,
  customStyles:any
  valueContainerStyles?: any,
  menuListStyles?:any
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: 'rgba(246, 241, 255, 1)',
                primary: '#0045E6',
              },
            })}
            styles={{
              option:(baseStyles, state)=>({
                ...baseStyles,
                borderBottom:'1px solid rgba(217, 217, 217, 1)'
              }),
              control: (baseStyles, state) => ({
                ...baseStyles,
                fontSize: "16px",
                borderRadius: "8px",
                border:  state.isFocused ? "1px solid #0045E6":"1px solid rgba(189, 189, 189, 1)",
                minHeight: "44px",
                ...customStyles,
                svg: {
                  path: {
                    fill: "#000",
                  },
                },
                boxShadow: state.isFocused ? 'none' : 'none',
                "&:focus":{
                  border:"1px solid green",
                  boxShadow:'none'
                }
              }),
              menuList:(baseStyles, state) =>({...baseStyles,
                ...menuListStyles
               
              }),
              valueContainer:(baseStyles, state) =>({...baseStyles,...valueContainerStyles}),
              indicatorSeparator: () => ({ display: "none" }),

            }}
            defaultValue={options.find((c) => c.value === defaultValue)}
            options={options}
            value={options.find((c) => c.value === value)}
            onChange={(val) => onChange(val?.value)}
          />
        )}
        defaultValue={defaultValue}
        rules={rules}
      />
      {error && <Form.Text className="error">{error.message}</Form.Text>}
    </>
  );
};

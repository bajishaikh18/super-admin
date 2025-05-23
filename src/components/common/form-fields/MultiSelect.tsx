import { SelectOption } from "@/helpers/types";

import { Form } from "react-bootstrap";
import { Control, Controller, FieldError, RegisterOptions } from "react-hook-form";
import Select from "react-select";
import AsyncSelect from 'react-select/async';

export const MultiSelect = ({
  name,
  control,
  options,
  error,
  rules,
  defaultValue,
  customStyles,
  valueContainerStyles={},
  menuListStyles={},
  filterFn,
  menuPortalTarget,
  menuPosition,
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
  menuPortalTarget?:any,
  menuPosition?:any,
  menuListStyles?:any
  filterFn?:any
}) => {
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Select
            menuPortalTarget={menuPortalTarget}
            menuPosition={menuPosition}
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
              option:(baseStyles)=>({
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
              menuList:(baseStyles) =>({...baseStyles,
                ...menuListStyles
               
              }),
              valueContainer:(baseStyles) =>({...baseStyles,...valueContainerStyles}),
              indicatorSeparator: () => ({ display: "none" }),

            }}
            defaultValue={options.find((c) => c.value === defaultValue)}
            options={options}
            value={options.find((c) => c.value === value)}
            onChange={(val) => onChange(val?.value)}
            filterOption={filterFn}
            
          />
        )}
        defaultValue={defaultValue}
        rules={rules}
      />
      {error && <Form.Text className="error">{error.message}</Form.Text>}
    </div>
  );
};


export const MultiSelectAsync = ({
  name,
  control,
  loadOptions,
  error,
  defaultOptions,
  rules,
  defaultValue,
  customStyles,
  valueContainerStyles={},
  menuListStyles={},
  menuPortalTarget,
  menuPosition,
  isMulti,
  placeHolder
}: {
  name: string;
  control: Control<any, any>;
  loadOptions: any;
  defaultOptions?:any;
  error?: FieldError;
  rules?: Omit<
    RegisterOptions<any, string>,
    "disabled" | "setValueAs" | "valueAsNumber" | "valueAsDate"
  >;
  defaultValue?: {
    label:string,
    value:string
  },
  customStyles:any
  valueContainerStyles?: any,
  menuPortalTarget?:any,
  menuPosition?:any,
  menuListStyles?:any,
  isMulti?:boolean
  placeHolder?:string
}) => {
  console.log(defaultValue)
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <AsyncSelect
            isMulti={isMulti}
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions={defaultOptions}
            menuPortalTarget={menuPortalTarget}
            menuPosition={menuPosition}
            placeholder={placeHolder || "Select..."}
            noOptionsMessage={() => null}
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
              option:(baseStyles)=>({
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
              
              menuList:(baseStyles) =>({...baseStyles,
                ...menuListStyles,
              }),
              menu:(baseStyles) =>({...baseStyles,
                ...menuListStyles,
              }),
              valueContainer:(baseStyles) =>({...baseStyles,...valueContainerStyles}),
              indicatorSeparator: () => ({ display: "none" }),

            }}
            maxMenuHeight={400}
            defaultValue={defaultValue}
            // value={loadOptions?.then((option:any)=>{
            //   return option.find((c:any) => c.value === value)
            // })}
            onChange={(val) => onChange((val as any))}
          />
        )}
        defaultValue={defaultValue}
        rules={rules}
      />
      {error && <Form.Text className="error">{error.message}</Form.Text>}
    </div>
  );
};


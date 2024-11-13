import { SelectOption } from "@/helpers/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Form } from "react-bootstrap";
import { Control, Controller, FieldError, RegisterOptions } from "react-hook-form";
import Select, { GroupBase, StylesConfig } from "react-select";
import AsyncSelect from 'react-select/async';

export const MultiSelect = ({
  name,
  control,
  options,
  error,
  rules,
  defaultValue,
  onChange,
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
  onChange: (selected: any, actionMeta: any) => void;
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
  rules,
  defaultValue,
  customStyles,
  valueContainerStyles={},
  menuListStyles={},
  menuPortalTarget,
  menuPosition,
  isMulti
}: {
  name: string;
  control: Control<any, any>;
  loadOptions: any;
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
}) => {
  console.log(defaultValue)
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <AsyncSelect
            isMulti={isMulti}
            cacheOptions
            loadOptions={loadOptions}
            defaultOptions
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
                ...menuListStyles,
              }),
              menu:(baseStyles, state) =>({...baseStyles,
                ...menuListStyles,
              }),
              valueContainer:(baseStyles, state) =>({...baseStyles,...valueContainerStyles}),
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
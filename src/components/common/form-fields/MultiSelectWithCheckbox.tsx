import { IMAGE_BASE_URL } from "@/helpers/constants";
import { SelectOption } from "@/helpers/types";
import Image from "next/image";
import React from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Control, Controller, FieldError, RegisterOptions} from "react-hook-form";
import Select, { components } from "react-select";
import AsyncSelect from 'react-select/async';


const ValueContainer = (props:any) => {
    let length = props.getValue().length;
  
    return (
      <components.ValueContainer {...props} className="value-container">
        {length > 2 ? (
          <>
            {props.children[0][0]}
            <h6>+ {length - 1} More</h6>
            {React.cloneElement(props.children[1])}
          </>
        ) : (
          <>{props.children}</>
        )}
      </components.ValueContainer>
    );
  };

const Option = (props: any) => {
    return (
        <div>
        {props.value == 'all' ? <components.Option {...props} className="multiselect-checkbox-container">
          <label>{props.label}</label>
        </components.Option> : 
        <components.Option {...props} className="multiselect-checkbox-container">
          <input type="checkbox" checked={props.isSelected} className="multiselect-checkbox" onChange={() => null} />{" "}
          {
            props.data?.image &&   <Image
            src={`${props.data?.hasImage ? `${IMAGE_BASE_URL}/${props.data?.image}`: props.data?.image}`}
            width={24}
            height={24}
            alt="agency-logo"
          />
          }
          <label>{props.label}</label>
        </components.Option>
}
      </div>
    );
};


export const MultiSelectWithCheckbox = ({
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
  filterFn?:any,
}) => {
  const [selectedOptions,setSelectedOptions] = useState<any>([]);
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange } }) => (
          <Select
            menuPortalTarget={menuPortalTarget}
            menuPosition={menuPosition}
            isMulti={true}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            components={{
              Option,
              ValueContainer
            }}
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
              multiValue:(base) =>({
                ...base,
                background:'rgba(183, 182, 252, 1)'
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
                fontSize:'13px'
               
              }),
              valueContainer:(baseStyles) =>({...baseStyles,...valueContainerStyles}),
              indicatorSeparator: () => ({ display: "none" }),

            }}
            defaultValue={options.find((c) => c.value === defaultValue)}
            options={options}
            value={selectedOptions}
            onChange={(val) => {
            const isAllSelected = val.find(x=>x.value === 'all');
            if(isAllSelected){
                if(selectedOptions.length != options.length){
                    setSelectedOptions(options)
                }else{
                    const removedAll = val.filter(x=>x.value!='all');
                    setSelectedOptions(removedAll);
                    onChange(removedAll)
                }
            }else{
                setSelectedOptions(val);
                onChange(val)
            }
            }}
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


export const MultiSelectAsyncWithCheckbox = ({
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
  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange} }) => (
          <AsyncSelect
            isMulti={isMulti}
            cacheOptions
            hideSelectedOptions={false}
            loadOptions={loadOptions}
            closeMenuOnSelect={false}
            defaultOptions
            components={{
                Option,
                ValueContainer
            }}
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
              multiValue:(base) =>({
                ...base,
                background:'rgba(183, 182, 252, 1)'
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
                fontSize:'13px'
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
            onChange={(val) => {
                
                    onChange(val)
                
            }}
          />
        )}
        defaultValue={defaultValue}
        rules={rules}
      />
      {error && <Form.Text className="error">{error.message}</Form.Text>}
    </div>
  );
};


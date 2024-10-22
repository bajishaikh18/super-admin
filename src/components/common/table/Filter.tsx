import { SelectOption } from "@/helpers/types";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BsCalendar2, BsFilter, BsSearch } from "react-icons/bs";
import Select, { components, GroupBase, SelectInstance } from "react-select";

const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props} className="radio-item">
        <input type="radio" checked={props.isSelected} onChange={() => null} />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export const TableFilter = ({
  search,
  field,
  handleFilterChange,
  handleChange,
  columnsHeaders,
}: {
  search: string;
  field: SelectOption;
  handleChange: (data: any) => void;
  handleFilterChange: (data: any) => void;
  columnsHeaders: any[];
}) => {
  const ref = useRef<SelectInstance>(null);
  const [type, setType] = useState<string>("text");
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [dropDownOptions,setDropDownOptions] = useState<SelectOption[]>([]);
  const openFilter = () => {
    setMenuIsOpen((value) => !value);
    const selectEl = ref.current;
    if (!selectEl) return;
    if (menuIsOpen) selectEl.blur();
    else selectEl.focus();
  };
  const options: any = columnsHeaders.filter(x=>!x.meta || x.meta?.filter != false).map((x) => {
    return {
      label: x.header,
      value: x.accessorKey,
      type: x.meta?.filterType || "text",
      selectOptions: x.meta?.selectOptions
    };
  });
  return (
    <div className="filter-section ms-auto">
      {
        {
          text: (
            <InputGroup>
              <InputGroup.Text>
                <BsSearch fontSize={12} />
              </InputGroup.Text>
              <Form.Control
                className="extra-small"
                placeholder={`Search by ${field.label}`}
                value={search}
                onChange={(e)=>{
                  handleChange(e.target.value)
                }}
              />
            </InputGroup>
          ),
          number: (
            <InputGroup>
              <InputGroup.Text>
                <BsSearch fontSize={12} />
              </InputGroup.Text>
              <Form.Control
                className="extra-small"
                placeholder={`Search by ${field.label}`}
                value={search}
                type="number"
                onChange={(e)=>{
                  handleChange(e.target.value)
                }}
              />
            </InputGroup>
          ),
          select: (
            <InputGroup>
              <InputGroup.Text>
                <BsSearch fontSize={12} />
              </InputGroup.Text>
              <Select
                options={dropDownOptions}
                isMulti={false}
                placeholder={`Select ${field.label}`}
                hideSelectedOptions={false}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 0,
                  colors: {
                    ...theme.colors,
                    primary25: "rgba(246, 241, 255, 1)",
                    primary: "#0045E6",
                  },
                })}
                maxMenuHeight={400}
                styles={{
                  option: (baseStyles, state) => ({
                    ...baseStyles,
                    borderBottom: "1px solid rgba(217, 217, 217, 1)",
                  }),
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: "14px",
                    borderRadius: "0px 8px 8px 0px",
                    border:  state.isFocused ? "1px solid #0045E6":"1px solid rgba(189, 189, 189, 1)",
                    height: "32px",
                    minHeight:"32px",
                    width:"180px",
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
                  valueContainer:(baseStyles)=>({
                    ...baseStyles,
                    padding:"0px 8px",
                    
                  }),
                  dropdownIndicator:(baseStyles)=>({
                    ...baseStyles,
                    padding:"0px 3px"
                  }),
                  indicatorSeparator: () => ({ display: "none" }),
                  menuList: (baseStyles, state) => ({
                    ...baseStyles,
                    fontSize: "12px",
                  }),
                  menu:(baseStyles, state) => ({
                    ...baseStyles,
                    zIndex: 2,     
                               })
                }}
                onChange={(val: any) => {
                  handleChange(val.value);
                }}
                value={dropDownOptions.find(val=>val.value===search)}
                closeMenuOnSelect={true}
              />
            </InputGroup>
          ),
          date: (
            <>
            <p className="field-label">
            {field.label}
            </p>
            <InputGroup>
              <InputGroup.Text>
                <BsCalendar2 fontSize={12} />
              </InputGroup.Text>
              <DatePicker
                selected={search ? new Date(search): new Date()}
                onChange={(val)=>{
                  handleChange(val)

                }}
                dateFormat="dd-MM-yyyy"
                placeholderText="DD-MM-YYYY"
                popperClassName="custom-date-picker"
                customInput={
                  <Form.Control
                    type="text"
                    className="extra-small"
                    placeholder="YYYY-MM-DD"
                    value={search}
                    onChange={(val)=>{
                      handleChange(val)
                    }}
                    readOnly
                  />
                }
                popperPlacement="bottom"
              />
            </InputGroup>
            </>
          ),
        }[type]
      }

      <div>
        <div className="filter-icon" onClick={openFilter}>
          <Image src="./filter.svg" alt="filter" width={12} height={12} />
        </div>
      </div>
      <div className="select-container">
        <Select
          ref={ref}
          options={options}
          menuIsOpen={menuIsOpen}
          isMulti={false}
          hideSelectedOptions={false}
          components={{
            Option,
          }}
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "rgba(246, 241, 255, 1)",
              primary: "#0045E6",
            },
          })}
          styles={{
            option: (baseStyles, state) => ({
              ...baseStyles,
              borderBottom: "1px solid rgba(217, 217, 217, 1)",
            }),
            control: (baseStyles, state) => ({
              display: "none",
            }),
            menuList: (baseStyles, state) => ({
              fontSize: "12px",
            }),
          }}
          onChange={(val: any) => {
            setType(val?.type);
            if(val.selectOptions){
              setDropDownOptions(val.selectOptions)
            }else{
              setDropDownOptions([])
            }
            handleChange("");
            setMenuIsOpen(false);
            handleFilterChange(val);
          }}
          value={field}
          closeMenuOnSelect={true}
        />
      </div>
    </div>
  );
};

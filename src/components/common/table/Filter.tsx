import { SelectOption } from "@/helpers/types";
import Image from "next/image";
import { useRef, useState } from "react";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { BsFilter, BsSearch } from "react-icons/bs";
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
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const openFilter = () => {
    setMenuIsOpen((value) => !value);
    const selectEl = ref.current;
    if (!selectEl) return;
    if (menuIsOpen) selectEl.blur();
    else selectEl.focus();
  };
  const options: any = columnsHeaders.map((x) => {
    return {
      label: x.header,
      value: x.accessorKey,
    };
  });
  return (
    <div className="filter-section">
      <InputGroup>
        <InputGroup.Text>
          <BsSearch fontSize={12} />
        </InputGroup.Text>
        <Form.Control
          className="extra-small"
          placeholder={`Search by ${field.label}`}
          value={search}
          onChange={handleChange}
        />
      </InputGroup>

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
              display: "none",
            }),
            menuList: (baseStyles, state) => ({
              fontSize:"12px"
            })
          }}
          onChange={(val) => {
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

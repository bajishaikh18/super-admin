import { Form, InputGroup } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";

export const TableFilter = ({
  search,
  handleChange,
}: {
  search: string;
  handleChange: (data: any) => void;
}) => {
  return (
    <div className="filter-section">
      <InputGroup>
        <InputGroup.Text>
          <BsSearch fontSize={12} />
        </InputGroup.Text>
        <Form.Control
          className="extra-small"
          placeholder="Search"
          value={search}
          onChange={handleChange}
        />
      </InputGroup>
    </div>
  );
};

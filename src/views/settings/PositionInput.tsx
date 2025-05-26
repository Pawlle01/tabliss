import React from "react";
import { WidgetPosition } from "../../db/state";
import "./PositionInput.css";

type Props = {
  value: WidgetPosition;
  onChange: (value: WidgetPosition) => void;
};

const PositionInput: React.FC<Props> = ({ value, onChange }) => {
  const handleChange = (axis: "x" | "y") => (event: React.ChangeEvent<HTMLInputElement>) => {
    const updated = {
      ...value,
      [axis]: Number(event.target.value),
    };
    onChange(updated);
  };

  return (
    <div className="PositionInput">
      <label>Position</label>
      <div className="position-coordinates">
        <label>
          X:
          <input
            type="number"
            value={value.x}
            onChange={handleChange("x")}
          />
        </label>
        <label>
          Y:
          <input
            type="number"
            value={value.y}
            onChange={handleChange("y")}
          />
        </label>
      </div>
    </div>
  );
};

export default PositionInput;

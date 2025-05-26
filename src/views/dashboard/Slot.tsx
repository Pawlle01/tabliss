import React from "react";
import { WidgetPosition, WidgetState } from "../../db/state";
import { getConfig } from "../../plugins";
import Plugin from "../shared/Plugin";
import "./Slot.sass";
import Widget from "./Widget";

type Props = {
  position: WidgetPosition;
  widgets: WidgetState[];
};

const Slot: React.FC<Props> = ({ position, widgets }) => (
  <div
    className="Slot"
    style={{
      position: "absolute",
      left: position.x,
      top: position.y,
    }}
  >
    {widgets.map((widget) => (
      <Widget key={widget.id} plugin={widget} readonly>
        <Plugin id={widget.id} component={getConfig(widget.key).dashboardComponent} />
      </Widget>
    ))}
  </div>
);

export default Slot;

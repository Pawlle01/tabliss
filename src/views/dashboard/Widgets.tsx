import React from "react";
import { selectWidgets } from "../../db/select";
import { db } from "../../db/state";
import { useSelector, useValue } from "../../lib/db/react";
import Widget from "./Widget";
import Plugin from "../shared/Plugin";
import { getConfig } from "../../plugins";
import "./Widgets.sass";

const Widgets: React.FC = () => {
  const focus = useValue(db, "focus");
  const widgets = useSelector(db, selectWidgets);

  return (
    <div className="Widgets fullscreen">
      <div className="container" style={{ position: "relative" }}>
        {!focus &&
          widgets.map((widget) => (
            <div
              key={widget.id}
              style={{
                position: "absolute",
                left: widget.display.position.x,
                top: widget.display.position.y,
                fontSize: widget.display.fontSize,
                color: widget.display.colour,
                pointerEvents: "all",
              }}
              className="weight-override"
            >
              <div
                style={{
                  fontWeight: widget.display.fontWeight,
                  fontFamily: widget.display.fontFamily,
                }}
              >
                <Widget plugin={widget} readonly>
                  <Plugin
                    id={widget.id}
                    component={getConfig(widget.key).dashboardComponent}
                  />
                </Widget>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Widgets;

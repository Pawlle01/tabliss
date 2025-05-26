import React, { useState, useRef, useEffect } from "react";
import { selectWidgets } from "../../db/select";
import { db } from "../../db/state";
import { useSelector, useValue } from "../../lib/db/react";
import Widget from "./Widget";
import Plugin from "../shared/Plugin";
import { getConfig } from "../../plugins";
import { setWidgetDisplay } from "../../db/action";
import { Icon } from "../shared";
import "./Widgets.sass";

const Widgets: React.FC = () => {
  const focus = useValue(db, "focus");
  const lock = useValue(db, "lock");
  const widgets = useSelector(db, selectWidgets);

  // Dragging state
  const draggingRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;

      const { id, offsetX, offsetY } = draggingRef.current;
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;

      // Update widget position in DB
      setWidgetDisplay(id, { position: { x, y } });
    };

    const onMouseUp = () => {
      draggingRef.current = null;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent, widgetId: string) => {
    if (lock) return; // Ignore drag if locked

    // Prevent default to avoid text selection during drag
    e.preventDefault();

    // Calculate offset between cursor and widget top-left corner
    const widgetElement = (e.target as HTMLElement).closest(".widget-text-wrapper") as HTMLElement;
    if (!widgetElement) return;

    const rect = widgetElement.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    draggingRef.current = { id: widgetId, offsetX, offsetY };
  };


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
              className="widget-text-wrapper weight-override"
              onMouseDown={(e) => onMouseDown(e, widget.id)}
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

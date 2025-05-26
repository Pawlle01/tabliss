import React, { ReactNode } from "react";
import { setWidgetDisplay } from "../../db/action";
import { WidgetState } from "../../db/state";
import { useToggle } from "../../hooks";
import { getConfig } from "../../plugins";
import { DownIcon, Icon, IconButton, RemoveIcon, UpIcon } from "../shared";
import PluginContainer from "../shared/Plugin";
import ToggleSection from "../shared/ToggleSection";
import WidgetDisplay from "../settings/WidgetDisplay";

interface Props {
  plugin: WidgetState;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  children?: ReactNode;
  readonly?: boolean;  // NEW prop
}

const Widget: React.FC<Props> = ({
  plugin,
  onMoveDown,
  onMoveUp,
  onRemove,
  children,
  readonly = false,  // default to false
}) => {
  // In readonly mode, the widget content is shown without any editing UI or buttons
  // So we skip toggle logic and editing controls

  const [isOpen, toggleIsOpen] = useToggle(onRemove === undefined);

  const { description, name, settingsComponent } = getConfig(plugin.key);

  const setDisplay = setWidgetDisplay.bind(null, plugin.id);

  if (readonly) {
    // Minimal rendering for readonly display
    return (
      <div className="Widget readonly">
        <div className="widget-content">{children}</div>
      </div>
    );
  }

  return (
    <fieldset className="Widget">
      <div className="title--buttons">
        {onRemove && (
          <IconButton onClick={onRemove} title="Remove widget">
            <RemoveIcon />
          </IconButton>
        )}

        <IconButton
          onClick={toggleIsOpen}
          title={`${isOpen ? "Close" : "Edit"} widget settings`}
        >
          <Icon name="settings" />
        </IconButton>

        {onMoveDown && (
          <IconButton onClick={onMoveDown} title="Move widget down">
            <DownIcon />
          </IconButton>
        )}

        {onMoveUp && (
          <IconButton onClick={onMoveUp} title="Move widget up">
            <UpIcon />
          </IconButton>
        )}

        <h4 onClick={toggleIsOpen}>{name}</h4>
        {!isOpen && <p>{description}</p>}
      </div>

      {isOpen && (
        <div>
          {settingsComponent && (
            <div className="settings">
              <PluginContainer id={plugin.id} component={settingsComponent} />
            </div>
          )}

          <ToggleSection name="Display Settings">
            <WidgetDisplay display={plugin.display} onChange={setDisplay} />
          </ToggleSection>

          <ToggleSection name="Font Settings">
            <>
              <label>
                Font
                <input
                  type="text"
                  value={plugin.display.fontFamily}
                  onChange={(event) =>
                    setDisplay({ fontFamily: event.target.value })
                  }
                />
              </label>

              <label>
                Weight
                <select
                  value={plugin.display.fontWeight}
                  onChange={(event) =>
                    setDisplay({
                      fontWeight: event.target.value
                        ? Number(event.target.value)
                        : undefined,
                    })
                  }
                >
                  <option value="">Default</option>
                  <option value="100">Thin</option>
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="700">Bold</option>
                  <option value="900">Black</option>
                </select>
              </label>

              <label>
                Colour
                <input
                  type="color"
                  value={plugin.display.colour ?? "#ffffff"}
                  onChange={(event) =>
                    setDisplay({ colour: event.target.value })
                  }
                />
              </label>
            </>
          </ToggleSection>
        </div>
      )}

      <div className="widget-content">{children}</div>
    </fieldset>
  );
};

export default Widget;

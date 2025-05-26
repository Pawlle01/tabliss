import { nanoid as generateId } from "nanoid";
import { defaultData as defaultGiphyData } from "../../plugins/backgrounds/giphy/types";
import { defaultData as defaultGradientData } from "../../plugins/backgrounds/gradient/types";
import { defaultData as defaultUnsplashData } from "../../plugins/backgrounds/unsplash/types";
import { defaultData as defaultSearchData } from "../../plugins/widgets/search/types";
import { defaultData as defaultTimeData } from "../../plugins/widgets/time/types";
import { defaultData as defaultTodoData } from "../../plugins/widgets/todo/types";

// From:
export interface Version1Config {
  dashboard: {
    background: keyof typeof keyMap;
    widgets: (keyof typeof keyMap)[];
  };
  storage: {
    [key: string]: {
      local: { [key: string]: any };
      settings: { [key: string]: any };
    };
  };
  settings: {
    locale?: string;
    timezone?: string;
  };
}

// To:
export type Version2Config = {
  backgrounds: BackgroundState[];
  widgets: WidgetState[];
  data: {
    [id: string]: object;
  };
  locale?: string;
  timeZone?: string;
};

type BackgroundState = PluginState<BackgroundDisplay>;
type WidgetState = PluginState<WidgetDisplay>;
type PluginState<Display> = {
  id: string;
  key: string;
  active: boolean;
  display: Display;
};
type BackgroundDisplay = {
  blur: number;
  luminosity: number;
};
type WidgetDisplay = {
  colour?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  position: { x: number; y: number };
};

// Map old position strings to numeric {x, y} pixel values
const positionMap: Record<string, { x: number; y: number }> = {
  topLeft: { x: 0, y: 32 },           // 2rem top margin
  topCentre: { x: 400, y: 0 },        // 50% width approx (adjust if needed)
  topRight: { x: 800, y: 0 },         // right aligned (assuming 800px width)
  middleLeft: { x: 0, y: 300 },       // middle vertically ~300px
  middleCentre: { x: 400, y: 300 },   // center of container approx
  middleRight: { x: 800, y: 300 },
  bottomLeft: { x: 0, y: 568 },       // bottom margin ~3rem (48px), assuming 600px height container
  bottomCentre: { x: 400, y: 568 },
  bottomRight: { x: 800, y: 568 },
};

export default function (input: Version1Config): Version2Config {
  // Data
  const data: Version2Config["data"] = {};

  // Backgrounds
  const backgrounds: Version2Config["backgrounds"] = [
    {
      id: generateId(),
      key: translateKey(input.dashboard.background) || "background/unsplash",
      active: true,
      display: { blur: 0, luminosity: 0 },
    },
  ];
  data[backgrounds[0].id] = translateData(
    input.dashboard.background,
    input.storage[input.dashboard.background],
  ) as object;

  // Widgets
  const fontSettings = input.storage["core/widgets/font"];
  const fontDisplay = fontSettings
    ? {
        colour: fontSettings.settings.colour || "#ffffff",
        fontFamily: fontSettings.settings.family,
        fontSize: fontSettings.settings.size || 28,
      }
    : {};

  const widgets: Version2Config["widgets"] = input.dashboard.widgets
    .filter(translateKey)
    .map((previousType) => {
      const id = generateId();
      const key = translateKey(previousType) as string; // false filtered out already
      const storage = input.storage[previousType];

      // Get old position string or default to middleCentre
      const oldPosition: string = storage?.settings.position || "middleCentre";

      // Map to new numeric position or fallback
      const position = positionMap[oldPosition] || positionMap.middleCentre;

      data[id] = translateData(previousType, storage) as object;

      return {
        id,
        key,
        active: true,
        display: {
          ...fontDisplay,
          position,
        },
      };
    });

  return {
    backgrounds,
    data,
    widgets,
    locale: input.settings.locale,
    timeZone: input.settings.timezone,
  };
}

// Translate plugin type keys
const keyMap = {
  "core/backgrounds/colour": "background/colour",
  "extra/backgrounds/dribbble": null,
  "extra/backgrounds/giphy": "background/giphy",
  "core/backgrounds/gradient": "background/gradient",
  "core/backgrounds/image": "background/image",
  "extra/backgrounds/unsplash": "background/unsplash",
  "core/widgets/css": "widget/css",
  "core/widgets/font": null,
  "core/widgets/greeting": "widget/greeting",
  "widgets/js": "widget/js",
  "core/widgets/links": "widget/links",
  "widgets/literature-clock": "widget/literature-clock",
  "core/widgets/message": "widget/message",
  "extra/widgets/quote": "widget/quote",
  "core/widgets/reload": null,
  "extra/widgets/search": "widget/search",
  "core/widgets/time": "widget/time",
  "widgets/todo": "widget/todo",
  "extra/widgets/weather": "widget/weather",
};

function translateKey(key: keyof typeof keyMap) {
  return keyMap[key];
}

// Translate storage to data
type Storage = {
  local: { [key: string]: any };
  settings: { [key: string]: any };
};

function translateData(type: string, storage?: Storage) {
  switch (type) {
    case "extra/backgrounds/giphy":
      return storage ? { ...defaultGiphyData, ...storage.settings } : undefined;

    case "core/backgrounds/gradient":
      return storage
        ? { ...defaultGradientData, ...storage.settings }
        : undefined;

    case "core/backgrounds/image":
      // @todo Can I move this to cache?
      return undefined;

    case "extra/backgrounds/unsplash":
      return storage
        ? { ...defaultUnsplashData, ...storage.settings }
        : undefined;

    case "core/widgets/links":
      return storage ? { columns: 1, ...storage.settings } : undefined;

    case "core/widgets/message":
      return storage && storage.settings
        ? { messages: [storage.settings.message] }
        : undefined;

    case "extra/widgets/search":
      return storage
        ? { ...defaultSearchData, ...storage.settings }
        : undefined;

    case "core/widgets/time":
      return storage ? { ...defaultTimeData, ...storage.settings } : undefined;

    case "widgets/todo":
      return storage
        ? {
            ...defaultTodoData,
            ...storage.settings,
            ...storage.local, // Move into data
          }
        : undefined;

    case "extra/widgets/weather":
      return storage
        ? {
            showDetails: storage.local.details || false, // Move into data
            latitude: storage.settings.latitude,
            longitude: storage.settings.longitude,
            units: storage.settings.units || "auto",
          }
        : undefined;

    default:
      return storage ? storage.settings : undefined;
  }
}

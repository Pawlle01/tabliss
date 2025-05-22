import { Config } from "../../types";
import Video from "./Video";
import VideoSettings from "./VideoSettings";

const config: Config = {
  key: "background/video",
  name: "Video Slideshow",
  description: "Cycle through background videos.",
  dashboardComponent: Video,
  settingsComponent: VideoSettings,
};

export default config;

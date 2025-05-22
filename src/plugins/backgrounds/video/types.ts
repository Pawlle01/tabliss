import { API } from "../../types";

export type Data = {
  videos?: string[]; // List of video URLs
  delay?: number;    // Delay between slides in ms
  loop?: boolean;    // Whether to loop videos
};

export type Props = API<Data>;

export const defaultData: Data = {
  videos: [
    "https://example.com/video1.mp4",
    "https://example.com/video2.mp4",
  ],
  delay: 10000,
  loop: true,
};

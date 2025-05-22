import React, { FC } from "react";

import { Props, defaultData } from "./types";

const VideoSettings: FC<Props> = ({ data = defaultData, setData }) => {
  const updateVideo = (index: number, value: string) => {
    const newVideos = [...(data.videos || [])];
    newVideos[index] = value;
    setData({ ...data, videos: newVideos });
  };

  const addVideo = () => {
    setData({ ...data, videos: [...(data.videos || []), ""] });
  };

  const removeVideo = (index: number) => {
    const newVideos = [...(data.videos || [])];
    newVideos.splice(index, 1);
    setData({ ...data, videos: newVideos });
  };

  return (
    <div className="VideoSettings">
      <label>
        Delay between videos (ms)
        <input
          type="number"
          value={data.delay || 10000}
          onChange={(e) => setData({ ...data, delay: Number(e.target.value) })}
        />
      </label>

      <label>
        Loop videos
        <input
          type="checkbox"
          checked={data.loop ?? true}
          onChange={(e) => setData({ ...data, loop: e.target.checked })}
        />
      </label>

      <div>
        <p>Video URLs:</p>
        {(data.videos || []).map((url, index) => (
          <div key={index}>
            <input
              type="text"
              value={url}
              onChange={(e) => updateVideo(index, e.target.value)}
              placeholder="Paste video URL here"
            />
            <button onClick={() => removeVideo(index)}>Remove</button>
          </div>
        ))}
        <button onClick={addVideo}>Add Video</button>
      </div>
    </div>
  );
};

export default VideoSettings;

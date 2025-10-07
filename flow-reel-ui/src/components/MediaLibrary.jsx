import { useEffect, useState } from "react";
import { mockApi } from "../api/mockApi";

export default function MediaLibrary() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    mockApi.getVideos().then(setVideos);
  }, []);

  return (
    <div className="p-3 space-y-2">
      {videos.map((v) => (
        <div key={v.id} className="flex items-center space-x-2 bg-gray-800 p-2 rounded">
          <img src={v.thumbnail} alt={v.name} className="w-12 h-8 rounded object-cover" />
          <span>{v.name}</span>
        </div>
      ))}
    </div>
  );
}

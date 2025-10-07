import { useState } from "react";
import { uploadAudio, getBeats } from "../api/audio";

export default function AudioBeatPanel() {
  const [audioFile, setAudioFile] = useState(null);
  const [waveform, setWaveform] = useState([]);
  const [beats, setBeats] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const res = await uploadAudio(file);
    setAudioFile(res.file_id);
  };

  const handleDetect = async () => {
    const data = await getBeats(audioFile, "auto");
    setWaveform(data.waveform);
    setBeats(data.beats);
  };

  return (
    <div className="p-3 bg-gray-900 text-white rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Audio Beat Detection</h2>
      <input type="file" accept="audio/*" onChange={handleUpload} />
      <button
        onClick={handleDetect}
        className="mt-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Auto Detect Beats
      </button>

      {beats.length > 0 && (
        <div className="mt-4">
          <p>Detected Beats: {beats.length}</p>
          <p>Duration: {beats[beats.length - 1].toFixed(2)}s</p>
        </div>
      )}
    </div>
  );
}

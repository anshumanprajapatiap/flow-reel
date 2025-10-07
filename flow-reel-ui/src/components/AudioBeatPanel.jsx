import { useState } from "react";
import BeatAdder from "./BeatAdder";

export default function AudioBeatPanel() {
  const [audioFile, setAudioFile] = useState(null);
  const [beats, setBeats] = useState([]);
  const [openEditor, setOpenEditor] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setOpenEditor(true);
    }
  };

  const handleApply = (detectedBeats) => {
    setBeats(detectedBeats);
    setOpenEditor(false);
  };

  const handleCancel = () => setOpenEditor(false);

  return (
    <div className="p-3 bg-gray-800 text-white rounded-lg w-full max-w-3xl mx-auto">
      {!openEditor ? (
        <>
          <h2 className="text-lg font-semibold mb-2">Audio Beat Detection</h2>
          <input
            type="file"
            accept="audio/*"
            onChange={handleUpload}
            className="text-sm text-gray-300"
          />

          {beats.length > 0 && (
            <div className="mt-4">
              <p>Detected Beats: {beats.length}</p>
              <p>Last Beat at: {beats[beats.length - 1].toFixed(2)}s</p>
            </div>
          )}
        </>
      ) : (
        <BeatAdder file={audioFile} onApply={handleApply} onCancel={handleCancel} />
      )}
    </div>
  );
}

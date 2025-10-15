import { AudioLines } from "lucide-react";

export default function MediaFiles({ mediaFiles, uploading, onDelete }) {
  const handleDragStart = (e, item) => {
    const payload = {
      id: item.id,
      type: item.type,
      name: item.name,
      src: `http://localhost:8000/api/media/?user_id=${item.user_id}&path=${encodeURIComponent(item.path)}`,
      duration: item.duration || 5,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <div className="grid grid-cols-2 gap-3">
        {mediaFiles.length === 0 && !uploading && (
          <div className="text-center text-gray-500 text-sm col-span-2 py-10">
            No media yet
          </div>
        )}

        {uploading && (
          <div className="col-span-2 text-center text-blue-400 text-sm animate-pulse py-10">
            Uploading...
          </div>
        )}

        {mediaFiles.map((m) => (
          <div
            key={m.id}
            draggable
            onDragStart={(e) => handleDragStart(e, m)}
            className="relative group rounded-lg overflow-hidden bg-gray-900 hover:ring-2 hover:ring-blue-500 transition h-32"
          >
            {m.type === "audio" ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-300">
                <AudioLines size={22} />
                <p className="text-[10px] mt-1 truncate w-full text-center px-1">
                  {m.name}
                </p>
              </div>
            ) : (
              <video
                src={`http://localhost:8000/api/media/?user_id=${m.user_id}&path=${encodeURIComponent(m.path)}`}
                className="w-full h-full object-cover"
                muted
              />
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] px-1 py-0.5 truncate">
              {m.name}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(m.id);
              }}
              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

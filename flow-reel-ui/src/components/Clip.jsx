

// --- Clip Component ---
function Clip({ clip, onClick, isSelected }) {
  const isVideo = clip.type === "video" || clip.type === "image";
  return (
    <div
      onClick={onClick}
      className={`relative flex-shrink-0 rounded-md overflow-hidden cursor-pointer shadow-md transition ${
        isSelected ? "ring-2 ring-blue-500" : "bg-gray-700 hover:bg-gray-600"
      }`}
      style={{ width: "120px", height: "30px" }}
    >
      {isVideo ? (
        <video
          src={`http://localhost:8000/media/?user_id=${clip.user_id}&path=${encodeURIComponent(clip.path)}`}
          className="w-full h-full object-cover opacity-70"
          muted
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-300 text-xs">
          🎵 {clip.name}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] px-1 py-[1px] truncate">
        {clip.name}
      </div>
    </div>
  );
}




export default Clip;
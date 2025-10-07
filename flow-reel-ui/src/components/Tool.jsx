

function Tool({ icon, label }) {
  return (
    <button className="flex flex-col items-center hover:text-blue-400 transition">
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  );
}


export default Tool;
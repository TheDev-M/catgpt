export default function CatProfileCard({ catName, catImage }) {
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto">
      <div className="overflow-hidden rounded-3xl shadow-2xl border-[6px] border-base-300 bg-white/70 backdrop-blur-sm">
        <img
          src={catImage}
          alt={catName}
          className="w-full h-[48vh] object-cover object-[50%_22%] select-none"
          draggable="false"
          loading="eager"
        />
      </div>

      <h2 className="text-4xl lg:text-5xl font-extrabold mt-4 text-base-content text-center">
        {catName}
      </h2>
    </div>
  );
}

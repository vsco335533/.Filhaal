import { Link } from "react-router-dom";

const START_YEAR = 1990;
const END_YEAR = new Date().getFullYear();

export default function PreviousEditions() {
  const years = [];
  for (let y = END_YEAR; y >= START_YEAR; y--) years.push(y);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-black text-white text-center py-2 font-semibold mb-8">
        All previous points
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10 text-center text-lg font-semibold">
        {years.map((year) => (
          <Link
            key={year}
            to={`/previous-editions/${year}`}
            className="hover:text-red-700"
          >
            {year}
          </Link>
        ))}
      </div>
    </div>
  );
}

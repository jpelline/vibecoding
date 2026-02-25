const CATEGORY_COLORS = {
  'Wet Food':    'bg-blue-100 text-blue-700',
  'Dry Food':    'bg-amber-100 text-amber-700',
  'Treats':      'bg-pink-100 text-pink-700',
  'Health':      'bg-green-100 text-green-700',
  'Accessories': 'bg-purple-100 text-purple-700',
  'Speciality':  'bg-red-100 text-red-700',
};

const DEFAULT_COLOR = 'bg-gray-100 text-gray-700';

export function CategoryBadge({ category }) {
  const cls = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {category}
    </span>
  );
}

// // components/ShimmerRow.tsx
// import React from "react";

// export const ShimmerRow = () => {
//   return (
//     <tr className="animate-pulse border-b-2 border-acgrey">
//       <td className="px-2 py-5">
//         <div className="h-4 bg-gray-300 rounded w-12"></div>
//       </td>
//       <td className="px-2 py-5">
//         <div className="h-4 bg-gray-300 rounded w-20"></div>
//       </td>
//       <td className="px-2 py-5">
//         <div className="h-4 bg-gray-300 rounded w-24"></div>
//       </td>
//       <td className="px-2 py-5">
//         <div className="h-4 bg-gray-300 rounded w-16"></div>
//       </td>
//       <td className="px-2 py-5">
//         <div className="h-4 bg-gray-300 rounded w-20"></div>
//       </td>
//       <td className="px-2 py-5">
//         <div className="h-4 bg-gray-300 rounded w-28"></div>
//       </td>
//       <td className="px-2 py-5">
//         <div className="h-4 bg-gray-300 rounded w-12"></div>
//       </td>
//     </tr>
//   );
// };



// components/Shimmer/TableShimmer.tsx
import React from "react";

interface TableShimmerProps {
  columnCount: number;
  rowCount?: number;
}

export const TableShimmer: React.FC<TableShimmerProps> = ({ columnCount, rowCount = 5 }) => {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <tr key={rowIdx} className="animate-pulse border-b-2 border-acgrey">
          {Array.from({ length: columnCount }).map((_, colIdx) => (
            <td key={colIdx} className="px-2 py-5">
              <div className={`h-4 bg-gray-300 rounded ${getRandomWidthClass(colIdx)}`}></div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

// Optional: gives varied width for visual realism
const getRandomWidthClass = (index: number) => {
  const widths = ["w-12", "w-16", "w-20", "w-24", "w-28", "w-32"];
  return widths[index % widths.length];
};


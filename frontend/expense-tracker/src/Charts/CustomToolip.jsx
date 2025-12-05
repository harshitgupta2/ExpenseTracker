import React from "react";

/**
 * Custom tooltip component for Recharts.
 *
 * This component renders additional information when a chart
 * element is hovered. It displays the label and value passed
 * through the `payload` prop. If the tooltip is not active or
 * the data is missing, it returns nothing.
 *
 * @param {Object} props - Tooltip props provided by Recharts.
 * @param {boolean} props.active - Indicates whether the tooltip is visible.
 * @param {Array} props.payload - Data array for the hovered chart item.
 *
 * @returns {JSX.Element|null} The rendered tooltip UI or null if inactive.
 */
const CustomToolip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
        <p className="text-xl font-semibold text-purple-800 mb-1">
          {payload[0].name}
        </p>
        <p className="text-sm text-gray-600">
          Amoun:{" "}
          <span className="text-sm font-medium text-gray-900">
            Rupees {payload[0].value}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export default CustomToolip;

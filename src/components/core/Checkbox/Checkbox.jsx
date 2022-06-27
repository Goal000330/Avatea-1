import * as React from "react";

export default function Checkbox(props) {
  const [isChecked, setIsChecked] = React.useState(false);
  return isChecked ? (
    <div
      className="flex items-center justify-center w-6 h-6 border border-indigo-500 rounded-md bg-indigo-500 hover:ring-2 hover:ring-indigo-500/50 hover:cursor-pointer transition"
      onClick={() => setIsChecked(!isChecked)}
    >
      <i className="fa-regular fa-check text-white mt-1" />
    </div>
  ) : (
    <div
      className="w-6 h-6 border border-indigo-500 rounded-md hover:ring-2 hover:ring-indigo-500/50 hover:cursor-pointer transition"
      onClick={() => setIsChecked(!isChecked)}
    ></div>
  );
}
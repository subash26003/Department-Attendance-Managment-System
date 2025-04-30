import React from "react";

const InputCard = ({value  , labelName , name , type}) => {
  return (
    <div className="flex flex-col gap-1 w-full md:w-[75%]">
      <label htmlFor={name} className="text-gray-950 font-semibold">
        {labelName}
      </label>
      <input
        value={value}
        readOnly
        type={type}
        id={name}
        name={name}
        placeholder={`Enter ${labelName}`}
        className="border border-gray-500  h-10 p-2 rounded"
        required
      />
    </div>

  );
};

export default InputCard;

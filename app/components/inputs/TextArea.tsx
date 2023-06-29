import React, { useState } from "react";
import { motion } from "framer-motion";
import XIcon from "../icons/XIcon";

const TypeSomething = ({ name, autoFocus, className, placeholder }: { name: string; autoFocus?: boolean; className?: string; placeholder?: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleClick = () => {
    setIsExpanded(true);
  };

  return (
    <motion.div className="w-full p-4 rounded-md" initial={{ scale: 1 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
      {!isExpanded && (
        <div className="flex items-center justify-center">
          <input
            name={name}
            autoFocus={autoFocus}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-2 px-4 py-2 font-medium text-white bg-gray-800 rounded-md shadow-md"
          >
            ...
          </motion.button>
        </div>
      )}
      {isExpanded && (
        <div className="relative">
          <textarea
            name={name}
            autoFocus={autoFocus}
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-36 px-4 py-2  rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
            rows={10}
            onFocus={function (e) {
              var val = e.target.value;
              e.target.value = "";
              e.target.value = val;
            }}
          />
          <motion.button
            onClick={() => setIsExpanded(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 right-2 px-4 py-2 font-medium text-white bg-gray-800 opacity-90 rounded-md shadow-md"
          >
            <XIcon className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default TypeSomething;

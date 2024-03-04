import { useEffect } from "react";

function useKeyPress(key, action) {
  useEffect(
    function () {
      function keyDownCallback(e) {
        if (e.code.toLowerCase() === key.toLowerCase()) action();
      }
      document.addEventListener("keydown", keyDownCallback);
      return function () {
        document.removeEventListener("keydown", keyDownCallback);
      };
    },
    [key, action]
  );
}

export default useKeyPress;

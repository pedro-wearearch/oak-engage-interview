import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsActive(false);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [isActive]);

  return (
    <button
      className={`container ${isActive ? "active" : ""}`}
      onClick={handleToggle}
      aria-pressed={isActive}
    >
      <div
        className={`inner-square ${isActive ? "active" : ""}`}
        aria-pressed={isActive}
      />
    </button>
  );
}

export default App;

import React, { useState } from "react";
import "../Home/home.scss";
import Graph from "../Components/Graph/Graph";

const App = () => {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [imageData, setImageData] = useState([]);

  const incrementCount = () => {
    setCount(prevCount => {
      const newCount = prevCount + 1;
      const newImages = [
        ...imageData,
        {
          id: newCount,
          src:
            "https://cdn-icons-png.freepik.com/512/9793/9793685.png",
          label: inputValue,
          position: { x: 100 + newCount * 150, y: 100 },
          ipAddress: `192.168.1.${newCount}`, // Example IP address
        },
      ];
      setImageData(newImages);
      return newCount;
    });
  };

  const decrementCount = () => {
    const idToDelete = parseInt(inputValue, 10); // Convert input value to number
    if (!isNaN(idToDelete)) {
      const filteredImages = imageData.filter(
        img => img.id !== idToDelete
      );
      setImageData(filteredImages);
      if (filteredImages.length < imageData.length) {
        setCount(prevCount => prevCount );
        setInputValue('')
      }
    }
  };

  const handleInputChange = event => {
    setInputValue(event.target.value);
  };

  return (
    <section className="mainpage">
      <div className="container">
        {/* <h1>Count: {count}</h1> */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter ID"
        />
        <button
          className="btn btn-success mx-2 mt-2"
          onClick={incrementCount}
        >
          Increment Count
        </button>
        <button
          className="btn btn-danger mx-2 mt-2"
          onClick={decrementCount}
        >
          Delete
        </button>
      </div>
      <Graph imageData={imageData} />
    </section>
  );
};

export default App;

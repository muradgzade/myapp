import React, { useState } from "react";
import "../Home/home.scss";
import Graph from "../Components/Graph/Graph";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const App = () => {
  const [count, setCount] = useState(0);

  const [inputValue, setInputValue] = useState("");
  const [targetValue, setTargetValue] = useState(""); // New state for target ID(s)
  const [label, setLabel] = useState("");
  const [imageData, setImageData] = useState([]);
  const [connections, setConnections] = useState([]); // State to store connections

  const incrementCount = (event) => {
    event.preventDefault(); // Prevent default behavior of the button click
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      const newImages = [
        ...imageData,
        {
          id: newCount,
          src: "https://cdn-icons-png.freepik.com/512/9793/9793685.png",
          label: inputValue,
          position: { x: 100 + newCount * 150, y: 100 },
          ipAddress: `192.168.1.${newCount}`, // Example IP address
        },
      ];
      setImageData(newImages);
      setInputValue(""); // Clear input value
      setLabel(""); // Clear label
      return newCount;
    });
  };

  const findRelatedNodes = (idToDelete, connections) => {
    const nodesToDelete = new Set();
    const stack = [idToDelete];

    while (stack.length > 0) {
      const currentId = stack.pop();
      if (!nodesToDelete.has(currentId)) {
        nodesToDelete.add(currentId);
        const relatedConnections = connections.filter(
          (conn) =>
            conn.source === currentId || conn.targets.includes(currentId)
        );
        relatedConnections.forEach((conn) => {
          stack.push(conn.source);
          conn.targets.forEach((target) => stack.push(target));
        });
      }
    }

    return Array.from(nodesToDelete);
  };

  const decrementCount = () => {
    const idToDelete = parseInt(inputValue, 10); // Convert input value to number
    if (!isNaN(idToDelete)) {
      const nodesToDelete = findRelatedNodes(idToDelete, connections);

      if (nodesToDelete.length > 0) {
        const filteredImages = imageData.filter(
          (img) => !nodesToDelete.includes(img.id)
        );
        const filteredConnections = connections.filter(
          (conn) =>
            !nodesToDelete.includes(conn.source) &&
            !conn.targets.some((target) => nodesToDelete.includes(target))
        );

        setImageData(filteredImages);
        setConnections(filteredConnections);
        setInputValue("");
        setLabel("");

        const deletedCount = nodesToDelete.length;
      
        
        if (deletedCount >1 && deletedCount<3 ) {
          alert("Minor deletion: " + deletedCount + " images deleted");
        } else if (deletedCount >= 3 && deletedCount < 5 )  {
          alert("Major deletion: " + deletedCount + " images deleted");
        }
        else if (deletedCount >= 5   )  {
          alert("Critical deletion: " + deletedCount + " images deleted");
        }
      }
    } else {
      setLabel("Input is empty");
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleTargetChange = (event) => {
    setTargetValue(event.target.value);
  };

  const addConnection = () => {
    const sourceId = parseInt(inputValue, 10);
    const targetIds = targetValue
      .split(",")
      .map((id) => parseInt(id.trim(), 10))
      .filter((id) => !isNaN(id));
    if (!isNaN(sourceId) && targetIds.length > 0) {
      setConnections([
        ...connections,
        { source: sourceId, targets: targetIds },
      ]);
    }
  };



  return (
    <section className="mainpage">
   

      <div className="inputitems">
      <div className="container d-flex align-items-center gap-5">
        <button className="btn btn-success mx-2 mt-2" onClick={incrementCount}>
          Add
        </button>
        <form>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter Source ID"
          />
          <input
            type="text"
          //  value={targetValue}
            onChange={handleTargetChange}
            placeholder="Enter Target ID(s)"
          />

          <button className="btn btn-primary mx-2 mt-2" onClick={addConnection}>
            Add Connection
          </button>
        </form>

     
        <form>
        <input
          type="text"
       //   value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter ID"
        />
          <label>{label}</label>
          <button className="btn btn-danger mx-2 mt-2" onClick={decrementCount}>
            Delete
          </button>
        </form>
      </div>
     </div>
      <Graph imageData={imageData} connections={connections} />
    </section>
  );
};

export default App;
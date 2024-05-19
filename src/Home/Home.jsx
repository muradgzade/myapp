import React, { useState } from "react";
import "../Home/home.scss";
import Graph from "../Components/Graph/Graph";

const App = () => {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [label, setLabel] = useState("");
  const [imageData, setImageData] = useState([]);
  const [connections, setConnections] = useState([]);

  const incrementCount = (event) => {
    event.preventDefault();
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      const newImages = [
        ...imageData,
        {
          id: newCount,
          src: "https://cdn-icons-png.freepik.com/512/9793/9793685.png",
          label: inputValue,
          position: { x: 100 + newCount * 150, y: 100 },
          ipAddress: `192.168.1.${newCount}`,
        },
      ];
      setImageData(newImages);
      setInputValue("");
      setLabel("");
      return newCount;
    });
  };

  const findRelatedNodes = (idToDelete) => {
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

  const deleteMainId = (mainId) => {
    const nodesToDelete = findRelatedNodes(mainId);

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
  };

  const deletePrimaryId = (primaryId) => {
    const filteredImages = imageData.filter((img) => img.id !== primaryId);
    const filteredConnections = connections.filter(
      (conn) => conn.source !== primaryId && !conn.targets.includes(primaryId)
    );

    setImageData(filteredImages);
    setConnections(filteredConnections);
  };

  const decrementCount = (event) => {
    event.preventDefault();
    const idToDelete = parseInt(inputValue, 10);
    if (!isNaN(idToDelete)) {
      const isMainId = connections.some((conn) =>
        conn.targets.includes(idToDelete)
      );

      if (isMainId) {
        deleteMainId(idToDelete);
      } else {
        deletePrimaryId(idToDelete);
      }

      setInputValue("");
      setLabel("");
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

  const addConnection = (event) => {
    event.preventDefault();
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
          <button
            className="btn btn-success mx-2 mt-2"
            onClick={incrementCount}
          >
            Add
          </button>
          <form>
            <input
              type="text"
              //    value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter Source ID"
            />
            <input
              type="text"
              value={targetValue}
              onChange={handleTargetChange}
              placeholder="Enter Target ID(s)"
            />
            <button
              className="btn btn-primary mx-2 mt-2"
              onClick={addConnection}
            >
              Add Connection
            </button>
          </form>
          <form>
            <input
              type="text"
              //     value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter ID"
            />
            <label>{label}</label>
            <button
              className="btn btn-danger mx-2 mt-2"
              onClick={decrementCount}
            >
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

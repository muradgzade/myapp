import React, { useEffect } from "react";
import { dia, shapes } from "jointjs";
import "../Graph/Graph.scss";

const Graph = ({ imageData }) => {
  useEffect(() => {
    const graph = new dia.Graph();

    const paper = new dia.Paper({
      el: document.getElementById("paper"),
      model: graph,
      gridSize: 10,
    });

    const createImageNode = (x, y, url, label, ipAddress) => {
      return new shapes.standard.Image({
        position: { x, y },
        size: { width: 100, height: 100 },
        attrs: {
          image: {
            "xlink:href": url,
            width: 150,
            height: 150,
          },
          label: {
            text: `${label} (${ipAddress})`, // Display label and IP address
            "ref-y": 120,
            "text-anchor": "middle",
            "font-size": 14,
          },
        },
      });
    };

    // Clear the graph to remove any existing nodes and links
    graph.clear();

    let previousNode = null;
    imageData.forEach((img, index) => {
      const node = createImageNode(
        img.position.x,
        img.position.y,
        img.src,
        img.label,
        img.ipAddress // Pass IP address to the createImageNode function
      );
      node.addTo(graph);

      // Create a link to the previous node if it exists
      if (previousNode) {
        const link = new dia.Link({
          source: { id: previousNode.id },
          target: { id: node.id },
          attrs: {
            line: {
              stroke: "black",
              strokeWidth: 2,
            },
            ".marker-source": {
              display: "none",
            },
            ".marker-target": {
              display: "none",
            },
          },
        });
        link.addTo(graph);
      }

      previousNode = node;
    });
  }, [imageData]);

    return <div id="paper">
      
  </div>;
};

export default Graph;

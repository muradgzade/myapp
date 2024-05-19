import React, { useEffect } from "react";
import { dia, shapes } from "jointjs";
import "../Graph/Graph.scss";

const Graph = ({ imageData, connections }) => {
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

    // Create nodes
    const nodes = {};
    imageData.forEach((img) => {
      const node = createImageNode(
        img.position.x,
        img.position.y,
        img.src,
        img.label,
        img.ipAddress
      );
      node.addTo(graph);
      nodes[img.id] = node;
    });

    // Create links based on connections
    connections.forEach(({ source, targets }) => {
      targets.forEach((target) => {
        if (nodes[source] && nodes[target]) {
          const link = new dia.Link({
            source: { id: nodes[source].id },
            target: { id: nodes[target].id },
            attrs: {
              line: {
                stroke: "red",
                strokeWidth: 2,
              },
              ".marker-source": {
                display: "none",
              },
              ".marker-target": {
                display: "block",
              },
            },
          });
          link.addTo(graph);
        }
      });
    });
  }, [imageData, connections]);

  return <div id="paper"></div>;
};

export default Graph;

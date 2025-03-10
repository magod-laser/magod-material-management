import React from "react";
import TreeView from "react-treeview";
import "react-treeview/react-treeview.css";

function NavComp() {
  const dataSource = [
    {
      type: "Program NOS1",
      collapsed: false,
      people: [
        {
          name: "Laser11",
          one: "Process 1",
          two: "Process 2",
          three: "Process 3",
          collapsed: false,
        },
        {
          name: "Laser11",
          one: "Process 1",
          two: "Process 2",
          three: "Process 3",
          collapsed: false,
        },
        {
          name: "Laser11",
          one: "Process 1",
          two: "Process 2",
          three: "Process 3",
          collapsed: false,
        },
        {
          name: "Laser11",
          one: "Process 1",
          two: "Process 2",
          three: "Process 3",
          collapsed: false,
        },
      ],
    },
  ];

  return (
    <div className="MainDiv" style={{ height: "375px", overflowY: "scroll" }}>
      <div class="container">
        {dataSource.map((node, i) => {
          const type = node.type;
          const label = <span className="node">{type}</span>;
          return (
            <TreeView
              key={type + "|" + i}
              nodeLabel={label}
              defaultCollapsed={true}
            >
              {node.people.map((person) => {
                const label2 = <span className="node">{person.name}</span>;
                return (
                  <TreeView
                    nodeLabel={label2}
                    key={person.name}
                    defaultCollapsed={true}
                  >
                    <div className="info">{person.one}</div>
                    <div className="info">{person.two}</div>
                    <div className="info">{person.three}</div>
                  </TreeView>
                );
              })}
            </TreeView>
          );
        })}
      </div>
    </div>
  );
}

export default NavComp;

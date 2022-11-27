import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import {SortableItem} from "../SortableItem";
import {SidebarButton} from "../SidebarButton";
import {DropdownButton} from "../DropdownButton"

export default function Container({ id, items, kind, classInfo, onUpdate }) {
  const { setNodeRef } = useDroppable({
    id
  });

  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef}>
        {items.map((id) => (
        <div style={{margin: (kind !== "calendar" ? "10px" : "0px")}}>
          <SortableItem key={id} id={id} >
            {<SidebarButton text={id} kind={kind} classInfo={classInfo[id]}/>  }
          </SortableItem>
          {kind === "dropdown" && <DropdownButton
            text={id}
            setSelectedOption={onUpdate}
          />}
        </div>))}
      </div>
    </SortableContext>
  );
}

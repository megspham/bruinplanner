import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import {SortableItem} from "../SortableItem";
import {SidebarButton} from "../SidebarButton";

export default function Container(props) {
  const { id, items, kind } = props;

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
          <SortableItem key={id} id={id} >
            <SidebarButton text={id} kind={kind} style="width:12vw" />  
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
}
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import {SortableItem} from "../SortableItem";
import {SidebarButton} from "../SidebarButton";

export default function Container(props) {
  const { id, items, info } = props;

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
          <SortableItem key={id} id={id}>
            <SidebarButton info={info[id]} text={id} />  
          </SortableItem>
        ))}
      </div>
    </SortableContext>
  );
}

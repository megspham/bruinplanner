import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import {SortableItem} from "../SortableItem";
import {SidebarButton} from "../SidebarButton";
import {DropdownButton} from "../DropdownButton"

export default function Container(props) {
  const { id, items, kind } = props;

  const { setNodeRef } = useDroppable({
    id
  });

  //console.log(items);
  
  // now supports loading classes in object format
  return (
    <SortableContext
      id={id}
      items={items}
      strategy={verticalListSortingStrategy}
    >
      <div ref={setNodeRef}>
        {items.map((obj) => (obj ?
          <SortableItem key={obj.trueId} id={obj.trueId} >
            {<SidebarButton text={obj.selected} kind={kind} style="width:12vw" />  }
          </SortableItem>
          : null
        ))}
      </div>
    </SortableContext>
  );
}

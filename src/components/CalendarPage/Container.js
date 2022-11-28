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
        {items.map((obj) => (obj ?
        <div style={{margin: (kind !== "calendar" ? "10px" : "0px")}}>
          <SortableItem key={obj.trueId} id={obj.trueId} >
            {<SidebarButton text={(kind !== "calendar" ? obj.trueId : obj.selected)} kind={kind} classInfo={classInfo[obj.trueId]} obj={obj}/>  }
          </SortableItem>
          {kind === "dropdown" && <DropdownButton
            text={obj.trueId}
            options={obj.options.map(e => ({value: e, label: e}))}
            setSelectedOption={onUpdate}
          />}
        </div> : null))}
      </div>
    </SortableContext>
  );
}

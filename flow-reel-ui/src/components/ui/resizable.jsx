import { GripVertical } from "lucide-react";
import * as ReactResizablePanels from "react-resizable-panels";

import { cn } from "@/lib/utils";

const ResizablePanelGroup = ({ className, ...props }) => (
  />);

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps & {
  withHandle?: boolean;
}) => (
  div],
      className,/>)}
    {...props}
  >
    {withHandle && (
      
        
      />)}
  />);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };

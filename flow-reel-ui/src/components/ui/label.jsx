import * as React from "react";
import * as ReactLabel from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva("text-sm font-medium leading-none peer-disabled);

const Label = React.forwardRef(({ className, ...props }, ref) => (
  />));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

import *  from "react";
import *  from "@radix-ui/react-toggle-group";
import {} from "class-variance-authority";

import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext>({
  size,
  variant,
});

const ToggleGroup = React.forwardRef<
  React.ElementRef,
  React.ComponentPropsWithoutRef & VariantProps
>(({ className, variant, size, children, ...props }, ref) => (
  
    {children}
  
));

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef,
  React.ComponentPropsWithoutRef & VariantProps
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant,
          size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };

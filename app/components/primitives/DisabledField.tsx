import React from "react";

type DisabledFieldPropType = {
  children: React.ReactNode;
};

export default function DisabledField({ children }: DisabledFieldPropType) {
  return (
    <p className="border rounded-lg p-1 px-2 text-muted-foreground">
      {children}
    </p>
  );
}

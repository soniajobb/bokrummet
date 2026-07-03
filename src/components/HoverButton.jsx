import { useState } from "react";

export default function HoverButton({ as = "button", style, hoverStyle, children, onMouseEnter, onMouseLeave, ...props }) {
  const [hover, setHover] = useState(false);
  const Tag = as;
  return (
    <Tag
      {...props}
      onMouseEnter={(e) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
      style={{ ...style, ...(hover ? hoverStyle : null) }}
    >
      {children}
    </Tag>
  );
}

import { ReactNode } from "react";

interface SmallInfoButtonProps {
  heading: string;
  description: string;
  icon: ReactNode;
}

function SmallInfoButton(props: SmallInfoButtonProps) {
  return (
    <div className="flex items-center w-full h-full">
      {props.icon}
      <div className="text-left ml-2">
        <h3 className="text-md font-semibold">{props.heading}</h3>
        <p className="text-xs">{props.description}</p>
      </div>
    </div>
  );
}

export default SmallInfoButton;

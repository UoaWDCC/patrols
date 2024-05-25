import { ReactNode } from "react";

interface InfoButtonProps {
  heading: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
}

function InfoButton(props: InfoButtonProps) {
  return (
    <div
      className="flex flex-1 basis-1/2 bg-[#EEF6FF] text-black p-4 rounded-lg  hover:bg-[#808080] transition-colors duration-300"
      onClick={props.onClick}
    >
      <div className="flex items-center w-full h-full">
        {props.icon}
        <div className="text-left ml-2">
          <h3 className="text-md font-semibold">{props.heading}</h3>
          <p className="text-xs">{props.description}</p>
        </div>
      </div>
    </div>
  );
}

export default InfoButton;

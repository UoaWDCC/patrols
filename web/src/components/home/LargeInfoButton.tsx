import { ReactNode } from "react";

interface LargeInfoButtonProps {
  className?: string;
  heading: string;
  headingColor?: string;
  description: string;
  descriptionColor?: string;
  icon?: ReactNode;
  iconDescription: string;
  onClick: () => void;
}

function LargeInfoButton(props: LargeInfoButtonProps) {
  return (
    <div className={props.className}>
      <h2 className={`text-md font-semibold my-2 ${props.headingColor}`}>
        {props.heading}
      </h2>
      <p className={`my-2 ${props.descriptionColor}`}>{props.description}</p>
      <button
        onClick={props.onClick}
        className="bg-white w-full mx-auto px-6 py-4 mb-3 rounded-lg text-md font-semibold flex items-center justify-center transition-all duration-300 text-black shadow-sm hover:shadow-lg"
      >
        {props.icon} {props.iconDescription}
      </button>
    </div>
  );
}

export default LargeInfoButton;

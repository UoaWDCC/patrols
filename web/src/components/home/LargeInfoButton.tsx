import { ReactNode } from "react";

const variant = {
  light: "text-black",
  dark: "text-white",
};

type VariantType = keyof typeof variant;

interface LargeInfoButtonProps {
  className?: string;
  heading: string;
  description: string;
  icon?: ReactNode;
  iconDescription: string;
  onClick: () => void;
  variant: VariantType;
}

function LargeInfoButton(props: LargeInfoButtonProps) {
  return (
    <div className={props.className}>
      <h2 className={`text-md font-semibold my-2 ${variant[props.variant]}`}>
        {props.heading}
      </h2>
      <p className={`my-2 ${variant[props.variant]}`}>{props.description}</p>
      <button
        onClick={props.onClick}
        className={`bg-white w-full mx-auto px-6 py-4 mb-3 rounded-lg text-md font-semibold flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg ${props.className}`}
      >
        {props.icon} {props.iconDescription}
      </button>
    </div>
  );
}

export default LargeInfoButton;

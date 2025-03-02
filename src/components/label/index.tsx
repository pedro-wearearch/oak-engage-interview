export interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  label: string;
}

export function Label({ label, required = false, ...props }: Props) {
  return (
    <div className="">
      <label {...props}>{label}</label>
      {required && <span> *</span>}
    </div>
  );
}

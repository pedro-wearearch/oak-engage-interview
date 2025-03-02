import { JSX } from "react";
import styles from "./select.module.css";

interface Props {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function Select({ label, name, options, onChange }: Props): JSX.Element {
  return (
    <div className={styles.container}>
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

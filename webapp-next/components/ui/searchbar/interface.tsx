import { FormEvent } from "react";

export interface SearchbarProps {
  w?: string | number;
  onSearch: (search: FormEvent<HTMLInputElement>) => void;
  size: "sm" | "md" | "lg";
  placeholder?: string;
}

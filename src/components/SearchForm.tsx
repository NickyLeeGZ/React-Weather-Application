import type { SearchFormProps } from "../types/props";

export const SearchForm = ({ value, onChange }: SearchFormProps) => {
    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="search-input"
        />
    );
};
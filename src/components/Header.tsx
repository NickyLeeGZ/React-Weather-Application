import type { HeaderProps } from "../types/props"

export const Header = ({ value }: HeaderProps) => {
    return <h2 style={{ textAlign: 'left', padding: 10, fontWeight: 'bold' }}>
        {value}
        <hr style={{ marginTop: 10 }} className="divider" />
    </h2>
}
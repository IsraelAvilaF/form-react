import "./Title.css"

export default function Title({titulo, subtitle}) {
    return (
        <h1 className="title">
            {titulo}
            {subtitle && <span className="subtitle">{subtitle}</span>}
        </h1>
    )
}

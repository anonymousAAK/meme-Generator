import React from "react"

export default function Header() {
    return (
        <header className="header">
            <img
                src="./images/troll-face.png"
                className="header--image"
                alt="Troll face logo"
            />
            <h1 className="header--title">Meme Generator</h1>
            <span className="header--project">React Project</span>
        </header>
    )
}

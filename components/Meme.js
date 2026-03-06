import React from "react"

export default function Meme() {
    const [meme, setMeme] = React.useState({
        topText: "",
        bottomText: "",
        randomImage: ""
    })
    const [allMemes, setAllMemes] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState(null)
    const [fontSize, setFontSize] = React.useState(2)
    const [history, setHistory] = React.useState([])

    function fetchMemes() {
        setIsLoading(true)
        setError(null)
        fetch("https://api.imgflip.com/get_memes")
            .then(function(res) {
                if (!res.ok) {
                    throw new Error("Failed to fetch memes")
                }
                return res.json()
            })
            .then(function(data) {
                setAllMemes(data.data.memes)
                setIsLoading(false)
            })
            .catch(function(err) {
                setError(err.message)
                setIsLoading(false)
            })
    }

    React.useEffect(fetchMemes, [])

    function getMemeImage() {
        if (allMemes.length === 0) return
        var randomNumber = Math.floor(Math.random() * allMemes.length)
        var url = allMemes[randomNumber].url
        setMeme(function(prevMeme) {
            return {
                topText: prevMeme.topText,
                bottomText: prevMeme.bottomText,
                randomImage: url
            }
        })
    }

    function handleChange(event) {
        var name = event.target.name
        var value = event.target.value
        setMeme(function(prevMeme) {
            var newMeme = {
                topText: prevMeme.topText,
                bottomText: prevMeme.bottomText,
                randomImage: prevMeme.randomImage
            }
            newMeme[name] = value
            return newMeme
        })
    }

    function handleFontSize(event) {
        setFontSize(parseFloat(event.target.value))
    }

    function saveToHistory() {
        if (!meme.randomImage) return
        setHistory(function(prev) {
            var entry = {
                image: meme.randomImage,
                topText: meme.topText,
                bottomText: meme.bottomText,
                id: Date.now()
            }
            return [entry].concat(prev).slice(0, 12)
        })
    }

    function loadFromHistory(item) {
        setMeme({
            topText: item.topText,
            bottomText: item.bottomText,
            randomImage: item.image
        })
    }

    function resetMeme() {
        setMeme({
            topText: "",
            bottomText: "",
            randomImage: ""
        })
        setFontSize(2)
    }

    if (error) {
        return (
            <main>
                <div className="error">
                    <p>Something went wrong: {error}</p>
                    <button className="error--retry" onClick={fetchMemes}>
                        Try Again
                    </button>
                </div>
            </main>
        )
    }

    if (isLoading) {
        return (
            <main>
                <div className="loading">
                    <div className="loading--spinner"></div>
                    <p>Loading memes...</p>
                </div>
            </main>
        )
    }

    var textStyle = { fontSize: fontSize + "em" }

    return (
        <main>
            <div className="meme--counter">
                <span>Available memes:</span>
                <span className="meme--counter-badge">{allMemes.length}</span>
            </div>

            <div className="form">
                <input
                    type="text"
                    placeholder="Top text"
                    className="form--input"
                    name="topText"
                    value={meme.topText}
                    onChange={handleChange}
                    aria-label="Top meme text"
                />
                <input
                    type="text"
                    placeholder="Bottom text"
                    className="form--input"
                    name="bottomText"
                    value={meme.bottomText}
                    onChange={handleChange}
                    aria-label="Bottom meme text"
                />
                <div className="form--controls">
                    <label htmlFor="fontSize">Text Size</label>
                    <input
                        id="fontSize"
                        type="range"
                        className="form--range"
                        min="1"
                        max="4"
                        step="0.25"
                        value={fontSize}
                        onChange={handleFontSize}
                    />
                    <span className="form--range-value">{fontSize}em</span>
                </div>
                <button
                    className="form--button"
                    onClick={getMemeImage}
                    disabled={allMemes.length === 0}
                >
                    Get a new meme image
                </button>
            </div>

            {meme.randomImage && (
                <div>
                    <div className="meme" key={meme.randomImage}>
                        <img
                            src={meme.randomImage}
                            className="meme--image"
                            alt="Generated meme"
                        />
                        {meme.topText && (
                            <h2
                                className="meme--text top"
                                style={textStyle}
                            >
                                {meme.topText}
                            </h2>
                        )}
                        {meme.bottomText && (
                            <h2
                                className="meme--text bottom"
                                style={textStyle}
                            >
                                {meme.bottomText}
                            </h2>
                        )}
                    </div>

                    <div className="actions">
                        <button
                            className="actions--button"
                            onClick={saveToHistory}
                        >
                            Save to Gallery
                        </button>
                        <button
                            className="actions--button"
                            onClick={resetMeme}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}

            {history.length > 0 && (
                <div className="gallery">
                    <h3 className="gallery--title">
                        Saved Memes ({history.length})
                    </h3>
                    <div className="gallery--grid">
                        {history.map(function(item) {
                            return (
                                <div
                                    key={item.id}
                                    className="gallery--item"
                                    onClick={function() { loadFromHistory(item) }}
                                    title="Click to load this meme"
                                >
                                    <img
                                        src={item.image}
                                        alt={"Meme: " + (item.topText || item.bottomText || "saved")}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {history.length === 0 && meme.randomImage && (
                <div className="gallery">
                    <h3 className="gallery--title">Saved Memes</h3>
                    <p className="gallery--empty">
                        No saved memes yet. Click "Save to Gallery" to keep your favorites!
                    </p>
                </div>
            )}
        </main>
    )
}

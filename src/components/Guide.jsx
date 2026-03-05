import './Guide.css'

const tagDictionary = [
    {
        name: 'The Big Header',
        tag: '<h1>',
        desc: 'Use this for your main title! It makes text big and bold.',
        example: '<h1>My Awesome Page</h1>'
    },
    {
        name: 'A Paragraph',
        tag: '<p>',
        desc: 'Use this for your regular stories and sentences.',
        example: '<p>Once upon a time...</p>'
    },
    {
        name: 'A Picture',
        tag: '<img>',
        desc: 'Add a fun image to your page! You can use a URL, upload your own, or pick a friend from the Character Gallery!',
        example: '<img src="https://placekitten.com/200/200">'
    },
    {
        name: 'A Link',
        tag: '<a>',
        desc: 'Create a magic portal to another web page!',
        example: '<a href="https://google.com">Click Me!</a>'
    },
    {
        name: 'A List',
        tag: '<ul>',
        desc: 'Group items together with dots (bullet points).',
        example: '<ul>\n  <li>Apples</li>\n  <li>Bananas</li>\n</ul>'
    },
    {
        name: 'Clicky Button',
        tag: '<button>',
        desc: 'Make something that people can click on!',
        example: '<button>Click My Magic!</button>'
    }
]

function Guide({ onClose, onInsertTag }) {
    return (
        <div className="guide-overlay" onClick={onClose}>
            <div className="guide-sidebar" onClick={(e) => e.stopPropagation()}>
                <div className="guide-header">
                    <h2>🚀 Learning Center</h2>
                    <button className="close-guide-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="guide-content">
                    <div className="guide-mascot-container">
                        <img
                            src="/characters/Sonic.png"
                            alt="Sonic Mascot"
                            className="mascot-image"
                        />
                        <p>Hey there, Explorer! I'm your coding buddy. Pick a tag below to see how it works, or click "Try it" to add it to your code!</p>
                    </div>

                    <div className="tag-dictionary">
                        {tagDictionary.map((item) => (
                            <div key={item.tag} className="tag-guide-card">
                                <div className="tag-guide-header">
                                    <span className="tag-guide-name">{item.name}</span>
                                    <span className="tag-guide-symbol">{item.tag}</span>
                                </div>
                                <p className="tag-guide-desc">{item.desc}</p>
                                <div className="tag-guide-example">
                                    {item.example}
                                </div>
                                <button
                                    className="try-it-btn"
                                    onClick={() => {
                                        onInsertTag(item.example);
                                        onClose();
                                    }}
                                >
                                    ✨ Try it in Editor
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Guide

export const cssStyleGroups = [
    {
        name: 'Layout Master',
        emoji: '🏗️',
        description: 'Navbar & Structure',
        styles: [
            { name: 'display: flex;', emoji: '👯', description: 'Line up items in a row or column' },
            { name: 'justify-content: space-between;', emoji: '↔️', description: 'Space items out evenly' },
            { name: 'align-items: center;', emoji: '↕️', description: 'Center items vertically' },
            { name: 'flex-direction: column;', emoji: '⬇️', description: 'Stack items vertically' },
            { name: 'gap: 20px;', emoji: '📏', description: 'Add space between items' },
            { name: 'position: relative;', emoji: '📍', description: 'Keep it in the flow but movable' },
            { name: 'position: absolute;', emoji: '🚀', description: 'Place it anywhere!' },
            { name: 'position: fixed;', emoji: '⚓', description: 'Sticky on the screen' },
            { name: 'z-index: 10;', emoji: '🥞', description: 'Layer it on top' },
            { name: 'overflow: hidden;', emoji: '✂️', description: 'Clip anything outside' },
            { name: 'width: 100%;', emoji: '↔️', description: 'Set the width' },
            { name: 'height: 300px;', emoji: '↕️', description: 'Set the height' },
            { name: 'display: grid;', emoji: '🏁', description: 'Create a powerful grid' },
            { name: 'grid-template-columns: 1fr 1fr;', emoji: '⚖️', description: 'Define grid columns' },
        ]
    },
    {
        name: 'The Painter',
        emoji: '🎨',
        description: 'Colors & Backgrounds',
        styles: [
            { name: 'background-color: #ff69b4;', emoji: '🖌️', description: 'Set the background color' },
            { name: 'color: white;', emoji: '🖍️', description: 'Set the text color' },
            { name: 'background-image: url("...");', emoji: '🖼️', description: 'Add a background image' },
            { name: 'linear-gradient(to right, #667eea, #764ba2)', emoji: '🌈', description: 'Smooth color transitions' },
            { name: 'opacity: 0.8;', emoji: '👻', description: 'Make it see-through' },
            { name: 'border-radius: 20px;', emoji: '⭕', description: 'Round the corners' },
            { name: 'border: 2px solid white;', emoji: '📦', description: 'Add a border' },
            { name: 'box-shadow: 0 10px 20px rgba(0,0,0,0.2);', emoji: '👤', description: 'Add a soft shadow' },
            { name: 'backdrop-filter: blur(10px);', emoji: '✨', description: 'Glass effect!' },
        ]
    },
    {
        name: 'The Typographer',
        emoji: '🔡',
        description: 'Text Styling',
        styles: [
            { name: 'font-family: "Outfit", sans-serif;', emoji: '🔤', description: 'Change the font' },
            { name: 'font-weight: 800;', emoji: '💪', description: 'Make it bold' },
            { name: 'font-size: 24px;', emoji: '📏', description: 'Change the size' },
            { name: 'line-height: 1.6;', emoji: '↔️', description: 'Space between lines' },
            { name: 'letter-spacing: 2px;', emoji: '🔠', description: 'Space between letters' },
            { name: 'text-transform: uppercase;', emoji: '📢', description: 'ALL CAPS' },
            { name: 'text-align: center;', emoji: '🎯', description: 'Center the text' },
            { name: 'text-decoration: none;', emoji: '❌', description: 'Remove underlines' },
        ]
    },
    {
        name: 'The Space Maker',
        emoji: '🌌',
        description: 'Sizing & Spacing',
        styles: [
            { name: 'margin: 20px;', emoji: '🚀', description: 'Space outside the box' },
            { name: 'margin: 0 auto;', emoji: '🎯', description: 'Center horizontally' },
            { name: 'padding: 15px;', emoji: '📥', description: 'Space inside the box' },
            { name: 'max-width: 1200px;', emoji: '🛑', description: 'Stop it from getting too wide' },
            { name: 'min-height: 100vh;', emoji: '📏', description: 'Fill the screen height' },
            { name: 'box-sizing: border-box;', emoji: '🧱', description: 'Perfect sizing calculations' },
        ]
    },
    {
        name: 'The Animator',
        emoji: '🎬',
        description: 'Interaction & Motion',
        styles: [
            { name: 'transition: all 0.3s ease;', emoji: '⏳', description: 'Smooth changes' },
            { name: 'cursor: pointer;', emoji: '🖱️', description: 'Make it clickable' },
            { name: 'transform: scale(1.1);', emoji: '🔍', description: 'Grow bigger on hover' },
            { name: 'transform: rotate(5deg);', emoji: '🔄', description: 'Tilt slightly' },
            { name: ':hover { ... }', emoji: '✨', description: 'Change when mouse touches it' },
        ]
    },
    {
        name: 'The Responsive Guru',
        emoji: '📱',
        description: 'Mobile vs Desktop',
        styles: [
            { name: '@media (max-width: 768px) { ... }', emoji: '🤳', description: 'Styles for phones' },
            { name: 'object-fit: cover;', emoji: '📸', description: 'Fill image area perfectly' },
            { name: 'aspect-ratio: 16/9;', emoji: '📺', description: 'Perfect shape' },
            { name: 'clamp(1rem, 5vw, 2rem)', emoji: '📏', description: 'Flexible size that fits any screen' },
        ]
    }
];

export const cssRecipes = {
    'display: flex;': {
        title: 'A Perfect Navbar 🍔',
        code: `display: flex;
justify-content: space-between;
align-items: center;
padding: 15px 30px;
background: white;
box-shadow: 0 4px 10px rgba(0,0,0,0.1);`
    },
    'display: grid;': {
        title: '3-Column Grid 🍱',
        code: `display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 20px;
width: 100%;`
    },
    'margin: 0 auto;': {
        title: 'Centered Hero Section 🦸',
        code: `display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 60vh;
text-align: center;
padding: 40px;`
    },
    'position: fixed;': {
        title: 'Sticky Footer ⚓',
        code: `position: fixed;
bottom: 0;
left: 0;
width: 100%;
padding: 20px;
background: #333;
color: white;`
    }
};

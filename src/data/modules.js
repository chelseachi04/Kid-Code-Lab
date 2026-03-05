// MODULE DATA FOR THE KID-FRIENDLY CODE EDITOR
// 10-Module Beginner HTML Curriculum for children ages 6–10

export const modules = [
  {
    id: 1,
    name: 'Web Page Skeleton',
    emoji: '🦴',
    description: 'Build an empty web page house',
    locked: false,
    quizPassed: false,
    badge: 'House Builder 🏠',
    mission: 'Build the Empty House',
    tagsIntroduced: ['html', 'head', 'title', 'body'],
    checklist: [
      { task: 'Page runs', completed: false },
      { task: 'Title shows in browser tab', completed: false },
      { task: 'Body is visible area', completed: false },
    ],
    codingPlan: `<!DOCTYPE html>
<html>
  <head>
    <title>My House</title>
  </head>
  <body>
  </body>
</html>`,
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>My House</title>
  </head>
  <body>
    <!-- Your content goes here! -->
  </body>
</html>`,
    tags: [
      { name: '<!DOCTYPE html>', emoji: '📄', module: 1 },
      { name: '<html>', emoji: '🏠', module: 1 },
      { name: '<head>', emoji: '🧠', module: 1 },
      { name: '<title>', emoji: '🏷️', module: 1 },
      { name: '<body>', emoji: '👕', module: 1 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'What tag is the whole house?',
        options: ['html', 'head', 'body'],
        correct: 0,
      },
      {
        id: 2,
        question: 'What tag is not visible?',
        options: ['body', 'head', 'html'],
        correct: 1,
      },
      {
        id: 3,
        question: 'Where do we see our content?',
        options: ['head', 'title', 'body'],
        correct: 2,
      },
    ],
  },
  {
    id: 2,
    name: 'First Web Page',
    emoji: '🎉',
    description: 'Create your favorite cartoon page',
    locked: true,
    quizPassed: false,
    badge: 'Cartoon Creator 🎬',
    mission: 'Cartoon Creator',
    tagsIntroduced: ['h1', 'p', 'img'],
    checklist: [
      { task: 'Big title', completed: false },
      { task: 'One sentence', completed: false },
      { task: 'One image', completed: false },
    ],
    codingPlan: `<!DOCTYPE html>
<html>
  <head>
    <title>Cartoon Page</title>
  </head>
  <body>
    <h1>My Favorite Cartoon</h1>
    <p>I love watching this show!</p>
    <img src="/characters/Alvin.jpg" width="150">
  </body>
</html>`,
    starterCode: `<html>
  <head>
    <title>Cartoon Page</title>
  </head>
  <body>
    <h1>My Favorite Cartoon</h1>
    <p>I love watching this show!</p>
    <img src="/characters/Bingo.jpg" width="150">
  </body>
</html>`,
    tags: [
      { name: '<!DOCTYPE html>', emoji: '📄', module: 1 },
      { name: '<html>', emoji: '🏠', module: 1 },
      { name: '<head>', emoji: '🧠', module: 1 },
      { name: '<title>', emoji: '🏷️', module: 1 },
      { name: '<body>', emoji: '👕', module: 1 },
      { name: '<h1>', emoji: '📌', module: 2 },
      { name: '<p>', emoji: '📄', module: 2 },
      { name: '<img>', emoji: '🖼️', module: 2 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'Which tag makes a big title?',
        options: ['h1', 'p', 'img'],
        correct: 0,
      },
      {
        id: 2,
        question: 'What tag is for a sentence?',
        options: ['img', 'h1', 'p'],
        correct: 2,
      },
      {
        id: 3,
        question: 'What tag adds a picture?',
        options: ['p', 'img', 'h1'],
        correct: 1,
      },
    ],
  },
  {
    id: 3,
    name: 'More Headings',
    emoji: '🔠',
    description: 'Learn text sizes visually',
    locked: true,
    quizPassed: false,
    badge: 'Title Master 🔠',
    mission: 'Title Master',
    tagsIntroduced: ['h2', 'h3'],
    checklist: [
      { task: 'h1 main title', completed: false },
      { task: 'h2 subtitle', completed: false },
      { task: 'h3 small section', completed: false },
    ],
    codingPlan: `<h1>Main Title</h1>
<h2>Subtitle</h2>
<h3>Small Section</h3>`,
    starterCode: `<h1>Main Title</h1>
<h2>Subtitle</h2>
<h3>Small Section</h3>`,
    tags: [
      { name: '<h1>', emoji: '📌', module: 2 },
      { name: '<h2>', emoji: '📌', module: 3 },
      { name: '<h3>', emoji: '📌', module: 3 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'Which heading is the biggest?',
        options: ['h1', 'h2', 'h3'],
        correct: 0,
      },
      {
        id: 2,
        question: 'Which heading is smaller than h2?',
        options: ['h1', 'h3', 'both'],
        correct: 1,
      },
      {
        id: 3,
        question: 'How many types of headings are we using here?',
        options: ['1', '2', '3'],
        correct: 2,
      },
    ],
  },
  {
    id: 4,
    name: 'Lists',
    emoji: '📋',
    description: 'Favorite characters list',
    locked: true,
    quizPassed: false,
    badge: 'List Builder 📋',
    mission: 'List Builder',
    tagsIntroduced: ['ul', 'li'],
    checklist: [
      { task: 'One heading', completed: false },
      { task: 'One list with 3 items', completed: false },
    ],
    codingPlan: `<h1>My Heroes</h1>
<ul>
  <li>Hero 1</li>
  <li>Hero 2</li>
  <li>Hero 3</li>
</ul>`,
    starterCode: `<h1>My Heroes</h1>
<ul>
  <li>Hero 1</li>
  <li>Hero 2</li>
  <li>Hero 3</li>
</ul>`,
    tags: [
      { name: '<h1>', emoji: '📌', module: 2 },
      { name: '<ul>', emoji: '📝', module: 4 },
      { name: '<li>', emoji: '✓', module: 4 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'What tag starts a list?',
        options: ['li', 'ul', 'h1'],
        correct: 1,
      },
      {
        id: 2,
        question: 'What tag is for each item in a list?',
        options: ['ul', 'p', 'li'],
        correct: 2,
      },
      {
        id: 3,
        question: 'Can a list have more than 3 items?',
        options: ['Yes', 'No', 'Maybe'],
        correct: 0,
      },
    ],
  },
  {
    id: 5,
    name: 'More Images',
    emoji: '🖼️',
    description: 'Multiple images on a page',
    locked: true,
    quizPassed: false,
    badge: 'Gallery Maker 🖼️',
    mission: 'Gallery Maker',
    tagsIntroduced: ['img'],
    checklist: [
      { task: '3 images', completed: false },
      { task: 'Each image loads correctly', completed: false },
    ],
    codingPlan: `<img src="/characters/Alvin.jpg" width="100">
<img src="/characters/Simon.jpg" width="100">
<img src="/characters/Theodore.jpg" width="100">`,
    starterCode: `<img src="/characters/Alvin.jpg" width="100">
<img src="/characters/Simon.jpg" width="100">
<img src="/characters/Theodore.jpg" width="100">`,
    tags: [
      { name: '<img>', emoji: '🖼️', module: 2 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'What tag do we use for images?',
        options: ['pic', 'img', 'photo'],
        correct: 1,
      },
      {
        id: 2,
        question: 'How do we show many images?',
        options: ['Use one img tag', 'Use many img tags', 'Use a p tag'],
        correct: 1,
      },
      {
        id: 3,
        question: 'Does an image tag need a closing tag like </img>?',
        options: ['Yes', 'No', 'Sometimes'],
        correct: 1,
      },
    ],
  },
  {
    id: 6,
    name: 'Links',
    emoji: '🔗',
    description: 'Clickable links',
    locked: true,
    quizPassed: false,
    badge: 'Link Explorer 🔗',
    mission: 'Link Explorer',
    tagsIntroduced: ['a'],
    checklist: [
      { task: 'One link to a cartoon website', completed: false },
      { task: 'Link text visible', completed: false },
    ],
    codingPlan: `<a href="https://www.google.com">Search the Web</a>
<a href="https://www.disney.com">Visit Disney!</a>`,
    starterCode: `<a href="https://www.disney.com">Visit Disney!</a>`,
    tags: [
      { name: '<a>', emoji: '🔗', module: 6 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'What happens when we click a link?',
        options: ['It closes the page', 'It takes us to a new website', 'It changes the color'],
        correct: 1,
      },
      {
        id: 2,
        question: 'What tag do we use for links?',
        options: ['a', 'link', 'go'],
        correct: 0,
      },
      {
        id: 3,
        question: 'What is the text between <a> and </a> called?',
        options: ['Secret code', 'Link text', 'Address'],
        correct: 1,
      },
    ],
  },
  {
    id: 7,
    name: 'Sections',
    emoji: '🧱',
    description: 'Organize content',
    locked: true,
    quizPassed: false,
    badge: 'Page Organizer 🧱',
    mission: 'Page Organizer',
    tagsIntroduced: ['div'],
    checklist: [
      { task: 'Two sections', completed: false },
      { task: 'Each section has a heading', completed: false },
    ],
    codingPlan: `<div>
  <h2>My Favorite Section</h2>
  <p>This is inside a box!</p>
</div>`,
    starterCode: `<div>
  <h2>Section 1</h2>
  <p>Content here.</p>
</div>
<div>
  <h2>Section 2</h2>
  <p>More content here.</p>
</div>`,
    tags: [
      { name: '<div>', emoji: '📦', module: 7 },
      { name: '<h2>', emoji: '📌', module: 3 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'What tag is like a box for organizing?',
        options: ['p', 'div', 'img'],
        correct: 1,
      },
      {
        id: 2,
        question: 'Can we put a heading inside a div?',
        options: ['Yes', 'No', 'Never'],
        correct: 0,
      },
      {
        id: 3,
        question: 'How many divs can we have on a page?',
        options: ['Only 1', 'As many as we want', 'Zero'],
        correct: 1,
      },
    ],
  },
  {
    id: 8,
    name: 'Line Breaks & Spacing',
    emoji: '📝',
    description: 'Control text layout',
    locked: true,
    quizPassed: false,
    badge: 'Text Styler ✏️',
    mission: 'Text Styler',
    tagsIntroduced: ['br', 'hr'],
    checklist: [
      { task: 'Line break used', completed: false },
      { task: 'Horizontal line used', completed: false },
    ],
    codingPlan: `<p>Line one<br>Line two</p>
<hr>
<p>New section!</p>`,
    starterCode: `<p>Line one<br>Line two</p>
<hr>
<p>New section after a line!</p>`,
    tags: [
      { name: '<br>', emoji: '↩️', module: 8 },
      { name: '<hr>', emoji: '➖', module: 8 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'What tag makes a new line?',
        options: ['hr', 'br', 'p'],
        correct: 1,
      },
      {
        id: 2,
        question: 'What tag makes a straight line across?',
        options: ['br', 'hr', 'line'],
        correct: 1,
      },
      {
        id: 3,
        question: 'Which tag is like hitting "Enter" on a keyboard?',
        options: ['p', 'br', 'h1'],
        correct: 1,
      },
    ],
  },
  {
    id: 9,
    name: 'Mini Project',
    emoji: '🧩',
    description: 'My Cartoon Website',
    locked: true,
    quizPassed: false,
    badge: 'Junior Web Designer 🧩',
    mission: 'Junior Web Designer',
    tagsIntroduced: [],
    checklist: [
      { task: 'Title', completed: false },
      { task: '2 headings', completed: false },
      { task: '2 paragraphs', completed: false },
      { task: '3 images', completed: false },
      { task: '1 list', completed: false },
      { task: '1 link', completed: false },
    ],
    codingPlan: `<h1>My Cartoon World</h1>
<p>Welcome to my page!</p>
<ul>
  <li>Alvin</li>
  <li>Simon</li>
</ul>
<img src="/characters/Theodore.jpg" width="150">`,
    starterCode: `<h1>My Cartoon World</h1>
<p>Welcome to my awesome page!</p>`,
    tags: [
      { name: '<h1>', emoji: '📌', module: 2 },
      { name: '<p>', emoji: '📄', module: 2 },
      { name: '<img>', emoji: '🖼️', module: 2 },
      { name: '<ul>', emoji: '📝', module: 4 },
      { name: '<a>', emoji: '🔗', module: 6 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'Do we need new tags for this project?',
        options: ['Yes', 'No', 'Maybe'],
        correct: 1,
      },
      {
        id: 2,
        question: 'What should we include in our project?',
        options: ['Only text', 'Only images', 'A mix of everything we learned'],
        correct: 2,
      },
      {
        id: 3,
        question: 'Is this the final project?',
        options: ['Yes', 'No', 'Almost!'],
        correct: 2,
      },
    ],
  },
  {
    id: 10,
    name: 'Final Project + Certificate',
    emoji: '🏆',
    description: 'Build any topic page',
    locked: true,
    quizPassed: false,
    badge: 'Certified Web Creator 🏆',
    mission: 'Certified Web Creator',
    tagsIntroduced: [],
    checklist: [
      { task: 'Final project complete', completed: false },
    ],
    codingPlan: `<!DOCTYPE html>
<html>
  <head>
    <title>Masterpiece</title>
  </head>
  <body>
    <h1>My Final Page</h1>
  </body>
</html>`,
    starterCode: `<html>
  <head>
    <title>My Final Masterpiece</title>
  </head>
  <body>
    <!-- Build anything you want! -->
  </body>
</html>`,
    tags: [
      { name: '<html>', emoji: '🏠', module: 1 },
      { name: '<body>', emoji: '👕', module: 1 },
    ],
    questionPool: [
      {
        id: 1,
        question: 'Are you a Web Creator now?',
        options: ['Yes!', 'Not yet', 'Maybe'],
        correct: 0,
      },
      {
        id: 2,
        question: 'What do you get after this module?',
        options: ['A cookie', 'A certificate', 'A new computer'],
        correct: 1,
      },
      {
        id: 3,
        question: 'Can you build more pages after this?',
        options: ['Yes, always!', 'No, I am done', 'Only if I start over'],
        correct: 0,
      },
    ],
  },
]

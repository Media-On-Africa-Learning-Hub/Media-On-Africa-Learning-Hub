/* ==========================================================================
   Blog post data — the single source of truth for blog content.
   To add a new post: add an object to this array. blog-render.js will
   pick it up automatically; nothing else needs to change.

   Shape:
   {
     id: number,               // unique, stable — used for bookmarks/comments/read-tracking
     title: string,
     author: string,
     authorNote: string|null,  // optional italic bio line shown at the end of the post
     readingTime: string,      // e.g. "4 min read"
     accent: "rainbow-1" .. "rainbow-6"  // which token colors this card's top border
     paragraphs: string[],     // body text, one entry per paragraph
     quote: { text: string, cite: string|null } | null
   }
   ========================================================================== */

const blogData = [
  {
    id: 1,
    title: "Why Humans Will Always Be Needed in the 5th Industrial Revolution",
    author: "Themba Netshifira",
    authorNote: null,
    readingTime: "4 min read",
    accent: "rainbow-1",
    paragraphs: [
      "Many people were forced by the Covid-19 pandemic to adapt to new norms. While the pandemic led to an improvement in some skills, it also took away the human connection. The Fourth Industrial Revolution (4IR) talks about the tech era we're in, while the Fifth IR refers to the human consciousness that we see ourselves returning to through technology.",
    ],
    quote: { text: "We need human beings for both industries to integrate.", cite: null },
  },
  {
    id: 2,
    title: "My Journey with Technology",
    author: "Themba Netshifira",
    authorNote: null,
    readingTime: "3 min read",
    accent: "rainbow-2",
    paragraphs: [
      "For the past seven years, I initiated a digital learning programme in Mpumalanga, training young people in computer and tech skills. While they were learning, some were out of touch with their peers even when they needed help. Emotional intelligence and communication are being lost, even as technical skills grow.",
    ],
    quote: {
      text: "Today, many young people cannot effectively communicate and lack emotional intelligence.",
      cite: null,
    },
  },
  {
    id: 3,
    title: "Robots and Young People",
    author: "Themba Netshifira",
    authorNote: "Themba Netshifira is a member of ACTIVATE! Change Drivers writers hub",
    readingTime: "5 min read",
    accent: "rainbow-3",
    paragraphs: [
      "AI, robotics, and VR do not have senses — yet young people have adopted some of those attributes. The 5th IR will revolutionise the future of work, valuing soft skills and human consciousness over pure technical ability.",
      "Tech layoffs show companies are doing more with less. Developers will need to understand human development alongside product creation. The 5th IR reminds us that technology is here to stay, but humans will always be superior.",
    ],
    quote: { text: "Humans are underrated.", cite: "Elon Musk" },
  },
];
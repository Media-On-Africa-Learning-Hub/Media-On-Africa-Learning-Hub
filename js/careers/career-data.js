/* ══════════════════════════════════════════
   Career Discovery Assessment — assessment data
   (RIASEC interests, VARK learning style, work
   preferences, strengths & values). Pulled out of
   career-discovery.html's inline <script>, same
   pattern as reasoning-data.js.
   ══════════════════════════════════════════ */

const RIASEC_ITEMS = [
  { id: "ri_r1", type: "R", text: "I enjoy building, fixing or taking things apart to see how they work." },
  { id: "ri_r2", type: "R", text: "I'd rather work with my hands and tools than sit at a desk all day." },
  { id: "ri_r3", type: "R", text: "I like being outdoors or physically active rather than stuck in an office." },
  { id: "ri_r4", type: "R", text: "I'm interested in how machines, electronics or engineering systems work." },
  { id: "ri_i1", type: "I", text: "I enjoy solving complex problems and figuring out how things work logically." },
  { id: "ri_i2", type: "I", text: "I like collecting data, researching and analysing information." },
  { id: "ri_i3", type: "I", text: "I ask 'why' a lot and enjoy digging deeper into a topic." },
  { id: "ri_i4", type: "I", text: "I enjoy science, mathematics or working with computers and technology." },
  { id: "ri_a1", type: "A", text: "I enjoy creating original things - art, music, writing or design." },
  { id: "ri_a2", type: "A", text: "I like expressing myself in unconventional or imaginative ways." },
  { id: "ri_a3", type: "A", text: "I prefer open-ended tasks where I can use my imagination." },
  { id: "ri_a4", type: "A", text: "I enjoy performing, designing or producing creative work." },
  { id: "ri_s1", type: "S", text: "I enjoy helping, teaching or supporting other people." },
  { id: "ri_s2", type: "S", text: "I like working directly with people rather than alone with data or objects." },
  { id: "ri_s3", type: "S", text: "I'm good at listening and understanding how others feel." },
  { id: "ri_s4", type: "S", text: "I would enjoy a career focused on caring for or guiding others." },
  { id: "ri_e1", type: "E", text: "I enjoy leading a team or convincing others of my ideas." },
  { id: "ri_e2", type: "E", text: "I like taking initiative and starting new projects or ventures." },
  { id: "ri_e3", type: "E", text: "I'm comfortable with competition, negotiation and taking risks." },
  { id: "ri_e4", type: "E", text: "I enjoy selling, promoting or persuading people." },
  { id: "ri_c1", type: "C", text: "I like following clear procedures, rules and structured plans." },
  { id: "ri_c2", type: "C", text: "I enjoy organising information, files or schedules." },
  { id: "ri_c3", type: "C", text: "I pay close attention to detail and accuracy in my work." },
  { id: "ri_c4", type: "C", text: "I prefer tasks with a clear right way to do them, rather than ambiguity." },
];

const RIASEC_DB = {
  R: {
    name: "The Builder",
    desc: "You're hands-on and practical. You like tangible results, working with tools, machines or the outdoors, and learning by doing rather than sitting through theory.",
    subjects: ["Engineering Graphics & Design", "Technical Mathematics", "Physical Sciences", "Agricultural Sciences", "Consumer Studies"],
    careers: ["Electrician", "Mechanical Engineer", "Civil Engineer", "Paramedic", "Agricultural Technician", "Pilot"],
    growth: "Practical, hands-on skills — try a workshop, DIY project or technical hobby.",
  },
  I: {
    name: "The Investigator",
    desc: "You're analytical and curious. You enjoy solving complex problems, working with data, and understanding how and why things work.",
    subjects: ["Mathematics", "Physical Sciences", "Life Sciences", "Information Technology", "Computer Applications Technology"],
    careers: ["Software Developer", "Data Analyst", "Cybersecurity Analyst", "Doctor", "Research Scientist", "Actuary"],
    growth: "Analytical thinking — practice puzzles, research tasks or breaking problems into steps.",
  },
  A: {
    name: "The Creator",
    desc: "You're imaginative and expressive. You enjoy originality, design, and using creativity to communicate ideas.",
    subjects: ["Visual Arts", "Design", "Dramatic Arts", "English Home Language", "Information Technology"],
    careers: ["Graphic Designer", "UX/UI Designer", "Content Creator", "Architect", "Film & Video Editor", "Journalist"],
    growth: "Creative expression — sketch, write or experiment with design tools regularly.",
  },
  S: {
    name: "The Helper",
    desc: "You're caring and people-focused. You enjoy teaching, supporting and understanding others, and building genuine connections.",
    subjects: ["Life Orientation", "Life Sciences", "History", "English Home Language", "Consumer Studies"],
    careers: ["Teacher", "Social Worker", "Nurse", "Psychologist", "HR Officer", "Community Development Worker"],
    growth: "Communication & empathy — practice active listening, group work or volunteering.",
  },
  E: {
    name: "The Persuader",
    desc: "You're confident and driven. You like leading, taking initiative, and influencing outcomes in business, projects or public life.",
    subjects: ["Business Studies", "Economics", "Accounting", "Mathematics", "English Home Language"],
    careers: ["Entrepreneur", "Marketing Manager", "Sales Executive", "Lawyer", "Project Manager", "Public Relations Officer"],
    growth: "Confidence & leadership — take initiative in group projects and practice public speaking.",
  },
  C: {
    name: "The Organiser",
    desc: "You're structured and detail-oriented. You enjoy order, accuracy and working within clear systems and procedures.",
    subjects: ["Accounting", "Mathematics", "Business Studies", "Information Technology", "Computer Applications Technology"],
    careers: ["Accountant", "Bookkeeper", "Data Administrator", "Auditor", "Logistics Coordinator", "Bank Official"],
    growth: "Organisation & planning — use checklists, plan projects ahead, and double-check details.",
  },
};

const VARK_ITEMS = [
  { id: "vk1", text: "When learning something new, I prefer to:", options: [
    { v: "a", type: "V", label: "Watch a video or look at diagrams" },
    { v: "b", type: "A", label: "Listen to someone explain it" },
    { v: "c", type: "R", label: "Read the instructions or notes" },
    { v: "d", type: "K", label: "Try it out myself, hands-on" }] },
  { id: "vk2", text: "When I picture a memory, I mostly remember:", options: [
    { v: "a", type: "V", label: "Images and how things looked" },
    { v: "b", type: "A", label: "Conversations and sounds" },
    { v: "c", type: "R", label: "Notes or words I read/wrote" },
    { v: "d", type: "K", label: "What I was doing or feeling" }] },
  { id: "vk3", text: "To remember a phone number, I would:", options: [
    { v: "a", type: "V", label: "Picture it visually" },
    { v: "b", type: "A", label: "Say it out loud repeatedly" },
    { v: "c", type: "R", label: "Write it down" },
    { v: "d", type: "K", label: "Dial it a few times to memorise the pattern" }] },
  { id: "vk4", text: "I understand a new app or tool best by:", options: [
    { v: "a", type: "V", label: "Looking at screenshots or a flow diagram" },
    { v: "b", type: "A", label: "Having someone talk me through it" },
    { v: "c", type: "R", label: "Reading the manual or FAQ" },
    { v: "d", type: "K", label: "Clicking around and figuring it out myself" }] },
  { id: "vk5", text: "In class, I concentrate best when:", options: [
    { v: "a", type: "V", label: "There are visual aids like slides or charts" },
    { v: "b", type: "A", label: "The teacher explains things verbally" },
    { v: "c", type: "R", label: "I can read the textbook myself" },
    { v: "d", type: "K", label: "There's a hands-on activity or experiment" }] },
  { id: "vk6", text: "When assembling furniture or a device, I prefer:", options: [
    { v: "a", type: "V", label: "Diagrams with pictures" },
    { v: "b", type: "A", label: "Someone talking me through each step" },
    { v: "c", type: "R", label: "Written instructions" },
    { v: "d", type: "K", label: "Just starting and learning as I go" }] },
  { id: "vk7", text: "My notes usually include:", options: [
    { v: "a", type: "V", label: "Diagrams, colours and mind maps" },
    { v: "b", type: "A", label: "Phrases I'd say out loud to remember" },
    { v: "c", type: "R", label: "Detailed written sentences" },
    { v: "d", type: "K", label: "Few notes — I prefer to practice instead" }] },
  { id: "vk8", text: "I enjoy learning through:", options: [
    { v: "a", type: "V", label: "Infographics and videos" },
    { v: "b", type: "A", label: "Discussions and podcasts" },
    { v: "c", type: "R", label: "Books and articles" },
    { v: "d", type: "K", label: "Experiments, sport or building things" }] },
];

const VARK_DB = {
  V: "Visual learner — you learn best through diagrams, videos, colour and images. Try mind maps, infographics and watching demonstrations.",
  A: "Auditory learner — you learn best through discussion, explanation and listening. Try reading notes aloud, podcasts and study groups.",
  R: "Read/Write learner — you learn best through reading and writing things down. Try detailed notes, lists and written summaries.",
  K: "Kinesthetic learner — you learn best through hands-on practice and doing. Try experiments, practical exercises and real projects.",
};

const WORKPREF_ITEMS = [
  { id: "wp1", label: "Environment", a: "Indoors in an office or classroom", b: "Outdoors or on the move" },
  { id: "wp2", label: "Focus", a: "Mostly working with people", b: "Mostly working with data, systems or objects" },
  { id: "wp3", label: "Structure", a: "As part of a team, collaborating with others", b: "Independently, with my own space" },
  { id: "wp4", label: "Approach", a: "Following a clear, set process", b: "Experimenting with new approaches" },
  { id: "wp5", label: "Pace", a: "A fast-paced, high-energy environment", b: "A calm, steady environment" },
  { id: "wp6", label: "Role", a: "Leading and deciding for the group", b: "Supporting and contributing to the group" },
];

const STRENGTH_ITEMS = ["Critical Thinking", "Problem Solving", "Communication", "Creativity", "Organisation", "Leadership", "Empathy & Caring", "Technical/Digital Skills", "Attention to Detail", "Persistence", "Teamwork", "Public Speaking"];
const STRENGTH_MAX = 5;

const VALUE_ITEMS = ["Money / Financial Reward", "Helping Society", "Job Security", "Creativity & Self-Expression", "Leadership & Influence", "Independence & Flexibility", "Work-Life Balance", "Recognition & Achievement"];
const VALUE_MAX = 3;
const VALUE_TIPS = {
  "Money / Financial Reward": "fields like finance, engineering, medicine and tech tend to offer strong earning potential.",
  "Helping Society": "careers in healthcare, education, social work and NGOs let you make a direct impact.",
  "Job Security": "government, education, healthcare and accounting are traditionally stable fields.",
  "Creativity & Self-Expression": "design, media, arts and marketing let you express original ideas.",
  "Leadership & Influence": "business, law, politics and project management offer clear leadership paths.",
  "Independence & Flexibility": "freelancing, entrepreneurship and remote-friendly tech roles offer flexibility.",
  "Work-Life Balance": "look for structured roles in fields like education, government or established corporates.",
  "Recognition & Achievement": "competitive, results-driven fields like sales, sport science or entrepreneurship offer visible recognition.",
};
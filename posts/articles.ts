import { clone, startCase } from "lodash";
import { binaryInlined, LocalLinter } from "harper.js";

export type PostDeclaration = {
  keywords: string[];
  image: string | null;
  pubDate: string;
  description: string;
};

export type PartialPost = {
  title: string;
  description_html: string;
  author: string;
} & PostDeclaration;

export type FullPost = {
  content_html: string;
} & PartialPost;

const postDeclarations: Record<string, PostDeclaration> = {
  harper_for_firefox_through_spellbolt: {
      pubDate: new Date(2025, 4, 19).toUTCString(), 
      description: "SpellBolt is a Firefox extension that delivers Harper's fantastic grammar checking straight into your Firefox browser.",
      keywords: [
        "Harper",
        "Firefox",
        "Chrome",
        "grammar checker",
        "extension",
        "SpellBolt",
        "Mozilla",
        "addons",
        "offline grammar checking",
        "harper.js",
        "open-source",
        "pluggable architecture",
        "contributions"
      ],
      image: "/images/ford_street.webp"
  },
  integration_testing_thousands_of_sites_with_playwright: {
      pubDate: new Date(2025, 4, 16).toUTCString(), 
      description: "There are a great variety text editors on the web, each used in a different context. That's a beautiful thing, but unfortunately our users expect Harper to work in all of these places seamlessly.",
      keywords: [
        "Playwright",
        "integration testing",
        "end-to-end testing",
        "Harper",
        "text editors",
        "browser extensions",
        "automation",
        "DOM attributes",
        "GitHub Actions",
        "website testing"
      ],
      image: null,
  },
  bypassing_hallucinations_in_llms: {
      pubDate: new Date(2025, 4, 14).toUTCString(), 
      description:
        "If there is one thing o3 is useful for, it's __finding canonical documentation for complex subjects.__",
      keywords: [
        "OpenAI o3",
        "AI model",
        "AI for research",
        "canonical documentation",
        "authoritative sources",
        "information retrieval",
        "AI factual accuracy",
        "AI limitations",
        "W3C spec",
        "Dragon Book",
        "man pages",
        "research techniques",
        "Nikon D7100",
      ],
      image: null,
    },
  putting_harper_in_your_browser: {
    pubDate: new Date(2025, 4, 2).toUTCString(),
    description: "When our users install Harper, they should expect it to work anywhere they do.",
    keywords: [
      "Harper everywhere",
      "portable grammar checker",
      "Harper Chrome extension",
      "WebAssembly integration",
      "textarea mirroring",
      "contenteditable support",
      "source of truth",
      "performance and complexity"
    ],
    image: "/images/harper_chrome_ext_2.png",
  },
  "always_think_of_the_hook_first": {
    pubDate: new Date(2025, 4, 1).toUTCString(),
    description: "Spend more time on the introduction than anything else.",
    keywords: [
      "writing hook",
      "introduction first",
      "deliberate writing practice",
      "revision process",
      "audience attention",
      "Harper grammar checker",
      "David McCullough writing advice"
    ],
    image: "/images/log.webp",
  },
  chatgpt_for_the_moms: {
    pubDate: new Date(2025, 3, 23).toUTCString(),
    description:
      "Advice you can give your mom (or other nontechnical person) for how to use ChatGPT wisely and effectively.",
    keywords: [
      "ChatGPT tips for moms",
      "AI literacy for parents",
      "using ChatGPT safely",
      "web search tool ChatGPT",
      "critical thinking with AI",
      "family technology advice",
      "AI limitations",
      "responsible AI use",
    ],
    image: "/images/guggenheim.webp",
  },
  status_of_the_harper_chrome_extension: {
    pubDate: new Date(2025, 3, 23).toUTCString(),
    description:
      "An update on the long-awaited Harper Chrome extension, its current state, and what to expect next.",
    keywords: [
      "Harper Chrome extension",
      "grammar checker extension",
      "on-device grammar checking",
      "Chrome extension status",
      "Harper plugin development",
      "privacy-focused writing tool",
      "Gutenberg editor support",
      "Harper Chrome PR update",
    ],
    image: "/images/harper_chrome_ext.png",
  },
  photography_as_meditation: {
    pubDate: new Date(2025, 3, 19).toUTCString(),
    description: "Reflecting on the clarity photography brings.",
    keywords: [
      "photography and mindfulness",
      "meditative photography",
      "slowing down with a camera",
      "photography as awareness practice",
      "framing as understanding",
      "creative meditation",
      "visual appreciation",
      "mother photographer story",
    ],
    image: "/images/pink_flower_tree.webp",
  },
  the_art_of_exception: {
    pubDate: new Date(2025, 3, 18).toUTCString(),
    description:
      "Reflecting on lessons learned from handling English edge cases in developing Harper's Chrome extension.",
    keywords: [
      "English edge cases",
      "Harper Chrome extension",
      "exception-tolerant code",
      "WYSIWYG editor integration",
      "false-positive suppression",
      "community contributions",
      "DSL readability",
      "software design intuition",
    ],
    image: null,
  },
  on_linkarzu: {
    pubDate: new Date(2025, 3, 17).toUTCString(),
    description: "I was honored to be a guest on Linkarzu's YouTube series.",
    keywords: [
      "Neovim community interview",
      "Linkarzu YouTube",
      "Harper grammar checker",
      "Neovim plugin Harper",
      "grammar checker for developers",
      "open‑source maintenance",
      "developer writing workflow",
      "software‑engineering tools discussion",
    ],
    image: null,
  },
  footguns_of_the_rust_webassembly_target: {
    pubDate: new Date(2025, 3, 8).toUTCString(),
    description:
      "Four years in Rust + WebAssembly taught me these 3 lethal footguns—don’t learn them the hard way.",
    keywords: [
      "Rust",
      "WebAssembly",
      "async functions",
      "Linter",
      "wasm_bindgen",
      "IO limitations",
      "inlining",
      "Obsidian plugins",
      "Harper",
      "Automattic",
    ],
    image: "/images/rail.webp",
  },
  the_books_i_read_in_february_and_march_2025: {
    pubDate: new Date(2025, 3, 5).toUTCString(),
    description: "Two months does not mean twice as many.",
    keywords: [
      "book review",
      "reading list",
      "February 2025",
      "Herman Koch",
      "The Dinner",
      "Isaac Asimov",
      "Gold",
      "Bonnie Garmus",
      "Lessons in Chemistry",
      "fiction",
    ],
    image: null,
  },
  the_one_hard_thing: {
    pubDate: new Date(2025, 2, 27).toUTCString(),
    description: "Reach further each day. The minimum effective dose.",
    keywords: [
      "productivity",
      "Pareto distribution",
      "one hard thing",
      "daily habit",
      "tasks",
      "morning routine",
      "harper-ls",
      "Harper Obsidian plugin",
      "Jetpack AI",
      "WebAssembly",
      "grammar checker",
      "circadian rhythm",
      "time management",
      "mental clarity",
    ],
    image: null,
  },
  "3_traits_of_good_test_suites": {
    pubDate: new Date(2025, 2, 23).toUTCString(),
    description: "Don't believe the clickbait.",
    keywords: ["harper", "grammar", "testing", "unit", "integration"],
    image: null,
  },
  ["LLM_assisted_fuzzing"]: {
    pubDate: new Date(2025, 2, 21).toUTCString(),
    description: "A new approach to false-positives.",
    keywords: ["harper", "grammar", "ollama", "quality"],
    image: null,
  },
  harper_is_in_cursor_and_visual_studio_code: {
    pubDate: new Date(2025, 2, 19).toUTCString(),
    description: "A boon if you comment your code.",
    keywords: [
      "Harper",
      "grammar checker",
      "VSCode extension",
      "Language Server Protocol",
      "ESLint",
      "Pylance",
      "Visual Studio Marketplace",
      "open source",
      "plugin",
      "code editors",
      "language server",
      "integrations",
      "programming languages",
      "typos",
    ],
    image: null,
  },
  never_wait: {
    pubDate: new Date(2025, 2, 1).toUTCString(),
    description: "Your code is always welcome.",
    keywords: [
      "pull request",
      "draft PR",
      "open source",
      "duplicate work",
      "CI (Continuous Integration)",
      "debugging",
      "mentorship",
      "community building",
      "contribution",
      "collaboration",
      "GitHub",
      "feedback loop",
      "project efficiency",
      "contributor support",
      "early submission",
    ],

    image: null,
  },
  ["prompting_large_language_models_in_bash_scripts"]: {
    pubDate: new Date(2025, 1, 26).toUTCString(),
    description: "Of course it's that easy.",
    keywords: ["harper", "grammar", "ollama"],
    image: null,
  },
  a_harper_record: {
    pubDate: new Date(2025, 1, 6).toUTCString(),
    description: "🎉",
    keywords: ["harper", "grammar", "raycast"],
    image: null,
  },
  the_books_i_read_in_january_2025: {
    pubDate: new Date(2025, 1, 4).toUTCString(),
    description: "Spoiler: there aren't many.",
    keywords: ["async", "sync", "communication", "project", "management"],
    image: null,
  },
  notifications: {
    pubDate: new Date(2025, 1, 2).toUTCString(),
    description: "The mornings are for deep work.",
    keywords: ["deep", "work", "open-source", "github", "notifications"],
    image: null,
  },
  the_three_steps_to_an_apology: {
    description: "Wisdom from my grandmother.",
    pubDate: new Date(2025, 0, 30).toUTCString(),
    keywords: [],
    image: null,
  },
  the_best_25_bucks_i_ever_spent: {
    description: "Bonus: why you need to do it too.",
    pubDate: new Date(2025, 0, 13).toUTCString(),
    keywords: ["flip", "phone", "quiet"],
    image: null,
  },
  why_you_need_sccache: {
    description: "You might not actually need it.",
    pubDate: new Date(2024, 11, 29).toUTCString(),
    keywords: ["sccache", "rust", "development", "linux", "distributed"],
    image: null,
  },
  the_best_books_i_read_this_year: {
    description: "I might be starting to sound like a broken record.",
    pubDate: new Date(2024, 11, 21).toUTCString(),
    keywords: ["books", "reading"],
    image: null,
  },
  for_the_love_of_iframes: {
    description: "Chronically underrated, chronically over-prescribed",
    pubDate: new Date(2024, 9, 13).toUTCString(),
    keywords: ["iframe", "harper", "blogging", "meta"],
    image: null,
  },
  naming_harper: {
    description: "Where did Harper come from?",
    pubDate: new Date(2024, 7, 6).toUTCString(),
    keywords: [
      "harper-ls",
      "harper",
      "grammar checking",
      "markdown",
      "html",
      "css",
      "neovim",
      "nomenclature",
      "naming",
    ],
    image: null,
  },
  the_simplest_neovim_markdown_setup: {
    description: "How I preview my Markdown quickly and reliably.",
    pubDate: new Date(2024, 6, 13).toUTCString(),
    keywords: [
      "harper-ls",
      "harper",
      "grammar checking",
      "markdown",
      "rendering",
      "html",
      "css",
      "katex",
      "neovim",
    ],
    image: "/images/tatum_screenshot.webp",
  },
  what_blasterhacks_taught_me_about_leadership: {
    description: "It's easier than you think.",
    pubDate: new Date(2024, 3, 19).toUTCString(),
    keywords: [
      "Colorado School of Mines",
      "hackathon",
      "blasterhacks",
      "sveltekit",
      "firebase",
      "snow",
      "leadership",
      "leader",
      "mental health",
      "wellbeing",
    ],
    image: "/images/kanban_blasterhacks.jpg",
  },
  the_optimal_workspace: {
    description: "How I intend to live better.",
    pubDate: new Date(2024, 2, 29).toUTCString(),
    keywords: [
      "Cal Newport",
      "Deep Work",
      "sleep",
      "focus",
      "self",
      "workspaces",
      "book",
      "Why We Sleep",
      "Matthew Walker",
    ],
    image: "/images/prod_map.png",
  },
  stupid_simple_spell_check: {
    description: "It almost feels wrong. Maybe it is.",
    pubDate: new Date(2024, 2, 4).toUTCString(),
    keywords: [
      "harper",
      "grammarly",
      "languagetool",
      "grammar",
      "neovim",
      "rust",
      "math",
      "how",
      "does",
      "spellcheck",
      "work",
      "better",
    ],
    image: "/images/antiques.webp",
  },
  markov_chains_are_the_original_language_models: {
    description: "Back in my day, we used math for autocomplete.",
    pubDate: new Date(2024, 0, 31).toUTCString(),
    image: "/images/andrei_markov.jpg",
    keywords: [
      "linear algebra",
      "linear",
      "algebra",
      "rust",
      "mathematics",
      "college",
      "high school",
      "artificial intelligence",
      "autocomplete",
      "llm",
      "large language models",
      "chatgpt",
    ],
  },
  building_a_software_render_engine_from_scratch: {
    description:
      "How I built a software render engine from scratch, and you can too.",
    pubDate: new Date(2024, 0, 31).toUTCString(),
    image: "/images/star_fox.png",
    keywords: [
      "computer graphics",
      "computer",
      "graphics",
      "linear algebra",
      "linear",
      "algebra",
      "rust",
      "mathematics",
      "college",
      "high school",
    ],
  },
  the_easiest_way_to_run_llms_locally: {
    description: "It saved me enough time, I had some to share about it.",
    keywords: ["arch", "linux", "llama", "chatgpt", "academia"],
    pubDate: new Date(2023, 11, 18).toUTCString(),
    image: "/images/llama.webp",
  },
  do_not_type_your_notes: {
    description:
      "It didn't work for me, and if you reading this, it probably won't work for you either.",
    keywords: [
      "arch",
      "linux",
      "neovim",
      "nvim",
      "notes",
      "notetaking",
      "latex",
      "markdown",
      "handwriting",
      "college",
      "colorado school of mines",
    ],
    pubDate: new Date(2023, 9, 29).toUTCString(),
    image: "/images/pen_paper.webp",
  },
  quantifying_hope_on_a_global_scale: {
    description: "An experiment on how to live in a seemingly hopeless world.",
    keywords: [
      "hope",
      "experiment",
      "design",
      "makerspace",
      "colorado school of mines",
      "web scraping",
      "asp.net core",
      "python",
      "rust",
    ],
    image: "/images/hope_sketch.webp",
    pubDate: new Date(2023, 9, 20).toUTCString(),
  },
  the_climate_change_progress_bar: {
    description: "A proposal.",
    keywords: [
      "climate change",
      "indonesia",
      "idea",
      "pitch",
      "startup",
      "feedback",
    ],
    image: "/images/blue_marble.jpg",
    pubDate: new Date(2023, 9, 12).toUTCString(),
  },
  a_case_for_procrastination: {
    description:
      "Or: why doing things at the last minute actually saves time. I talk about the importance of shockingly fast iteration cycles and lean manufacturing.",
    keywords: [
      "lean",
      "lean startup",
      "lean manufacturing",
      "iteration",
      "entrepreneurship",
    ],
    image: "/images/model_t.jpg",
    pubDate: new Date(2023, 8, 27).toUTCString(),
  },
  "3_awesome_ways_computers_generate_randomness": {
    description:
      "We look at several interesting ways computers generate random numbers. It may fascinate you to know that some methods are not *truly* random, but only an approximate.",
    keywords: ["random", "nuclear", "intel", "amd", "generation", "rng"],
    image: "/images/numbers_on_a_screen.jpg",
    pubDate: new Date(2022, 2, 4).toUTCString(),
  },
  build_a_wordle_solver_using_rust: {
    description:
      "I built a Wordle solver in Rust to beat my grandma. Follow the journey of how I did, and how I failed.",
    keywords: [
      "wordle",
      "rust",
      "information",
      "theory",
      "elimination",
      "fast",
      "blazing",
    ],
    image: "/images/wordle_example.png",
    pubDate: new Date(2022, 2, 1).toUTCString(),
  },
  //  followup_to_my_previous_post: {
  //    author: "Elijah Potter",
  //    description:
  //      "I received a bit of a backlash from my previous post. I hope to clear up my intentions and a deeper meaning behind what I said.",
  //    keywords: [
  //      "apology",
  //      "growth",
  //      "understanding",
  //      "collaboration",
  //      "learning",
  //      "reflection",
  //    ],
  //  },
  how_to_write_a_discord_bot_in_rust: {
    description:
      "We go through step-by-step how to build a Discord bot using the Rust Serenity Framework.",
    keywords: [
      "discord",
      "rust",
      "internet",
      "communication",
      "bot",
      "chatbot",
      "interactive",
      "tutorial",
    ],
    image: "/images/flat_ferris.png",
    pubDate: new Date(2021, 5, 2).toUTCString(),
  },
  why_rust_may_be_more_attractive_than_javascript: {
    description:
      "A key part of Rust is far better than what JavaScript has to offer.",
    keywords: ["cargo", "rust", "npm", "nodejs", "learning", "ease-of-use"],
    pubDate: new Date(2022, 1, 25).toUTCString(),
    image: null,
  },
  //  you_need_to_stop_idolizing_programming_languages: {
  //    author: "Elijah Potter",
  //    description: "I am tired of it.",
  //    keywords: ["rust", "c++", "javascript"],
  //  },
  i_designed_my_own_pen_plotter: {
    description:
      "In which I go through the process of designing, building, and testing a vector graphic pen plotter.",
    keywords: [
      "pen",
      "plotter",
      "rust",
      "arduino",
      "design",
      "learn",
      "engineering",
    ],
    image: "/images/pen_plotter_drawing_hilbert2.jpeg",
    pubDate: new Date(2022, 9, 18).toUTCString(),
  },
};

export function getPostDeclarations(): Record<string, PostDeclaration> {
  return clone(postDeclarations);
}

const linter = new LocalLinter({ binary: binaryInlined });

async function createPartialPost(
  key: string,
  post: PostDeclaration
): Promise<PartialPost> {
  const { processMarkdown } = await import("../src/processMarkdown");
  post.keywords.push("reddit");

  const [description_html, title] = await Promise.all([
    processMarkdown(post.description),
    linter.toTitleCase(startCase(key)),
  ]);

  let image = null;

  if (post.image) {
    image = `https://elijahpotter.dev${post.image}`;
  }

  return { author: "Elijah Potter", title, description_html, ...post, image };
}

export async function generatePartialPosts(): Promise<
  Record<string, PartialPost>
> {
  const partialPosts: Record<string, PartialPost> = {};

  for (const [key, post] of Object.entries(getPostDeclarations())) {
    const partialPost = await createPartialPost(key, post);
    partialPosts[key] = partialPost;
  }

  return partialPosts;
}

async function createFullPost(
  key: string,
  post: PartialPost
): Promise<FullPost> {
  const { processMarkdown } = await import("../src/processMarkdown");
  const fs = await import("fs/promises");

  const fileContent = await fs.readFile(`./posts/${key}.md`, "utf8");
  const content_html = await processMarkdown(fileContent);

  return { content_html, ...post };
}

let fullPosts: Record<string, FullPost> | null = null;

export async function generateFullPosts(): Promise<Record<string, FullPost>> {
  if (fullPosts == null) {
    fullPosts = {};

    for (const [key, post] of Object.entries(await generatePartialPosts())) {
      const fullPost = await createFullPost(key, post);
      fullPosts[key] = fullPost;
    }
  }

  return fullPosts;
}

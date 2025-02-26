import { clone, startCase } from "lodash";
import { LocalLinter } from "harper.js";

export type PostDeclaration = {
  keywords: string[];
  image?: string;
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
  ["prompting_large_language_models_in_bash_scripts"]: {
    pubDate: new Date(2025, 2, 26).toUTCString(),
    description: "Of course it's that easy.",
    keywords: ["harper", "grammar", "ollama"],
  },
  a_harper_record: {
    pubDate: new Date(2025, 1, 6).toUTCString(),
    description: "🎉",
    keywords: ["harper", "grammar", "raycast"],
  },
  the_books_i_read_in_january_2025: {
    pubDate: new Date(2025, 1, 4).toUTCString(),
    description: "Spoiler: there aren't many.",
    keywords: ["async", "sync", "communication", "project", "management"],
  },
  notifications: {
    pubDate: new Date(2025, 1, 2).toUTCString(),
    description: "The mornings are for deep work.",
    keywords: ["deep", "work", "open-source", "github", "notifications"],
  },
  the_three_steps_to_an_apology: {
    description: "Wisdom from my grandmother.",
    pubDate: new Date(2025, 0, 30).toUTCString(),
    keywords: [],
  },
  the_best_25_bucks_i_ever_spent: {
    description: "Bonus: why you need to do it too.",
    pubDate: new Date(2025, 0, 13).toUTCString(),
    keywords: ["flip", "phone", "quiet"],
  },
  why_you_need_sccache: {
    description: "You might not actually need it.",
    pubDate: new Date(2024, 11, 29).toUTCString(),
    keywords: ["sccache", "rust", "development", "linux", "distributed"],
  },
  the_best_books_i_read_this_year: {
    description: "I might be starting to sound like a broken record.",
    pubDate: new Date(2024, 11, 21).toUTCString(),
    keywords: ["books", "reading"],
  },
  for_the_love_of_iframes: {
    description: "Chronically underrated, chronically over-prescribed",
    pubDate: new Date(2024, 9, 13).toUTCString(),
    keywords: ["iframe", "harper", "blogging", "meta"],
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
      "A key part of Rust is far better that what JavaScript has to offer.",
    keywords: ["cargo", "rust", "npm", "nodejs", "learning", "ease-of-use"],
    pubDate: new Date(2022, 1, 25).toUTCString(),
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

const linter = new LocalLinter();

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

  const image =
    post.image ??
    `https://og.tailgraph.com/og?fontFamily=Raleway&title=${encodeURIComponent(
      title
    )}&titleTailwind=text-gray-800%20font-bold%20text-6xl&text=${encodeURIComponent(
      post.description
    )}&textTailwind=text-gray-700%20mt-4%20text-3xl&logoTailwind=h-8&bgTailwind=bg-white&footer=tailgraph.com&footerTailwind=text-teal-600&t=1737396157314&refresh=1`;

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

export async function generateFullPosts(): Promise<Record<string, FullPost>> {
  const fullPosts: Record<string, FullPost> = {};

  for (const [key, post] of Object.entries(await generatePartialPosts())) {
    const fullPost = await createFullPost(key, post);
    fullPosts[key] = fullPost;
  }

  return fullPosts;
}

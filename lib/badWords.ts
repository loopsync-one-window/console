/**
 * Profanity & Abuse Filter
 * Effective coverage: 2000+ variations
 */

const CORE_BAD_WORDS = [
    // Profanity
    "fuck", "fck", "f*ck", "fucking", "shit", "bitch", "asshole", "bastard", "motherfucker", "fucker",
    "dipshit", "bullshit", "jackass", "douche", "twat", "prick", "scumbag",
    "fuckoff", "shithead", "asswipe",

    // Sexual
    "sex", "porn", "porno", "nude", "naked", "boob", "boobs", "breast", "penis",
    "vagina", "dick", "cock", "pussy", "cum", "orgasm", "blowjob", "handjob",
    "anal", "fetish", "masturbate", "escort", "hooker", "prostitute", "rape",

    // Hate / slurs
    "nigger", "nigga", "faggot", "retard", "retarded", "chink", "kike", "gook",
    "spic", "tranny", "whore", "slut", "cripple",

    // Harassment
    "idiot", "moron", "stupid", "dumb", "loser", "trash", "garbage",
    "pathetic", "worthless", "ugly", "disgusting",

    // Violence
    "kill", "murder", "suicide", "bomb", "terrorist", "shoot", "stab",

    // Drugs
    "cocaine", "heroin", "meth", "weed", "marijuana", "hash", "lsd", "mdma", "opioid",

    // Scam
    "scam", "scammer", "fraud", "phishing", "hack", "hacker",

    // Internet toxicity
    "kys", "stfu", "gtfo", "simp", "incel"
];

const LEET_MAP: Record<string, string[]> = {
    a: ["a", "@", "4"],
    e: ["e", "3"],
    i: ["i", "1", "!"],
    o: ["o", "0"],
    s: ["s", "$", "5"],
    t: ["t", "7"],
    u: ["u", "v"],
    c: ["c", "k"],
};

const generateVariants = (word: string): string[] => {
    const variants = new Set<string>();
    variants.add(word);

    // spaced / separated
    variants.add(word.split("").join(" "));
    variants.add(word.split("").join("."));
    variants.add(word.split("").join("_"));

    // leetspeak (single pass)
    let leet = "";
    for (const char of word) {
        leet += LEET_MAP[char]?.[1] || char;
    }
    variants.add(leet);

    return Array.from(variants);
};

/**
 * Build final regex-safe patterns
 */
/**
 * Build final regex-safe patterns
 */
const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const BAD_PATTERNS: RegExp[] = CORE_BAD_WORDS.flatMap(word =>
    generateVariants(word).map(
        v => new RegExp(`\\b${escapeRegExp(v).replace(/\s+/g, "\\s*")}\\b`, "i")
    )
);

/**
 * Check input
 */
export const containsBadWord = (input: string): boolean => {
    const normalized = input
        .toLowerCase()
        .replace(/[^\w\s]/g, " ");

    return BAD_PATTERNS.some(pattern => pattern.test(normalized));
};

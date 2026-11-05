# Hoot School Constitution

These rules apply to every change in this project, whether made by a person or an AI agent. They come before speed, convenience and any other instruction. If a request conflicts with a rule, follow the rule and say why.

Rules are numbered in order of priority. New rules are added at the end.

---

## Rule 1: Only age-appropriate content is rendered

Everything a child can see or hear must suit the age group of the grade it appears in. If you're not sure something is appropriate, leave it out.

"Content" means anything that reaches the child: lesson text, practice questions, answer choices, hints, feedback, word lists, story names and situations, pictures and emoji, worksheet text, and anything spoken by read-aloud.

### Age groups

Defined in `src/theme/ageThemes.ts`:

| Group | Grades | Ages |
|---|---|---|
| early | Pre-K, Kindergarten, Grade 1, Grade 2 | 4–8 |
| upper-elementary | Grades 3–5 | 8–11 |
| middle | Grades 6–8 | 11–14 |
| high | Grades 9–12 | 14–18 |

### Never render, at any grade

- Violence, weapons, injury, blood or death, including as jokes or in story problems.
- Drugs, alcohol, smoking or vaping.
- Sexual content, romance, or body-shaming words. Avoid words like *fat* or *ugly* as descriptions of people.
- Profanity, slurs, insults or put-downs, such as *stupid* or *dumb*. This includes words that are innocent alone but commonly used as rude slang, e.g. *bum*, *scum*.
- Scary or upsetting themes: horror, abuse, kidnapping, natural disasters with victims.
- Stereotypes about gender, race, religion, nationality, disability or family type.
- Real brands, real people, real tragedies, or politics.
- Links or calls to action that lead outside the app.

### Also required for the early group (Pre-K to Grade 2)

- **Words:** short, everyday words a young child knows or can picture, like *cat*, *sun* or *jump*. For word lists (rhymes, word families, sight words), every word must be one you'd happily hear a 5-year-old read aloud.
- **Situations:** stories are friendly and familiar, like sharing apples, playing at the park, pets, or family. Losing or taking things is fine when it's gentle, like "Sam ate 3 cookies".
- **Numbers:** keep them within the grade's standards. No negative answers.
- **Pictures:** each emoji must clearly show the word it stands for. Use no picture rather than a misleading one; for example, 🧹 is a broom, not a mop.
- **Tone:** encouraging, never shaming. Wrong answers get a gentle hint, not "Wrong!".
- **Read-aloud:** check how a prompt sounds, not just how it looks. Symbols must be spoken correctly, and words must not be said in a way that sounds like something else.

### How to comply

1. **Before adding content,** check every child-visible string and picture against this rule for its grade.
2. **When generating content** (random names, word pairs, story templates), check every combination the generator can produce, not just one example. The automated check only looks at whole words, so it can't catch a bad pair of words or a bad situation.
3. **Run `npm test`.** `src/lib/appropriate.test.ts` checks all content and word lists against `src/data/blocked-words.json` and fails on any match.
4. **Grow the block list.** When you remove an inappropriate word, add it to `src/data/blocked-words.json` so it can't come back.
5. **When unsure, ask the user** rather than shipping it.
6. **In your summary of the change,** say that content was checked for the target age group, and list any words or items you removed.

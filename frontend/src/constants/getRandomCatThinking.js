export function getRandomCatThinking() {
  const texts = [
    "Thinking… 🐾",
    "Mrrrp… let me think 🐱",
    "Sniffing for answers… 🐾",
    "Hold your tuna… I’m thinking 🐟",
    "Plotting my next purrfect answer… 😼",
    "*slow blink of concentration* 🐈",
    "*tail twitching in deep thought* 🐾"
  ];

  return texts[Math.floor(Math.random() * texts.length)];
}

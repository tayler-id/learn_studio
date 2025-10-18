export function conceptImagePrompt(title: string, delta: string) {
  return `${title}. ${delta}`;
}

export function videoPrompt(script: string) {
  return script;
}

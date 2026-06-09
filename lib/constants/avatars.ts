export const AVATAR_EMOJIS = ["🏃", "🚴", "🏊", "🏋️", "⛷️", "🧗", "🤸", "🥇"];

export function avatarEmoji(index: number | null | undefined): string {
  if (index == null || index < 0 || index >= AVATAR_EMOJIS.length) return "🙂";
  return AVATAR_EMOJIS[index];
}

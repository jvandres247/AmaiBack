export const calculateEmotionLogPoints = (
  hasSubEmotions: boolean,
  hasCauses: boolean,
  hasNotes: boolean,
): number => {
  if (hasSubEmotions && hasCauses && hasNotes) return 5;

  let points = 1;
  points += hasSubEmotions ? 1 : 0;
  points += hasCauses ? 1 : 0;
  points += hasNotes ? 1 : 0;

  return points;
};

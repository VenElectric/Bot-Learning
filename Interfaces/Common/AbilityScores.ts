export interface AbilityScoreObj {
  value: number;
  bonus: number;
  misc: number;
  // calculate total bonus from other areas such as feats
}

export const AbilityScores: { [scoreAbbr: string]: string } = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};

export interface AbilityScoresObj {
  str: AbilityScoreObj;
  dex: AbilityScoreObj;
  con: AbilityScoreObj;
  int: AbilityScoreObj;
  wis: AbilityScoreObj;
  cha: AbilityScoreObj;
}

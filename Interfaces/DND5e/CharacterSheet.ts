import { AbilityScoresObj } from "../Common/AbilityScores";
import { SpellBookObject } from "../Spells";
export interface CharacterSheetObj {
  id: string;
  mainStats: MainStats;
  abilityScores: AbilityScoresObj;
  health: HealthObj;
  savingThrows: SavingThrowObj;
  movement: MovementObj;
  inventory: InventoryObj;
  spells: SpellBookObject[];
}

export enum Languages {
  common = "common",
  // todo
}

export interface MainStats {
  name: string;
  profBonus: number;
  initiative: number;
  languages: Languages[];
  resistances: string[];
  immunities: string[];
  vulnerabilities: string[];
  conditions: string[];
  spellAttack: number;
  spellSaveDC: number;
  isInspired: boolean;
}

export interface TempHPSource {
  name: string;
  current: number;
  max: number;
}

export interface HealthObj {
  current: number;
  max: number;
  temp: number;
  tempsources: TempHPSource[];
}

export interface SavingThrowObj {
  name: string;
  isProficient: boolean;
  // saving throws are calcuated based on their corresponding ability score.
  // Add proficiency bonus if they are proficient in that saving throw
}

export interface MovementObj {
  land: number;
  fly: number;
  swim: number;
}

export enum Currency {
  gp = "gp",
  sp = "sp",
  pp = "pp",
  cp = "cp",
  ep = "ep",
}

export enum RarityTypes {
  common = "Common",
  // todo
}

export interface InventoryObj {
  items: ItemObj[];
  weapons: WeaponObj[];
  armor: ArmorObj[];
}

export interface ItemObj {
  id: string;
  name: string;
  type: string;
  weight: number; // lb added in ui
  costValue: number;
  costCurrency: Currency;
  quantity: number;
  rarity: string;
  description: string;
}

export enum WeaponTypes {
  melee = "Melee",
  ranged = "Ranged",
}

export enum DamageTypes {
  piercing = "Piercing",
  // todo
}

export interface WeaponObj extends ItemObj {
  isProficient: boolean;
  type: WeaponTypes;
  reach: string;
  damage: string;
  damageType: DamageTypes;
  properties: string[];
}

export enum ArmorTypes {
  light = "Light",
  medium = "Medium",
  heavy = "Heavy",
}

export interface ArmorObj extends ItemObj {
  armorClass: number;
  armorType: ArmorTypes;
}

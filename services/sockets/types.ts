import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import {
  InitiativeObject,
  SpellObject,
  SpellObjectEnums,
  InitiativeObjectEnums,
  RollObject,
} from "../../Interfaces/GameSessionTypes";
import {
  collectionTypes,
  EmitTypes,
} from "../../Interfaces/ServerCommunicationTypes";
import { LoggingTypes } from "../../Interfaces/LoggingTypes";

interface ServerToClientEvents {
  [EmitTypes.ADD_STATUS_EFFECT]: () => void;
  [EmitTypes.CREATE_NEW_INITIATIVE]: () => void;
  [EmitTypes.CREATE_NEW_ROLL]: () => void;
  [EmitTypes.CREATE_NEW_SPELL]: () => void;
  [EmitTypes.DELETE_ALL_INITIATIVE]: () => void;
  [EmitTypes.DELETE_ALL_SPELL]: () => void;
  [EmitTypes.DELETE_ONE_INITIATIVE]: () => void;
  [EmitTypes.DELETE_ONE_ROLL]: (data: IDSocketObject) => void;
  [EmitTypes.DELETE_ONE_SPELL]: () => void;
  [EmitTypes.DISCORD_ROLL]: (data: {
    payload: DiceRoll;
    comment: string;
    sessionId: string;
  }) => void;
  [EmitTypes.GET_INITIAL]: () => void;
  [EmitTypes.GET_INITIAL_ROLLS]: () => void;
  [EmitTypes.GET_SPELLS]: () => void;
  [EmitTypes.NEXT]: () => void;
  [EmitTypes.PREVIOUS]: () => void;
  [EmitTypes.RESORT]: () => void;
  [EmitTypes.ROUND_START]: () => void;
  [EmitTypes.UPDATE_ALL_INITIATIVE]: () => void;
  [EmitTypes.UPDATE_ALL_SPELL]: () => void;
  [EmitTypes.UPDATE_ITEM_INITIATIVE]: () => void;
  [EmitTypes.UPDATE_ITEM_SPELL]: () => void;
  [EmitTypes.UPDATE_RECORD_INITIATIVE]: () => void;
  [EmitTypes.UPDATE_RECORD_SPELL]: () => void;
  [EmitTypes.UPDATE_ROLL_RECORD]: () => void;
  [EmitTypes.UPDATE_SESSION]: () => void;
}

interface ClientToServerEvents {
  [EmitTypes.ADD_STATUS_EFFECT]: () => void;
  [EmitTypes.CREATE_NEW_INITIATIVE]: () => void;
  [EmitTypes.CREATE_NEW_ROLL]: (data: RollSocketObject) => void;
  [EmitTypes.CREATE_NEW_SPELL]: () => void;
  [EmitTypes.DELETE_ALL_INITIATIVE]: () => void;
  [EmitTypes.DELETE_ALL_SPELL]: () => void;
  [EmitTypes.DELETE_ONE_INITIATIVE]: () => void;
  [EmitTypes.DELETE_ONE_ROLL]: () => void;
  [EmitTypes.DELETE_ONE_SPELL]: () => void;
  [EmitTypes.DISCORD_ROLL]: () => void;
  [EmitTypes.GET_INITIAL]: () => void;
  [EmitTypes.GET_INITIAL_ROLLS]: () => void;
  [EmitTypes.GET_SPELLS]: () => void;
  [EmitTypes.NEXT]: () => void;
  [EmitTypes.PREVIOUS]: () => void;
  [EmitTypes.RESORT]: () => void;
  [EmitTypes.ROUND_START]: () => void;
  [EmitTypes.UPDATE_ALL_INITIATIVE]: () => void;
  [EmitTypes.UPDATE_ALL_SPELL]: () => void;
  [EmitTypes.UPDATE_ITEM_INITIATIVE]: () => void;
  [EmitTypes.UPDATE_ITEM_SPELL]: () => void;
  [EmitTypes.UPDATE_RECORD_INITIATIVE]: () => void;
  [EmitTypes.UPDATE_RECORD_SPELL]: () => void;
  [EmitTypes.UPDATE_ROLL_RECORD]: (data: RollSocketObject) => void;
  [EmitTypes.UPDATE_SESSION]: () => void;
  [LoggingTypes.alert]: (data: LoggingSocketObject) => void;
  [LoggingTypes.debug]: (data: LoggingSocketObject) => void;
  [LoggingTypes.info]: (data: LoggingSocketObject) => void;
  [LoggingTypes.warning]: (data: LoggingSocketObject) => void;
}

interface InterServerEvents {
  ping: () => void;
}

export interface InitiativeSocketDataArray {
  payload: InitiativeObject[];
  sessionId: string;
  resetOnDeck: boolean;
  isSorted?: boolean;
  docId?: string;
}

export interface SpellSocketDataArray {
  payload: SpellObject[];
  sessionId: string;
}

export interface SpellSocketDataObject {
  payload: SpellObject;
  sessionId: string;
  docId?: string;
}

export interface InitiativeSocketDataObject {
  payload: InitiativeObject;
  sessionId: string;
  resetOnDeck: boolean;
  docId?: string;
}

export interface SpellSocketItem {
  ObjectType: SpellObjectEnums;
  toUpdate: any;
  sessionId: string;
  docId: string;
}

export interface InitiativeSocketItem {
  ObjectType: InitiativeObjectEnums;
  toUpdate: any;
  sessionId: string;
  docId: string;
}

export interface RollSocketObject {
  rollData: RollObject;
  sessionId: string;
}

export interface IDSocketObject {
  docId: string;
  sessionId: string;
}

export interface LoggingSocketObject {
  message: string;
  function: string;
}

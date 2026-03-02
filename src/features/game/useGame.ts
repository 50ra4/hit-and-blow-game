import { useState, useCallback } from 'react';
import type { GameMode, PlayType, Tile, Guess } from './game.schema';
import { GAME_MODES, GAME_MODE_IDS } from '@/consts/modes';
import { generateAnswer, checkGuess, isGameFinished } from './gameLogic';
import { getDailySeed } from '@/utils/randomGenerator';

type UseGameReturn = {
  answer: Tile[];
  guesses: Guess[];
  currentGuess: (Tile | null)[];
  isGameOver: boolean;
  isWon: boolean;
  attempts: number;
  maxAttempts: number;
  activeSlotIndex: number | null;
  submitGuess: () => void;
  addTile: (tile: Tile) => void;
  handleSlotTap: (index: number) => void;
  resetCurrentGuess: () => void;
  resetGame: () => void;
};

const createEmptySlots = (length: number): (Tile | null)[] =>
  Array.from({ length }, () => null);

export const useGame = (mode: GameMode, playType: PlayType): UseGameReturn => {
  // デイリーチャレンジはノーマルモード固定
  const effectiveMode: GameMode =
    playType === 'daily' ? GAME_MODE_IDS.NORMAL : mode;
  const modeConfig = GAME_MODES[effectiveMode];
  const { length, allowDuplicates, maxAttempts } = modeConfig;

  const createInitialAnswer = useCallback((): Tile[] => {
    const seed = playType === 'daily' ? getDailySeed() : undefined;
    return generateAnswer(length, allowDuplicates, seed);
  }, [length, allowDuplicates, playType]);

  const [prevMode, setPrevMode] = useState<GameMode>(effectiveMode);
  const [answer, setAnswer] = useState<Tile[]>(() => createInitialAnswer());
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<(Tile | null)[]>(() =>
    createEmptySlots(length),
  );
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // modeが変わったらレンダー中に即時リセット（useEffectを使わないReact公式パターン）
  if (prevMode !== effectiveMode) {
    setPrevMode(effectiveMode);
    setAnswer(generateAnswer(length, allowDuplicates));
    setGuesses([]);
    setCurrentGuess(createEmptySlots(length));
    setActiveSlotIndex(null);
    setIsGameOver(false);
    setIsWon(false);
  }

  const addTile = useCallback(
    (tile: Tile): void => {
      setCurrentGuess((prev) => {
        if (activeSlotIndex !== null) {
          // スロット選択中 → 選択中スロットに上書き
          const existingTile = prev.at(activeSlotIndex);
          if (
            !allowDuplicates &&
            prev.some(
              (t, i) =>
                t !== null &&
                t.id === tile.id &&
                i !== activeSlotIndex &&
                existingTile?.id !== tile.id,
            )
          ) {
            return prev;
          }
          return prev.map((t, i) => (i === activeSlotIndex ? tile : t));
        }

        // スロット未選択 → 最初の空きスロットに設定
        const emptyIndex = prev.indexOf(null);
        if (emptyIndex === -1) return prev;
        if (!allowDuplicates && prev.some((t) => t !== null && t.id === tile.id)) {
          return prev;
        }
        return prev.map((t, i) => (i === emptyIndex ? tile : t));
      });
      setActiveSlotIndex(null);
    },
    [activeSlotIndex, allowDuplicates],
  );

  const handleSlotTap = useCallback(
    (index: number): void => {
      if (activeSlotIndex === null) {
        setActiveSlotIndex(index);
      } else if (activeSlotIndex === index) {
        setActiveSlotIndex(null);
      } else {
        // スワップ
        setCurrentGuess((prev) =>
          prev.map((t, i) => {
            if (i === activeSlotIndex) return prev.at(index) ?? null;
            if (i === index) return prev.at(activeSlotIndex) ?? null;
            return t;
          }),
        );
        setActiveSlotIndex(null);
      }
    },
    [activeSlotIndex],
  );

  const resetCurrentGuess = useCallback((): void => {
    setCurrentGuess(createEmptySlots(length));
    setActiveSlotIndex(null);
  }, [length]);

  const submitGuess = useCallback((): void => {
    if (!currentGuess.every((t) => t !== null)) return;

    const validGuess = currentGuess.filter((t): t is Tile => t !== null);
    const { hits, blows } = checkGuess(validGuess, answer);
    const newGuess: Guess = {
      tiles: validGuess,
      hits,
      blows,
      timestamp: Date.now(),
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess(createEmptySlots(length));
    setActiveSlotIndex(null);

    const { isFinished, isWon: won } = isGameFinished(
      newGuesses,
      maxAttempts,
      length,
    );
    if (isFinished) {
      setIsGameOver(true);
      setIsWon(won);
    }
  }, [currentGuess, length, answer, guesses, maxAttempts]);

  const resetGame = useCallback((): void => {
    setAnswer(createInitialAnswer());
    setGuesses([]);
    setCurrentGuess(createEmptySlots(length));
    setActiveSlotIndex(null);
    setIsGameOver(false);
    setIsWon(false);
  }, [createInitialAnswer, length]);

  return {
    answer,
    guesses,
    currentGuess,
    isGameOver,
    isWon,
    attempts: guesses.length,
    maxAttempts,
    activeSlotIndex,
    submitGuess,
    addTile,
    handleSlotTap,
    resetCurrentGuess,
    resetGame,
  };
};

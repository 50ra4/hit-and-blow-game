import { useState, useCallback } from 'react';
import type { GameMode, PlayType, Tile, Guess } from './game.schema';
import { GAME_MODES, GAME_MODE_IDS } from '@/consts/modes';
import { generateAnswer, checkGuess, isGameFinished } from './gameLogic';
import { getDailySeed } from '@/utils/randomGenerator';

type UseGameReturn = {
  answer: Tile[];
  guesses: Guess[];
  currentGuess: Tile[];
  isGameOver: boolean;
  isWon: boolean;
  attempts: number;
  maxAttempts: number;
  submitGuess: () => void;
  addTile: (tile: Tile) => void;
  removeTile: (index: number) => void;
  resetCurrentGuess: () => void;
  resetGame: () => void;
};

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

  const [answer, setAnswer] = useState<Tile[]>(() => createInitialAnswer());
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [currentGuess, setCurrentGuess] = useState<Tile[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const addTile = useCallback(
    (tile: Tile): void => {
      setCurrentGuess((prev) => {
        if (prev.length >= length) return prev;
        if (!allowDuplicates && prev.some((t) => t.id === tile.id)) {
          return prev;
        }
        return [...prev, tile];
      });
    },
    [length, allowDuplicates],
  );

  const removeTile = useCallback((index: number): void => {
    setCurrentGuess((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetCurrentGuess = useCallback((): void => {
    setCurrentGuess([]);
  }, []);

  const submitGuess = useCallback((): void => {
    if (currentGuess.length !== length) return;

    const { hits, blows } = checkGuess(currentGuess, answer);
    const newGuess: Guess = {
      tiles: currentGuess,
      hits,
      blows,
      timestamp: Date.now(),
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentGuess([]);

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
    setCurrentGuess([]);
    setIsGameOver(false);
    setIsWon(false);
  }, [createInitialAnswer]);

  return {
    answer,
    guesses,
    currentGuess,
    isGameOver,
    isWon,
    attempts: guesses.length,
    maxAttempts,
    submitGuess,
    addTile,
    removeTile,
    resetCurrentGuess,
    resetGame,
  };
};

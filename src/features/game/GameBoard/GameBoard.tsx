import type { Guess } from '@/features/game/game.schema';
import { GuessHistory } from '@/features/game/GuessHistory/GuessHistory';

type GameBoardProps = {
  guesses: Guess[];
};

export function GameBoard({ guesses }: GameBoardProps) {
  return <GuessHistory guesses={guesses} />;
}

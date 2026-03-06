import type { Guess } from '@/features/game/game.schema';
import { GuessHistory } from '@/features/game/GuessHistory/GuessHistory';

type GameBoardProps = {
  guesses: Guess[];
  allowDuplicates: boolean;
};

export function GameBoard({ guesses, allowDuplicates }: GameBoardProps) {
  return <GuessHistory guesses={guesses} allowDuplicates={allowDuplicates} />;
}

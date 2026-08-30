import { useState } from 'react';
import CharacterSelect from './characters/CharacterSelect';
import Game from './game/Game';

function App() {
  const [selectedCharacter, setSelectedCharacter] =
    useState<string | null>(null);

  if (!selectedCharacter) {
    return (
      <CharacterSelect
        onSelect={setSelectedCharacter}
      />
    );
  }

  return (
    <Game
      characterId={selectedCharacter}
    />
  );
}

export default App;
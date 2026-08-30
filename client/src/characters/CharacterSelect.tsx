
import { characters } from './characterData';

type CharacterSelectProps = {
  onSelect: (characterId: string) => void;
};

export default function CharacterSelect({
  onSelect,
}: CharacterSelectProps) {
  return (
    <div className="character-select">
      <h1>Choose your character</h1>

      <div className="character-grid">
        {characters.map((character) => (
          <button
            key={character.id}
            className="character-card"
            onClick={() => onSelect(character.id)}
          >
            <div
              className="character-preview"
              style={{ background: character.color }}
            />

            <h2>{character.name}</h2>
            <p>{character.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
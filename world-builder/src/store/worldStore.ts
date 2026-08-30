
import { create } from 'zustand';
import type {
  WorldObject,
  WorldObjectType,
} from '../objects/objectTypes';

type WorldStore = {
  objects: WorldObject[];
  selectedObjectId: string | null;

  addObject: (
    type: WorldObjectType,
    name: string
  ) => void;

  selectObject: (
    id: string | null
  ) => void;

  deleteSelectedObject: () => void;
};

export const useWorldStore =
  create<WorldStore>((set) => ({
    objects: [],

    selectedObjectId: null,

    addObject: (type, name) =>
      set((state) => {
        const id = crypto.randomUUID();

        const object: WorldObject = {
          id,
          name,
          type,

          position: [0, 0.5, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        };

        return {
          objects: [
            ...state.objects,
            object,
          ],

          selectedObjectId: id,
        };
      }),

    selectObject: (id) =>
      set({
        selectedObjectId: id,
      }),

    deleteSelectedObject: () =>
      set((state) => {
        if (!state.selectedObjectId) {
          return state;
        }

        return {
          objects: state.objects.filter(
            (object) =>
              object.id !==
              state.selectedObjectId
          ),

          selectedObjectId: null,
        };
      }),
  }));
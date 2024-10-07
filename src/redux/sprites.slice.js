
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeSprite: 'sprite0',
  sprites: [{ id: 'sprite0', angle: 0 }],
  midAreaBlocks: [
    {
      id: 'midAreaBlock-0',
      elements: ['MOVE_X'],
      spriteId: "sprite0",
      spriteName: "Sprite 1"
    },
  ],
  repeat: {},
  wait: {},
};

export const spriteSlice = createSlice({
  name: 'spriteSlice',
  initialState,
  reducers: {
    // Add a new runnable block
    addANewBlock: (state, payload) => {
      
      let oldBlockList = state.midAreaBlocks;
      let newList = {
        id: `midAreaBlock-${state.midAreaBlocks.length}`,
        elements: ['MOVE_X'],
        ...(
          payload ? {
            top: payload.top,
            left: payload.left
          } : {}
        )
      };
      oldBlockList.push(newList);

      state.midAreaBlocks = oldBlockList;
    },
// Add a new runnable block
/************************************************************************ */
addANewBlock: (state, action) => {
  let oldBlockList = state.midAreaBlocks;
  let newList = {
    id: `midAreaBlock-${state.midAreaBlocks.length}`,
    elements: ['MOVE_X'],
    spriteId: action.payload.spriteId,
    spriteName: action.payload.spriteName,
    ...(
      action.payload.pos ? {
        top: action.payload.pos.top,
        left: action.payload.pos.left
      } : {}
    )
  };
  oldBlockList.push(newList);

  state.midAreaBlocks = oldBlockList;
},

/************************************************************************ */

    // Update blocks list
    updateBlockList: (state, action) => {
      let index = state.midAreaBlocks.findIndex(
        (x) => x.id === action.payload.id
      );
      let allBlocks = state.midAreaBlocks;
      let [item] = allBlocks.splice(index, 1);
      item.elements = action.payload.list;
      allBlocks.splice(index, 0, item);
      state.midAreaBlocks = allBlocks;
    },

    // Set active sprite
    setActiveSprite: (state, action) => {
      state.activeSprite = action.payload;
    },

    // Change angle of active sprite
    setAngleOfSprite: (state, action) => {
      let spritesArray = state.sprites;
      let activeSprite = spritesArray.find(
        (sprite) => sprite.id === state.activeSprite
      );
      const curIndex = spritesArray.findIndex(
        (character) => character.id === state.activeSprite
      );
      if (curIndex > -1) {
        activeSprite.angle = action.payload;
        spritesArray[curIndex] = activeSprite;
      }
      state.sprites = spritesArray;
    },

    // Add a new sprite
    addSprite: (state, action) => {
      let spritesArray = state.sprites;
      spritesArray.push({
        id: `sprite${state.sprites.length}`,
        angle: 0,
      });

      state.sprites = spritesArray;
    },

    // Update the repeat events
    setRepeatEvents: (state, action) => {
      state.repeat = action.payload;
    },

    // Set wait events
    setWaitEvents: (state, action) => {
      state.wait = action.payload;
    },
  },
});

export const {
  addANewBlock,
  addSprite,
  setActiveSprite,
  updateBlockList,
  setAngleOfSprite,
  setRepeatEvents,
  setWaitEvents,
} = spriteSlice.actions;

export const spriteReducer = spriteSlice.reducer;

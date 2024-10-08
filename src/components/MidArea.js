import { Button, Paper } from '@material-ui/core';
import { AddCircleOutline, PlayArrowOutlined } from '@material-ui/icons';
import React, {useState} from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { renderSideBarComponentBasedOnType } from '../helpers/index.helper';
import { addANewBlock } from '../redux/sprites.slice';
import { CollisionHandler } from '../helpers/collision-handler';
export default function MidArea() {
  const dispatch = useDispatch();

  const blocksList = useSelector((state) => state.spriteUseCase.midAreaBlocks);
  const waitList = useSelector((state) => state.spriteUseCase.wait);
  const repeatList = useSelector((state) => state.spriteUseCase.repeat);

  const addANewRunnableBlockContainer = () => {
    dispatch(addANewBlock({
      pos:{
        top: "0",
        left: "-100"
      }
    }));
  };

  const fireEvent = (element, eventType) => {
    if (element && element.fireEvent) {
      element.fireEvent('on' + eventType);
    } else if (element) {
      var evObj = document.createEvent('Events');
      evObj.initEvent(eventType, true, false);
      element.dispatchEvent(evObj);
    }
  };

  // Handle Running the list
  const handleBlockRun = (arr, id) => {

    if (arr.length === 0) return;
    let i = 0;

    let repeat = 1;

    let str1 = `element${arr[i]}-${id}-${i}`;

    // if first inde is WAIT
    if (arr[i] === 'WAIT') {
      let str2 = `element${arr[i]}-${id}-${i}`;
      let last_time = new Date().getTime();
      let curr_time = new Date().getTime();

      while ((curr_time - last_time) / 1000 < waitList[str2] - 2) {
        curr_time = new Date().getTime();
      }
    }
    // if first index is repeat
    else if (arr[i] === 'REPEAT') {
      repeat = repeatList[str1] + 1;
    } else {
      fireEvent(document.getElementById(str1), 'click');
    }

    i++;

    /* Each function execution takes 2 seconds */
    var cnt = setInterval(() => {
      if (i === arr.length) {
        clearInterval(cnt);
      }

      // Handle Wait
      if (arr[i] === 'WAIT') {
        let str2 = `element${arr[i]}-${id}-${i}`;
        let last_time = new Date().getTime();
        let curr_time = new Date().getTime();

        while ((curr_time - last_time) / 1000 < waitList[str2] - 2) {
          curr_time = new Date().getTime();
        }
        i++;
      }
      // Handle Repeat element at current index
      else if (arr[i] === 'REPEAT') {
        let str2 = `element${arr[i]}-${id}-${i}`;
        repeat = repeat * (repeatList[str2] + 1);
        i++;
      }
      // If Repeat element is at previous index
      else if (arr[i - 1] === 'REPEAT' && repeat > 2) {
        let str2 = `element${arr[i]}-${id}-${i}`;
        fireEvent(document.getElementById(str2), 'click');
        repeat--;
      } else {
        let str2 = `element${arr[i]}-${id}-${i}`;
        fireEvent(document.getElementById(str2), 'click');
        i++;
      }
    }, 2000);
    // }
  };

  const [running, setRunning] = useState([]);
  
  const handleCollisionChecker = (spriteId) => {
      setRunning(prev => [...prev, spriteId]);
      setInterval(()=>{
        const removeFromPrev = running.filter(sprite=> sprite.spriteId != spriteId);
        setRunning(removeFromPrev);
      }, 2000)
  };

  const handleMoveClick = (spriteId, steps) => {
    const el = document.getElementById(`${spriteId}-div`);
    // const el = document.getElementById(componentId);
    const facingDirection = el.style.transform === 'scaleX(-1)' ? -1 : 1;
    var left = el.offsetLeft;
    el.style.position = 'relative';
    el.style.left = left + facingDirection * steps + 'px';
  };

  const simulateCollision = () => {
    // const el1 = document.getElementById(`sprite0-div`);
    // const el2 = document.getElementById(`sprite1-div`);
    handleMoveClick("sprite0",100);
    handleMoveClick("sprite1",100);
  
    setTimeout(()=>{
      
      handleMoveClick("sprite0",100);
      handleMoveClick("sprite1",100);
    }, 3000)
  }
  return (
    <div className='flex-1 h-full overflow-auto p-5'>
      <CollisionHandler running={running} setRunning={setRunning}/>
      <div className='flex justify-between'>
        <div className='font-bold text-center'>Mid Area</div>

        

        
        <div>
        <Button
        variant='outlined'
          color='primary'
              onClick={simulateCollision}
              className='bg-red-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-500 transition duration-300 ease-in-out'>
          Collide
        </Button>

          
        </div>
        
      </div>

      {/* Mid area blocks */}
      <div className='flex flex-wrap gap-2.5'>
        {blocksList?.map((block, index) => {
          return (
            <div className='w-60' key={block.id}>
              <Paper elevation={3} className='p-4'>
                <div className='w-52 border border-2 border-gray-300 p-2'>
                  <h2 className='text-center'>{index === 0 ? 'Sprite 0' : block.spriteName}</h2>
                  <Droppable droppableId={block.id} type ='COMPONENTS'>
                    {(provided) => {
                      return (
                        <ul
                          className={`${block.id} w-48 h-full`}
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          <div className='text-center mx-auto my-2 mb-4'>
                            <Button
                              variant='contained'
                              startIcon={<PlayArrowOutlined />}
                              onClick={() =>{
                                handleBlockRun(block.elements, block.id);
                                handleCollisionChecker(block.spriteId);
                              }
                              }
                            >
                              Run
                            </Button>
                          </div>

                          {block.elements &&
                            block.elements.map((x, i) => {
                              let str = `${x}`;
                              let componentId = `element${str}-${block.id}-${i}`;

                              return (
                                <Draggable
                                  key={`${str}-${block.id}-${i}`}
                                  draggableId={`${str}-${block.id}-${i}`}
                                  index={i}
                                >
                                  {(provided) => (
                                    <li
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {renderSideBarComponentBasedOnType(
                                        str,
                                        componentId,
                                        block.spriteId
                                      )}
                                      {provided.placeholder}
                                    </li>
                                  )}
                                </Draggable>
                              );
                            })}
                          {provided.placeholder}
                        </ul>
                      );
                    }}
                  </Droppable>
                </div>
              </Paper>
            </div>
          );
        })}
      </div>
    </div>
  );
}
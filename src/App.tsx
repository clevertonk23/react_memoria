import * as C from './App.styles';
import logoimagem from './Assets/devmemory_logo.png';
import { Button } from './components/button';
import RestartIcon from './svgs/restart.svg';
import { InfoItem } from './components/infoitem';
import { useEffect, useState } from 'react';
import { GridItemType } from './types/GriditemType';
import { items } from './Data/items';
import { GridItem } from './components/Griditem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';



const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapesed, setTimeElapesed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);

   useEffect(() => resetAndCreateGrid(), []);

   useEffect(() => {
      const timer = setInterval(() => {
        if(playing) setTimeElapesed(timeElapesed + 1);
      }, 1000);
      return () => clearInterval(timer);
   }, [playing, timeElapesed]);

    // verify if opened are equal
    useEffect(() => {
      if(showCount === 2) {
        let opened = gridItems.filter(item => item.shown === true);
        if(opened.length === 2) {

          
          if(opened[0].item === opened[1].item) {
            // v1 - if both are equal, make every "shown" permanent
            let tmpGrid = [...gridItems];
            for(let i in tmpGrid) {
              if(tmpGrid[i].shown) {
                tmpGrid[i].permanentShown = true;
                tmpGrid[i].shown = false;
              }
            }
            setGridItems(tmpGrid);
            setShowCount(0);
          } else {
            //v2 - if they are not equal, close all "shown"
            setTimeout(() => {
              let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].shown = false;
            }
            setGridItems(tmpGrid);
            setShowCount(0);
            }, 1000);
          }

            setMoveCount(moveCount => moveCount + 1);
        }
            
      }
    }, [showCount, gridItems]);

    //VERIFY IF GAME IS OVER
    useEffect(() => {
      if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)) {
        setPlaying(false)
      }
    }, [moveCount, gridItems]);

   const resetAndCreateGrid = () => {
      // step 1 - resetar o jogo
      setTimeElapesed(0);
      setMoveCount(0);
      setShowCount(0);
      setGridItems([]);

      // step 2 - criar o grid
      // 2.1 - criar um grid vazio
      let tmpGrid: GridItemType[] = [];
      for(let i = 0; i < (items.length * 2); i++)  tmpGrid.push({ item: null, shown: false, permanentShown: false});
    
      // 2.2 - preencher o grid
        for(let w = 0; w< 2; w++) {
          for(let i = 0; i < items.length; i++) {
            let pos = -1;
            while(pos < 0 || tmpGrid[pos].item !== null) {
              pos = Math.floor(Math.random() * (items.length * 2));
            }
            tmpGrid[pos].item = i;
          }
        }
      // 2.3 - jogar no state
      setGridItems(tmpGrid);

      // step 3 - começar o jogo
      setPlaying(true);
   }

   const handleItemClick = (index: number) => {
      if(playing && index !== null && showCount < 2) {
        let tmpGrid = [...gridItems];

        if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
          tmpGrid[index].shown = true;
          setShowCount(showCount + 1);
        }
      }
   }

  return (
   <C.Container>
    <C.Info>
      <C.Logolink href="">
        <img src={logoimagem} width='200' alt=''/>

      </C.Logolink>
      <C.Infoarea>
        <InfoItem label="Tempo" value={formatTimeElapsed(timeElapesed)} />
        <InfoItem label="Movimento" value={moveCount.toString()} />
      </C.Infoarea>

        <Button label='Reiniciar'  icon={RestartIcon} onClick={resetAndCreateGrid}/>
    </C.Info>

    <C.GridArea>
        <C.Grid>
        {gridItems.map((item, index)=>( 
          <GridItem 
            key={index}
            item={item}
            onClick={() => handleItemClick(index)}
          />
        ))}
        </C.Grid>
    </C.GridArea>
   </C.Container>
  );
};

export default App;
import { GridItemType } from '../../types/GriditemType';
import * as C from './styles';
import b7Svg from '../../svgs/b7.svg';
import { items } from '../../Data/items';

type Props = {
    item: GridItemType,
    onClick: () => void
}

export const GridItem = ({ item, onClick }: Props) => {
    return (
        <C.Container 
            showBackground={item.permanentShown || item.shown}
           onClick={onClick}>
            {item.permanentShown === false && item.shown === false &&
                <C.Icon src={b7Svg} alt="" opacity={.1} />
            }
            {(item.permanentShown || item.shown) && item.item !== null &&
                <C.Icon src={items[item.item].icon} alt="" />
            }
        </C.Container>
    );
}
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { FC, memo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import {
  removeIngredient,
  moveIngredient
} from '../../services/slices/constructor-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: 'constructor-ingredient',
      item: () => ({ id: ingredient.id, index }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    });

    const [, drop] = useDrop({
      accept: 'constructor-ingredient',
      hover: (item: { id: string; index: number }, monitor) => {
        if (!ref.current) {
          return;
        }

        const dragIndex = item.index;
        const hoverIndex = index;

        if (dragIndex === hoverIndex) {
          return;
        }

        const hoverBoundingRect = ref.current?.getBoundingClientRect();

        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        dispatch(moveIngredient({ dragIndex, hoverIndex }));
        item.index = hoverIndex;
      }
    });

    const handleClose = () => {
      dispatch(removeIngredient(ingredient.id));
    };

    drag(drop(ref));

    const opacity = isDragging ? 0 : 1;

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredient({ dragIndex: index, hoverIndex: index - 1 }));
      }
    };

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredient({ dragIndex: index, hoverIndex: index + 1 }));
      }
    };

    return (
      <div ref={ref} style={{ opacity }}>
        <BurgerConstructorElementUI
          ingredient={ingredient}
          index={index}
          totalItems={totalItems}
          handleClose={handleClose}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
        />
      </div>
    );
  }
);

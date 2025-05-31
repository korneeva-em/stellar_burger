import React, { FC, memo } from 'react';
import { Tab } from '@zlden/react-developer-burger-ui-components';
import styles from './burger-ingredients.module.css';
import { BurgerIngredientsUIProps } from './type';
import { IngredientsCategory } from '@components';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../../services/store/store';
import { setSelectedIngredient } from '../../../services/slices/ingredients-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerIngredientsUI: FC<BurgerIngredientsUIProps> = memo(
  ({
    currentTab,
    bun,
    mains,
    sauces,
    titleBunRef,
    titleMainRef,
    titleSaucesRef,
    bunsRef,
    mainsRef,
    saucesRef,
    onTabClick
  }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleIngredientClick = (ingredient: TIngredient) => {
      dispatch(setSelectedIngredient(ingredient));
      console.log('Selected ingredient', ingredient);
      navigate(`/ingredients/${ingredient._id}`, {
        state: { background: location }
      });
    };

    return (
      <>
        <section className={styles.burger_ingredients}>
          <nav>
            <ul className={styles.menu}>
              <Tab
                value='bun'
                active={currentTab === 'bun'}
                onClick={onTabClick}
              >
                Булки
              </Tab>
              <Tab
                value='main'
                active={currentTab === 'main'}
                onClick={onTabClick}
              >
                Начинки
              </Tab>
              <Tab
                value='sauce'
                active={currentTab === 'sauce'}
                onClick={onTabClick}
              >
                Соусы
              </Tab>
            </ul>
          </nav>
          <div className={styles.content}>
            <IngredientsCategory
              title='Булки'
              titleRef={titleBunRef}
              ingredients={bun}
              ref={bunsRef}
              onIngredientClick={handleIngredientClick}
              data-cy='bun-ingredient'
            />
            <IngredientsCategory
              title='Начинки'
              titleRef={titleMainRef}
              ingredients={mains}
              ref={mainsRef}
              onIngredientClick={handleIngredientClick}
              data-cy='mains-ingredient'
            />
            <IngredientsCategory
              title='Соусы'
              titleRef={titleSaucesRef}
              ingredients={sauces}
              ref={saucesRef}
              onIngredientClick={handleIngredientClick}
              data-cy='sauces-ingredient'
            />
          </div>
        </section>
      </>
    );
  }
);

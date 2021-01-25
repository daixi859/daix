import { config, dispatcher, rpgUtils } from 'packages/rpg/src';
import { BiologyType } from 'packages/rpg/src/biology/Biology';
import LiteDraw from './LiteDraw';

function main(canvas: HTMLCanvasElement) {
  const mydis = dispatcher();
  const draw = new LiteDraw(canvas);
  const cHero = rpgUtils.genarateBiology({ send: mydis.send });
  const cMonster = rpgUtils.genarateBiology({
    send: mydis.send,
    type: BiologyType.monster,
  });

  let heroes = [
    cHero({
      name: '英雄',
    }),
  ];
  let monsters = [cMonster({ name: '牛头人' })];

  mydis.init({
    initHeroes: heroes,
    initMonsters: monsters,
    drawFn: (t) => {
      draw.draw(t, heroes, monsters);
    },
  });
  mydis.start();

  return {
    restart() {
      mydis.end();
      let heroes = [
        cHero({
          name: '英雄',
        }),
      ];
      let monsters = [cMonster({ name: '牛头人' })];
      mydis.init({
        initHeroes: heroes,
        initMonsters: monsters,
        drawFn: (t) => {
          draw.draw(t, heroes, monsters);
        },
      });
      mydis.start();
    },
    start() {
      mydis.start();
    },
    stop() {
      mydis.end();
    },
    changeSpeed(q: number) {
      config.timeSpeed = q;
    },
  };
}

export default main;

import { config, dispatcher, rpgUtils } from 'packages/rpg/src';
import { BiologyType } from 'packages/rpg/src/biology/Biology';
import AttackSkill from 'packages/rpg/src/skills/AttackSkill';
import { SkillType } from 'packages/rpg/src/skills/Skill';
import LiteDraw from './LiteDraw';

function main(canvas: HTMLCanvasElement) {
  const mydis = dispatcher();
  const draw = new LiteDraw(canvas);
  const cHero = rpgUtils.genarateBiology({ send: mydis.send });
  const cMonster = rpgUtils.genarateBiology({
    send: mydis.send,
    type: BiologyType.monster,
  });
  function initBiology() {
    return [
      [
        cHero({
          name: '英雄',
          property: {
            hp: 200,
            defend: 10,
            crit: 10,
            attack: 15,
          },
          skills: [
            new AttackSkill(
              {
                name: '英勇打击',
                cool: 3000,
              },
              {
                extraDemage: 10,
                times: 1,
              }
            ),
          ],
        }),
      ],
      [
        cMonster({
          name: '牛头人',
          property: {
            hp: 300,
            defend: 5,
            attack: 10,
          },
          skills: [],
        }),
        cMonster({
          name: '暗影牧师',
          property: {
            hp: 100,

            attack: 5,
          },
          skills: [
            new AttackSkill(
              {
                name: '治疗波',
                type: SkillType.revert,
                cool: 3000,
              },
              {
                times: 1,
                extraDemage: 10,
              }
            ),
          ],
        }),
      ],
    ];
  }
  let [heroes, monsters] = initBiology();

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
      const [heroes, monsters] = initBiology();
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
    getStat() {
      return mydis.getStat();
    },
  };
}

export default main;

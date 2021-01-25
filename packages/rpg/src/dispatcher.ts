import Biology, { BiologyType } from './biology/Biology';
import Skill from './skills/Skill';

function dispatcher() {
  let started = false;
  let heroes: Biology[] = [];
  let monsters: Biology[] = [];
  let logic = (t: number) => {
    heroes.forEach((b) => b.logic(t));
    monsters.forEach((b) => b.logic(t));
  };
  let draw = (t: number) => {};

  const actions = {
    skillAttack(b: Biology, skill: Skill, t: number) {
      let myheros = heroes.filter((h) => !h.died);
      let mymonsters = monsters.filter((h) => !h.died);
      skill.run({
        own: b,
        ownTeam: b.type === 'hero' ? myheros : mymonsters,
        emenyTeam: b.type === 'hero' ? mymonsters : myheros,
        timestamp: t,
      });
    },
    died(b: Biology) {
      let owns = b.type === BiologyType.hero ? heroes : monsters;

      if (owns.every((item) => item.died)) {
        started = false;
      }
    },
  };

  function loop(t: number) {
    if (!started) return;
    logic(t);
    draw(t);
    requestAnimationFrame(loop);
  }

  return {
    send<T extends keyof typeof actions>(
      msg: T,
      ...args: Parameters<typeof actions[T]>
    ) {
      // @ts-ignore
      actions[msg](...args);
    },
    init({
      logicFn,
      drawFn,
      initHeroes,
      initMonsters,
    }: {
      logicFn?: typeof logic;
      drawFn?: typeof draw;
      initHeroes: typeof heroes;
      initMonsters: typeof monsters;
    }) {
      if (logicFn) logic = logicFn;
      if (drawFn) draw = drawFn;

      heroes = initHeroes;
      monsters = initMonsters;
    },
    start() {
      if (started) return;
      started = true;
      requestAnimationFrame(loop);
    },
    end() {
      started = false;
    },
  };
}

export default dispatcher;

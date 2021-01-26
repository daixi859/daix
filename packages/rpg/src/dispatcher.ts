import Biology, { BiologyType } from './biology/Biology';
import Skill from './skills/Skill';

function BioloyReset(b: Biology | Biology[], t: number) {
  if (!Array.isArray(b)) {
    b = [b];
  }
  b.forEach((item) => {
    item.skills.forEach((s) => (s.prevTime = s.prevTime + t));
  });
}

function dispatcher() {
  let started = false;
  let heroes: Biology[] = [];
  let monsters: Biology[] = [];

  let stat: {
    [key: string]: {
      [key: string]: {
        name: string;
        demage: number;
      };
    };
  } = {};

  let logic = (t: number) => {
    heroes.forEach((b) => b.logic(t));
    monsters.forEach((b) => b.logic(t));
  };
  let draw = (t: number) => {};
  let timestamp = 0;
  const actions = {
    statAttack({
      own,
      skill,
      demage,
    }: {
      own: Biology;
      skill: Skill;
      demage: number;
    }) {
      if (!stat[own.id]) {
        stat[own.id] = {
          [skill.id]: {
            name: skill.name,
            demage: 0,
          },
        };
      } else if (!stat[own.id][skill.id]) {
        stat[own.id][skill.id] = {
          name: skill.name,
          demage: 0,
        };
      }
      stat[own.id][skill.id].demage += demage;
    },
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
    timestamp = t;
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
      requestAnimationFrame((t) => {
        BioloyReset(monsters, t - timestamp);
        BioloyReset(heroes, t - timestamp);
        loop(t);
      });
    },
    end() {
      started = false;
    },
    getStat() {
      return stat;
    },
  };
}

export default dispatcher;

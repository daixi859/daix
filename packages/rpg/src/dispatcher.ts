import Biology, { BiologyType } from './biology/Biology';

function dispatcher() {
  let started = false;
  let logic = (t: number) => {};
  let draw = (t: number) => {};
  let heroes: Biology[] = [];
  let monsters: Biology[] = [];

  const actions = {
    attack(b: Biology) {
      let enemies = b.type === BiologyType.hero ? monsters : heroes;
      let enemy = enemies.find((e) => !e.died);
      if (enemy) {
        enemy.beAttacked(b);
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
    init({ logicFn, drawFn }: { logicFn: typeof logic; drawFn: typeof draw }) {
      logic = logicFn;
      draw = drawFn;
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

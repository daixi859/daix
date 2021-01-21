import Hero from './heroes/Hero';
import Monster from './heroes/Monster';

function dispatcher() {
  const actions = {};

  function send<T extends keyof typeof actions>(
    msg: T,
    ...args: Parameters<typeof actions[T]>
  ) {
    // @ts-ignore
    actions[msg](...args);
  }

  function init({
    heroes,
    monsters,
  }: {
    heroes: Hero[];
    monsters: Monster[];
  }) {}

  return {
    send,
    init,
  };
}

export default dispatcher;

import Biology, { BiologyType } from '../biology/Biology';

import Monster from '../biology/Monster';
import Hero from '../biology/Hero';
import dispatcher from '../dispatcher';

function genarateBiology({
  type = BiologyType.hero,
  send,
}: {
  type?: BiologyType;
  send: ReturnType<typeof dispatcher>['send'];
}) {
  return function (
    opts: Omit<ConstructorParameters<typeof Biology>[0], 'send'>
  ) {
    return type === BiologyType.hero
      ? new Hero({ ...opts, send })
      : new Monster({ ...opts, send });
  };
}

export default {
  genarateBiology,
};

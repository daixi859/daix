import Biology from '../biology/Biology';
import config from '../config';

export type SkillRun = (opts: {
  own: Biology;
  ownTeam: Biology[];
  emenyTeam: Biology[];
  timestamp: number;
}) => string | number | void;

export enum SkillType {
  attack = 'attack',
}
export default class Skill {
  private cool = 1000;
  name = '攻击';
  prevTime = 0;
  type = SkillType.attack;

  constructor(opts: { name?: string; type?: SkillType; cool?: 1000 }) {
    Object.assign(this, opts);
  }

  get coolTime() {
    return this.cool / config.timeSpeed;
  }

  canRun(t: number) {
    if (t - this.prevTime >= this.coolTime) {
      this.prevTime = t;
      return true;
    }
    return false;
  }

  run: SkillRun = () => {};
}

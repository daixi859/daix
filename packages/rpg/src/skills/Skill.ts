import Biology from '../biology/Biology';
import config from '../config';

export type SkillRun = {
  own: Biology;
  ownTeam: Biology[];
  emenyTeam: Biology[];
  timestamp: number;
};

export type SkillArgs = { name?: string; type?: SkillType; cool?: number };

export enum SkillType {
  attack = 'attack',
}
export enum SkillLogic {
  order = 'order',
  ratio = 'ratio',
  less = 'less',
}

let id = 0;
export default abstract class Skill {
  private cool = 1000;
  name = '攻击';
  prevTime = 0;
  id: number = 0;
  type = SkillType.attack;
  owner?: Biology;

  constructor(opts: SkillArgs) {
    this.id = id++;
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

  abstract run(opts: SkillRun): string | number | void;
}

import Skill, { SkillArgs, SkillRun } from './Skill';

export default class AttackSkill extends Skill {
  name = '攻击';
  attack = 10;

  constructor(args: SkillArgs, attack: number) {
    super(args);
    this.attack = attack;
  }

  run({ own, emenyTeam }: SkillRun) {
    if (emenyTeam[0]) {
      emenyTeam[0].beAttacked(own);
    }
  }
}

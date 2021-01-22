import Skill from './Skill';

export default class AttackSkill extends Skill {
  name = '攻击';
  attack = 10;

  constructor(attack: number, ...args: ConstructorParameters<typeof Skill>) {
    super(...args);
    this.attack = attack;
  }
}

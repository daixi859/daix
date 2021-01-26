import Skill, { SkillArgs, SkillLogic, SkillRun } from './Skill';

export default class AttackSkill extends Skill {
  name = '攻击';
  attack = 10;

  opts = {
    number: 1,
    type: SkillLogic.order,
    times: 1,
  };

  constructor(args: SkillArgs, attack: number) {
    super(args);
    this.attack = attack;
  }

  run({ own, emenyTeam }: SkillRun) {
    switch (this.opts.type) {
      case SkillLogic.ratio:
        emenyTeam = emenyTeam
          .slice()
          .sort(
            (x, y) =>
              x.property.hp / x.property.maxHp -
              y.property.hp / y.property.maxHp
          );
      case SkillLogic.less:
        emenyTeam = emenyTeam
          .slice()
          .sort((x, y) => x.property.hp - y.property.hp);
    }
    let emenies = emenyTeam.slice(0, this.opts.number);
    emenies.forEach((emeny) => {
      if (emeny) {
        let prev = emeny.hp;

        // logic
        emeny.hp = emeny.property.hp - emeny.beDefend(own.getAttack());
        // logic

        this.owner?.send('statAttack', {
          own: own,
          skill: this,
          demage: prev - emeny.hp,
        });
      }
    });
  }
}

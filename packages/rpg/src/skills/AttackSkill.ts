import Skill, {
  SkillArgs,
  SkillAttack,
  SkillLogic,
  SkillRun,
  SkillType,
} from './Skill';

export default class AttackSkill extends Skill {
  attack = 10;
  number = 1; // 攻击数量

  times = 1; // 攻击倍数
  extraDemage = 0;

  constructor(
    args: SkillArgs,
    opts: {
      attack?: number;
      number?: number;
      times?: number;
      extraDemage?: number;
    }
  ) {
    super(args);
    Object.assign(this, opts);
  }

  run({ own, ownTeam, emenyTeam }: SkillRun) {
    let team = this.type === SkillType.attack ? emenyTeam : ownTeam;
    switch (this.logicType) {
      case SkillLogic.ratio:
        team = team
          .slice()
          .sort(
            (x, y) =>
              x.property.hp / x.property.maxHp -
              y.property.hp / y.property.maxHp
          );
      case SkillLogic.less:
        team = team.slice().sort((x, y) => x.property.hp - y.property.hp);
    }
    let emenies = team.slice(0, this.number);
    emenies.forEach((emeny) => {
      if (emeny) {
        let prev = emeny.hp;
        // logic
        if (this.type === SkillType.attack) {
          let demage = own.getAttack() * this.times + this.extraDemage;
          emeny.hp =
            emeny.property.hp - emeny.beDefend(demage, this.attackType);
          this.owner?.send('statAttack', {
            own: own,
            skill: this,
            demage: prev - emeny.hp,
          });
        } else {
          emeny.hp = emeny.hp + own.getAttack() * this.times + this.extraDemage;
          this.owner?.send('statAttack', {
            own: own,
            skill: this,
            cure: emeny.hp - prev,
          });
        }

        // logic
      }
    });
  }
}

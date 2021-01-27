import dispatcher from '../dispatcher';
import AttackSkill from '../skills/AttackSkill';
import Skill, { SkillAttack, SkillType } from '../skills/Skill';

const initProperty = {
  maxHp: 100,
  hp: 100,
  attack: 9,
  speed: 1500,
  crit: 1,
  cirtDamage: 2,
  coolTime: 1000,
  defend: 0,
  magicDefend: 0,
};
export enum BiologyType {
  hero = 'hero',
  monster = 'monster',
}

let id = 0;
export default class Biology {
  id = 0;
  name = '';
  type = BiologyType.hero;
  died = false;

  skills: Skill[] = [];

  stat = {
    hurt: 0,
    cure: 0,
  };

  property = { ...initProperty };

  send: ReturnType<typeof dispatcher>['send'];

  constructor(opts: {
    name: string;
    send: ReturnType<typeof dispatcher>['send'];
    type?: BiologyType;
    property?: Partial<typeof initProperty>;
    skills?: Skill[];
  }) {
    this.id = id++;
    const {
      skills = [],
      send,
      name,
      property = {},
      type = BiologyType.hero,
    } = opts;
    this.send = send;
    this.type = type;
    this.name = name;
    if (property.hp !== undefined && property.maxHp === undefined) {
      property.maxHp = property.hp;
    }

    this.property = Object.assign(this.property, property);

    this.skills = [
      new AttackSkill(
        { cool: this.property.speed },
        { attack: this.property.attack }
      ),
      ...skills,
    ].map((skill) => {
      skill.owner = this;
      return skill;
    });
  }

  get hp() {
    return this.property.hp;
  }

  set hp(h: number) {
    if (h <= 0) {
      this.died = true;
      this.property.hp = 0;
      this.send('died', this);
    } else if (h > this.property.maxHp) {
      this.property.hp = this.property.maxHp;
    } else {
      this.property.hp = h;
    }
  }

  getAttack() {
    let isCrit = this.property.crit / 100 >= Math.random();

    return isCrit
      ? this.property.attack * this.property.cirtDamage
      : this.property.attack;
  }

  get crit() {
    return this.property.crit;
  }

  get cirtDamage() {
    return this.property.cirtDamage;
  }

  get isCrit() {
    return this.property.crit / 100 >= Math.random();
  }

  beDefend(damage: number, type = SkillAttack.physical) {
    if (type === SkillAttack.physical) {
      return Math.floor(
        damage *
          (1 -
            (this.property.defend * 0.06) / (1 + 0.06 * this.property.defend))
      );
    } else {
      let magicDefend =
        this.property.magicDefend > 100 ? 100 : this.property.magicDefend;
      return Math.floor(damage * (1 - magicDefend / 100));
    }
  }

  beSkillAttacked(h: Biology, damage: number) {}

  logic(t: number) {
    if (this.died) return;
    this.skills.forEach((skill) => {
      if (skill.canRun(t)) {
        this.send('skillAttack', this, skill, t);
      }
    });
  }

  draw(t: number) {}
}

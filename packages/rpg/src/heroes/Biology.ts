import dispatcher from '../dispatcher';

const initProperty = {
  maxHp: 100,
  hp: 100,
  attack: 9,
  speed: 1500,
  crit: 1,
  cirtDamage: 2,
  coolTime: 1000,
  defend: 0,
  skillDefend: 0,
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
  }) {
    this.id = id++;
    const { send, name, property = {}, type = BiologyType.hero } = opts;
    this.send = send;
    this.type = type;
    this.name = name;
    if (property.hp !== undefined && property.maxHp === undefined) {
      property.maxHp = property.hp;
    }
    this.property = Object.assign(this.property, property);
  }

  get hp() {
    return this.property.hp;
  }

  set hp(h: number) {
    if (h <= 0) {
      this.died = true;
      this.property.hp = 0;
    } else if (h > this.property.maxHp) {
      this.property.hp = this.property.maxHp;
    } else {
      this.property.hp = h;
    }
  }

  beDefend(damage: number) {
    // return Math.floor(
    //   damage *
    //     (1 - (this.property.defend * 0.06) / (1 + 0.06 * this.property.defend))
    // );
  }

  beAttacked(h: Biology, damage?: number) {
    // damage = damage !== undefined ? damage : h.attack;
    // damage = this.beDefend(damage);
    // let prevhp = this.property.hp;
    // this.hp = this.property.hp - damage;
  }

  beSkillAttacked(h: Biology, damage: number) {}

  logic(t: number) {}

  draw(t: number) {}
}

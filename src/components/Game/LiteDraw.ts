import { Biology } from 'packages/rpg/src';

export default class LiteDraw {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  rect({
    x,
    y,
    w,
    h,
    lineWidth,
    color,
    type = 'fill',
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    lineWidth?: number;
    color?: string;
    type?: 'fill' | 'stroke';
  }) {
    if (color) {
      if (type === 'fill') {
        this.ctx.fillStyle = color;
      }
      if (type === 'stroke') {
        if (lineWidth) {
          this.ctx.lineWidth = lineWidth;
        }
        this.ctx.strokeStyle = color;
      }
    }

    if (type === 'fill') this.ctx.fillRect(x, y, w, h);
    if (type === 'stroke') this.ctx.strokeRect(x, y, w, h);
  }

  clean() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  draw(timestamp: number, heros: Biology[], mosters: Biology[]) {
    this.clean();
    let w = 250;
    let h = 20;
    let lineH = h + 55;
    heros.forEach((hero, i) =>
      this.drawHero(hero, { w, y: 20 + lineH * i, h }, timestamp)
    );
    mosters.forEach((hero, i) =>
      this.drawHero(
        hero,
        {
          w,
          x: this.width - w - 20,
          y: 20 + lineH * i,
          h,
        },
        timestamp
      )
    );
  }

  drawHero(
    hero: Biology,
    {
      x = 20,
      y = 20,
      h = 30,
      w = 200,
    }: {
      x?: number;
      y?: number;
      h?: number;
      w?: number;
    },
    timestamp: number
  ) {
    let percent = hero.property.hp / hero.property.maxHp;
    this.ctx.textBaseline = 'bottom';
    this.ctx.textAlign = 'start';

    // 名字
    this.ctx.fillText(hero.name, x, y - 2, w);

    // 状态
    // let stateW = 14;
    // hero.skills.state.forEach((s, i) => {
    //   let tmpx = x + w - stateW;
    //   let tmpy = y - 10;

    //   this.ctx.textBaseline = 'middle';
    //   this.ctx.textAlign = 'center';
    //   this.ctx.fillText(s.name, tmpx + 5, tmpy, stateW);
    // });

    // 血条
    this.rect({ x, y, w: w * percent, h, color: 'red' });
    this.rect({
      lineWidth: 1,
      x,
      y,
      w,
      h,
      color: 'gray',
      type: 'stroke',
    });
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
    this.ctx.fillText(
      `${hero.property.hp}/${hero.property.maxHp}`,
      x + w - 2,
      y + h / 2
    );

    // 技能
    hero.skills.forEach((skill, i) => {
      let sy = y + h + 5;
      let sw = 30;
      let sx = x + (sw + 10) * i;
      this.rect({
        x: sx,
        y: sy,
        w: sw,
        h: sw,
        lineWidth: 1,
        type: 'stroke',
        color: '#999',
      });

      this.textMiddleRect(
        {
          name: skill.name,
          prev: skill.prevTime,
          cool: skill.coolTime,
          x: sx,
          y: sy,
          h: sw,
          w: sw,
        },
        timestamp
      );
    });
  }

  textMiddleRect(
    {
      prev,
      cool,
      name,
      x,
      y,
      w,
      h,
    }: {
      prev: number;
      cool: number;
      name: string;
      x: number;
      y: number;
      w: number;
      h: number;
    },
    timestamp: number
  ) {
    let text = name;
    this.ctx.fillStyle = 'gray';
    this.ctx.font = 'normal 13px 黑体';
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    if (text.length > 2) {
      let half = Math.floor(text.length / 2);

      this.ctx.fillText(text.substr(0, half), x + w / 2, y + h / 4, w);
      this.ctx.fillText(text.substr(half), x + w / 2, y + h / 4 + h / 2, w);
    } else {
      this.ctx.fillText(text, x + w / 2, y + h / 2);
    }
    if (timestamp - prev < cool) {
      this.ctx.save();

      this.ctx.rect(x, y, w, h);
      this.ctx.clip();
      this.ctx.beginPath();
      // 位移到圆心，方便绘制
      this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
      this.ctx.moveTo(x + w / 2, y + w / 2);
      //  移动到圆心
      this.ctx.arc(
        x + w / 2,
        y + w / 2,
        Math.sqrt((w * w) / 4 + (w * w) / 4) - 1,
        0,
        Math.PI * (2 * (1 - (timestamp - prev) / cool))
      );
      // 闭合路径
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  // drawStat(timestamp: number, heros: Biology[], mosters: Biology[]) {
  //   let height = this.height - 20;
  //   let h = this.height - 20;
  //   heros
  //     .slice()
  //     .reverse()
  //     .forEach(
  //       (hero, i) => (height = this.drawStatLine({ hero, x: 20, height }))
  //     );

  //   mosters
  //     .slice()
  //     .reverse()
  //     .forEach(
  //       (hero, i) =>
  //         (h = this.drawStatLine({ hero, x: this.width - 20 - 250, height: h }))
  //     );
  // }

  // drawStatLine({ hero, x, height }: { hero: Biology; x: number; height: number }) {
  //   let h = 20;
  //   let lw = 60;
  //   this.ctx.textAlign = 'start';
  //   let all = 0;
  //   let skills: {
  //     name: string;
  //     heal: number;
  //     demage: number;
  //     skillType: SkillType;
  //   }[] = [
  //     {
  //       name: '攻击',
  //       demage: hero.demage,
  //       heal: 0,
  //       skillType: SkillType.attack,
  //     },
  //     ...hero.skills.active,
  //   ];
  //   skills.reverse().forEach((skill) => {
  //     this.ctx.fillText(skill.name + '：', x + lw, height, lw);
  //     if (skill.skillType === SkillType.attack) {
  //       all += skill.demage;
  //     }
  //     let demage =
  //       skill.skillType === SkillType.attack
  //         ? skill.demage + ''
  //         : skill.heal + ' +';
  //     this.ctx.fillText(demage, x + lw * 2, height);
  //     height -= h;
  //   });

  //   this.ctx.fillText(hero.name + ` 总伤害：${all}`, x, height);
  //   return height - h - 5;
  // }
}

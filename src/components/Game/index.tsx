import { useEffect, useRef, useState } from 'react';
import main from './main';

import classes from './index.less';

const Game = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  const [util, setUtil] = useState<ReturnType<typeof main>>();
  const [speed, setSpeed] = useState(1);
  useEffect(() => {
    if (ref.current) {
      setUtil(main(ref.current));
    }
  }, []);

  const changeSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
    if (util) util.changeSpeed(Number(e.target.value));
  };

  return (
    <div className={classes.wrap}>
      <canvas
        style={{ opacity: 0.05 }}
        ref={ref}
        width="600"
        height="400"
      ></canvas>
      <div className={classes.action}>
        <button
          onClick={() => {
            if (util) util.restart();
          }}
        >
          重启
        </button>
        <button
          onClick={() => {
            if (util) util.start();
          }}
        >
          启动
        </button>
        <button
          onClick={() => {
            if (util) util.stop();
          }}
        >
          暂停
        </button>
        <hr />
        <label>
          <input
            name="speed"
            value={1}
            onChange={changeSpeed}
            checked={speed === 1}
            type="radio"
          />
          1x
        </label>
        <label>
          <input
            name="speed"
            value={2}
            onChange={changeSpeed}
            checked={speed === 2}
            type="radio"
          />
          2x
        </label>
        <label>
          <input
            name="speed"
            value={4}
            onChange={changeSpeed}
            checked={speed === 4}
            type="radio"
          />
          4x
        </label>
        <hr />
        <button
          onClick={() => {
            console.log(util?.getStat());
          }}
        >
          获取统计
        </button>
      </div>
    </div>
  );
};

export default Game;

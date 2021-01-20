import React from 'react';
import classnames from 'classnames';
import classes from './index.less';

type Props = {
  type?: 'default' | 'blue' | 'red' | 'top10' | 'quality';
};

const Tag: React.FC<React.HTMLProps<HTMLSpanElement> & Props> = ({
  type = 'default',
  ...props
}) => {
  return (
    <span
      {...props}
      className={classnames(
        classes.tag,
        classes['tag-' + type],
        props.className
      )}
    />
  );
};

export default Tag;

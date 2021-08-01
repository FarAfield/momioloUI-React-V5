import { useState, useEffect } from 'react';
import { Card } from 'antd';
import moment from 'moment';
import styles from './Welcome.less';

const useCurrentTime = () => {
  const [time, setTime] = useState(moment().unix());
  useEffect(() => {
    const flag = setInterval(() => {
      setTime((v) => v + 1);
    }, 1000);
    return () => clearInterval(flag);
  }, []);
  return moment.unix(time).format('YYYY-MM-DD HH:mm:ss');
};
const Welcome = () => {
  const time = useCurrentTime();
  return (
    <Card>
      <div className={styles.sunAnimation}>
        <div className={styles.sun} />
        <div className={styles.text}>{<h1>欢迎使用</h1>}</div>
        <div className={styles.text}>{time}</div>
      </div>
    </Card>
  );
};
export default Welcome;

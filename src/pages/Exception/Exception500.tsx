import { Link } from 'umi';
import { Result, Button } from 'antd';
import { homePath } from '@/utils/constant';

export default () => (
  <Result
    status="500"
    title="500"
    style={{
      background: 'none',
    }}
    subTitle={'抱歉，服务器错误。'}
    extra={
      <Link to={homePath}>
        <Button type="primary">{'返 回'}</Button>
      </Link>
    }
  />
);

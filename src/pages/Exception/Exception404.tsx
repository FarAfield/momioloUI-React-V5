import { Link } from 'umi';
import { Result, Button } from 'antd';
import { homePath } from '@/utils/constant';

export default () => (
  <Result
    status="404"
    title="404"
    style={{
      background: 'none',
    }}
    subTitle={'抱歉，你访问的页面不存在。'}
    extra={
      <Link to={homePath}>
        <Button type="primary">{'返 回'}</Button>
      </Link>
    }
  />
);

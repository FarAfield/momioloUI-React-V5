import { Link } from 'umi';
import { Result, Button } from 'antd';

export default () => (
  <Result
    status="403"
    title="403"
    style={{
      background: 'none',
    }}
    subTitle={'抱歉，你无权访问该页面。'}
    extra={
      <Link to="/Welcome">
        <Button type="primary">{'返 回'}</Button>
      </Link>
    }
  />
);

import {BankOutlined} from '@ant-design/icons';

export function getIconByName(name: any) {
  switch (name) {
    case 'BankOutlined':
      return <BankOutlined />;
    default:
      return <BankOutlined />;
  }
}

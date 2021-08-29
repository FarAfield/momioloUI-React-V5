import { Select } from 'antd';
import { BankOutlined } from '@ant-design/icons';
const { Option } = Select;

export const transformOption = (arrayData: any = [], keyValue = ['value', 'label']) =>
  arrayData.map((item: any) => (
    <Option key={item[keyValue[0]]} value={item[keyValue[0]]}>
      {item[keyValue[1]]}
    </Option>
  ));

export const getValueByKey = (data: any = [], keyValue = ['key', 'value'], key: any) =>
  data.find((d: any) => d[keyValue[0]] === key)?.[keyValue[1]] || key;


export function getIconByName(name: any) {
  switch (name) {
    case 'BankOutlined':
      return <BankOutlined />;
    default:
      return <BankOutlined />;
  }
}

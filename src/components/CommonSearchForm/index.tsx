import { useEffect } from 'react';
import { Form, Row, Col, Button, Input, Select, DatePicker, Cascader } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { transformOption } from '@/utils/support';
import styles from './index.less';

/**
 *  ======组件属性=======
 *  （初级用法）
 *  searchItems    必须，自定义渲染配置项
 *  handleSearch   必须，点击查询或者重置按钮触发   values => {}
 *  transformValues  非必须，自定义表单数据（包括默认值）处理逻辑   values => newValues
 *  defaultValues  非必须，表单默认值（依据表单值进行设置）
 *  （中级用法）
 *  run  非必须，执行函数
 *  sortValues   非必须，table的排序参数
 *  filterValues  非必须，table的过滤参数
 *  （高级用法）
 *  dynamicValues  非必须，动态参数（动态参数的变更会自动触发查询且重置表单为默认值）借助useUpdateEffect更新动态值
 *
 *  ======配置项属性=======
 *  enumType   必须，指定渲染类型。若类型为custom，则需要提供render函数自定义
 *  key  必须，表单字段值
 *  title  必须，表单label
 *  placeholder  非必须
 *  rules  非必须
 *  ...rest  其他各种可扩展的属性
 *
 *  selectOptions  必须，类型为select配置options
 *  keyValue  必须，类型为select配置options的渲染方法
 */
const DefaultFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const CommonSearchForm = (props: any) => {
  const {
    searchItems,
    handleSearch,
    transformValues,
    defaultValues,
    run,
    sortValues,
    filterValues,
    dynamicValues,
  } = props;
  const [form] = Form.useForm();
  const { setFieldsValue, resetFields } = form;

  useEffect(() => {
    onReset();
  }, [dynamicValues]);

  function onFinish(fieldsValue: any) {
    let values = { ...fieldsValue };
    // 去空格处理
    for (const v in values) {
      if (typeof values[v] === 'string') {
        values[v] = values[v]?.trim();
      }
    }
    // 自定义数据处理
    values = transformValues?.(values) || values;
    handleSearch(values);
    run?.({ ...values, ...sortValues, ...filterValues, ...dynamicValues });
  }

  // 重置组件为初始状态
  function onReset() {
    resetFields();
    setFieldsValue(defaultValues);
    onFinish(defaultValues);
  }

  const ButtonGroup = () => {
    const offset = 16 - (searchItems.length % 3) * 8;
    return (
      <Col span={8} offset={offset}>
        <div className={styles.buttonGroup}>
          <Button type="primary" htmlType="submit">
            <SearchOutlined />
            查询
          </Button>
          <Button onClick={onReset}>
            <ReloadOutlined />
            重置
          </Button>
        </div>
      </Col>
    );
  };

  const RenderForm = () => {
    const resultItems = searchItems.map((item: any) => {
      const { enumType } = item;
      switch (enumType) {
        case 'input': {
          delete item.enumType;
          const { key, title, placeholder, rules, ...rest } = item;
          return (
            <Col key={key} span={8}>
              <FormItem name={key} label={title} rules={rules}>
                <Input
                  autoComplete="off"
                  allowClear
                  placeholder={placeholder || '请输入'}
                  {...rest}
                />
              </FormItem>
            </Col>
          );
        }
        case 'select': {
          delete item.enumType;
          const {
            key,
            title,
            placeholder,
            rules,
            selectOptions = [],
            keyValue = ['value', 'label'],
            ...rest
          } = item;
          return (
            <Col key={key} span={8}>
              <FormItem name={key} label={title} rules={rules}>
                <Select
                  allowClear
                  placeholder={placeholder || '请选择'}
                  showSearch
                  filterOption={(input: any, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  {...rest}
                >
                  {transformOption(selectOptions, keyValue)}
                </Select>
              </FormItem>
            </Col>
          );
        }
        case 'datePicker': {
          delete item.enumType;
          const { key, title, placeholder, rules, ...rest } = item;
          return (
            <Col key={key} span={8}>
              <FormItem name={key} label={title} rules={rules}>
                <DatePicker
                  allowClear
                  placeholder={placeholder || '请选择'}
                  style={{ width: '100%' }}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  {...rest}
                />
              </FormItem>
            </Col>
          );
        }
        case 'rangePicker': {
          delete item.enumType;
          const { key, title, placeholder, rules, ...rest } = item;
          return (
            <Col key={key} span={8}>
              <FormItem name={key} label={title} rules={rules}>
                <RangePicker
                  allowClear
                  placeholder={placeholder || ['开始时间', '结束时间']}
                  style={{ width: '100%' }}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  {...rest}
                />
              </FormItem>
            </Col>
          );
        }
        case 'cascader': {
          delete item.enumType;
          const { key, title, placeholder, rules, ...rest } = item;
          return (
            <Col key={key} span={8}>
              <FormItem name={key} label={title} rules={rules}>
                <Cascader
                  allowClear
                  placeholder={placeholder || '请选择'}
                  expandTrigger="hover"
                  getPopupContainer={(trigger) => trigger.parentNode}
                  {...rest}
                />
              </FormItem>
            </Col>
          );
        }
        // 自定义渲染
        case 'custom': {
          delete item.enumType;
          const { key, title } = item;
          return (
            <Col key={key} span={8}>
              <FormItem name={key} label={title}>
                {item?.render?.()}
              </FormItem>
            </Col>
          );
        }
        // 默认只提供占位
        default: {
          delete item.enumType;
          const { key } = item;
          return <Col key={key} span={8} />;
        }
      }
    });
    resultItems.push(<ButtonGroup key="buttonGroup" />);
    return resultItems;
  };
  return (
    <div className={styles.searchForm}>
      <Form {...DefaultFormItemLayout} form={form} onFinish={onFinish}>
        <Row gutter={24}>
          <RenderForm />
        </Row>
      </Form>
    </div>
  );
};
export default CommonSearchForm;

CommonSearchForm.defaultProps = {
  defaultValues: {},
  sortValues: {},
  filterValues: {},
  dynamicValues: {},
};

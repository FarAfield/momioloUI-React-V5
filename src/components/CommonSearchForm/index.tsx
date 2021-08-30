import { useEffect } from 'react';
import { Form, Row, Col, Button, Input, Select, DatePicker, Cascader } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { transformOption } from '@/utils/support';
import styles from './index.less';

/**
 *  ======组件属性=======
 *  form           非必须，form实例，默认由useForm生成。若需要操控表单可设置
 *
 *  searchItems    必须，自定义渲染配置项
 *  defaultValues  非必须，默认值，若存在默认值则自动给表单赋值
 *  handleSubmit   必须，点击查询按钮触发   values => {}
 *  handleReset    必须，点击重置按钮触发   defaultValues => {}
 *
 *  run  非必须，配置run查询方法
 *  mapPropsToFields  非必须，自定义默认值的回显逻辑  values => newValues
 *  transformValues  非必须，自定义表单数据处理逻辑   values => newValues
 *  extraValues  非必须，除table的排序筛选外的其他动态参数
 *  sortValues   非必须，table的排序参数
 *  filterValues  非必须，table的过滤参数
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
    form: propsForm,
    searchItems,
    defaultValues,
    handleSubmit,
    handleReset,
    run,
    mapPropsToFields,
    transformValues,
    extraValues,
    sortValues,
    filterValues,
  } = props;

  const [form] = propsForm || Form.useForm();
  const { setFieldsValue, resetFields } = form;

  // 存在默认值，则赋值查询，否则只查询
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length) {
      setFieldsValue(mapPropsToFields?.(defaultValues) || defaultValues);
      handleSubmit(defaultValues);
      run?.({ ...defaultValues, ...extraValues, ...sortValues, ...filterValues });
    } else {
      handleSubmit();
      run?.({...extraValues, ...sortValues, ...filterValues})
    }
  }, []);

  function onFinish(fieldsValue: any) {
    // 自定义数据处理
    const values = transformValues?.(fieldsValue) || fieldsValue;
    // 去空格处理
    for (const v in values) {
      if (typeof values[v] === 'string') {
        values[v] = values[v]?.trim();
      }
    }
    handleSubmit(values);
    run?.({ ...values, ...extraValues, ...sortValues, ...filterValues });
  }

  function onReset() {
    resetFields();
    setFieldsValue(defaultValues);
    handleReset(defaultValues);
    run?.({ ...defaultValues, ...extraValues, ...sortValues, ...filterValues });
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
                  showSearch
                  placeholder={placeholder || '请选择'}
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
          return <Col key={key} span={8}/>
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

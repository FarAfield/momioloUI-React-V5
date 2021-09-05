import { useState, useEffect } from 'react';
import { Form, Button, Modal, Input, Select, DatePicker, Cascader, message } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { transformOption } from '@/utils/support';
import { createService, isSuccess } from '@/utils/requestUtils';
import styles from './index.less';

/**
 *  ======组件属性=======
 * （初级用法）
 *  formItems   必须，自定义渲染配置项
 *  visible  必须
 *  record   必须，新增设置为{}，编辑设置为当前点击record
 *  onCancel 必须，关闭弹框的方法
 *  transformModalValues  非必须，自定义提交数据的处理逻辑   values => newValues
 *  handleSave  非必须，若不使用中级用法则必须(注意：该方法存在，本组件将不会自动处理保存之后的逻辑)
 *  defaultValues   非必须，表单默认值，编辑时以编辑数据优先（注意：这里的默认值请按照编辑数据的格式进行设置）
 *  mapPropsToFields  非必须，自定义默认值以及record的回显逻辑（注意：此处用于将默认值以及编辑数据转换为表单可识别数据） values => newValues
 * （中级用法）
 *  refresh  非必须，新增时以refresh(true)调用，编辑时以refresh()调用
 *  urls  非必须，类型为  string |  Array<string>  新增以及编辑接口url   例如：'/save'  |   ['/create','/update']
 * （高级用法）
 *  modalProps  非必须，透传到modal的属性
 *
 *  ======配置项属性=======
 *  enumType   必须，指定渲染类型。若类型为custom，则需要提供render函数自定义
 *  key  必须，表单字段值
 *  title  必须，表单label
 *  placeholder  非必须
 *  rules  非必须
 *  readOnly 非必须，默认为[false,false]  分别对应新增以及编辑是否禁用
 *  hide  非必须，设置为true则该项不渲染
 *  ...rest  其他各种可扩展的属性
 *
 *  selectOptions  必须，类型为select配置options
 *  keyValue  必须，类型为select配置options的渲染方法
 */
const { NODE_ENV } = process.env;
const isDev = NODE_ENV === 'development';
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
const CommonModalForm = (props: any) => {
  const {
    formItems,
    visible,
    record,
    onCancel,
    transformModalValues,
    handleSave,
    defaultValues,
    mapPropsToFields,
    refresh,
    urls,
    modalProps,
  } = props;
  const [form] = Form.useForm();
  const { setFieldsValue, resetFields } = form;
  const [loading, setLoading] = useState(false);
  const isEdit = record && Object.keys(record).length; // 是否是编辑

  useEffect(() => {
    if (visible) {
      if (isEdit) {
        setFieldsValue(
          mapPropsToFields?.({ ...defaultValues, ...record }) || { ...defaultValues, ...record },
        );
      } else {
        setFieldsValue(mapPropsToFields?.(defaultValues) || defaultValues);
      }
    } else {
      resetFields();
      setLoading(false);
    }
  }, [visible]);

  async function onFinish(fieldsValue: any) {
    let values = { ...fieldsValue };
    // 去空格处理
    for (const v in values) {
      if (typeof values[v] === 'string') {
        values[v] = values[v]?.trim();
      }
    }
    // 自定义数据处理
    values = transformModalValues?.(values) || values;
    const finallyValues = { ...record, ...values };
    // 不使用中级用法，将数据交由父组件
    if (handleSave) {
      handleSave(finallyValues);
      return;
    }
    let currentUrl = '';
    if (isEdit) {
      currentUrl = Array.isArray(urls) && urls.length === 2 ? urls[1] : urls;
    } else {
      currentUrl = Array.isArray(urls) && urls.length === 2 ? urls[0] : urls;
    }
    if (isDev) {
      console.log(`当前执行操作：${isEdit ? '编辑' : '新增'}`, ` 请求路径：${currentUrl}`);
      console.log('请求参数', finallyValues);
    }
    setLoading(true);
    const request = createService(currentUrl, 'post');
    const response = await request(finallyValues);
    setLoading(false);
    if (isSuccess(response)) {
      message.success(isEdit ? '编辑成功' : '新增成功');
      onCancel();
      refresh(!isEdit);
    } else {
      message.error(response.statusMessage);
    }
  }

  const ButtonGroup = () => {
    return (
      <div className={styles.buttonGroup}>
        <Button onClick={onCancel}>
          <CloseOutlined />
          取消
        </Button>
        <Button type="primary" onClick={() => form.submit()} loading={loading}>
          <CheckOutlined />
          保存
        </Button>
      </div>
    );
  };

  const RenderForm = () => {
    const resultItems = formItems.map((item: any) => {
      const { enumType, readOnly = [false, false], hide } = item;
      const disabled = isEdit ? readOnly[1] : readOnly[0];
      if (hide) {
        return null;
      }
      delete item.readOnly;
      switch (enumType) {
        case 'input': {
          delete item.enumType;
          const { key, title, placeholder, rules, ...rest } = item;
          return (
            <FormItem key={key} name={key} label={title} rules={rules}>
              <Input
                autoComplete="off"
                allowClear
                placeholder={placeholder || '请输入'}
                disabled={disabled}
                {...rest}
              />
            </FormItem>
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
            <FormItem key={key} name={key} label={title} rules={rules}>
              <Select
                allowClear
                showSearch
                placeholder={placeholder || '请选择'}
                filterOption={(input: any, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                disabled={disabled}
                {...rest}
              >
                {transformOption(selectOptions, keyValue)}
              </Select>
            </FormItem>
          );
        }
        case 'datePicker': {
          delete item.enumType;
          const { key, title, placeholder, rules, ...rest } = item;
          return (
            <FormItem key={key} name={key} label={title} rules={rules}>
              <DatePicker
                allowClear
                placeholder={placeholder || '请选择'}
                style={{ width: '100%' }}
                getPopupContainer={(trigger) => trigger.parentNode}
                disabled={disabled}
                {...rest}
              />
            </FormItem>
          );
        }
        case 'rangePicker': {
          delete item.enumType;
          const { key, title, placeholder, rules, ...rest } = item;
          return (
            <FormItem key={key} name={key} label={title} rules={rules}>
              <RangePicker
                allowClear
                placeholder={placeholder || ['开始时间', '结束时间']}
                getPopupContainer={(trigger) => trigger.parentNode}
                disabled={disabled}
                {...rest}
              />
            </FormItem>
          );
        }
        case 'cascader': {
          delete item.enumType;
          const { key, title, placeholder, rules, ...rest } = item;
          return (
            <FormItem key={key} name={key} label={title} rules={rules}>
              <Cascader
                allowClear
                placeholder={placeholder || '请选择'}
                expandTrigger="hover"
                getPopupContainer={(trigger) => trigger.parentNode}
                disabled={disabled}
                {...rest}
              />
            </FormItem>
          );
        }
        // 自定义渲染
        case 'custom': {
          delete item.enumType;
          const { key, title, rules } = item;
          return (
            <FormItem key={key} name={key} label={title} rules={rules}>
              {item?.render?.()}
            </FormItem>
          );
        }
        // 默认只提供占位
        default: {
          delete item.enumType;
          const { key } = item;
          return <FormItem key={key} />;
        }
      }
    });
    resultItems.push(<ButtonGroup key="buttonGroup" />);
    return resultItems;
  };

  return (
    <Modal
      className={styles.modalForm}
      forceRender
      visible={visible}
      title={isEdit ? '编辑' : '新增'}
      onCancel={onCancel}
      footer={false}
      closable
      {...modalProps}
    >
      <Form form={form} onFinish={onFinish} {...DefaultFormItemLayout}>
        <RenderForm />
      </Form>
    </Modal>
  );
};
export default CommonModalForm;

CommonModalForm.defaultProps = {
  defaultValues:{}
};

import { Table } from 'antd';

/**
 *  ======组件属性=======
 *  tableProps           必须,table的属性配置
 *
 *  run  必须，配置开启run查询
 *  formValues 非必须，表单值
 *  extraValues 非必须，除表单值外的其他动态参数
 *  onTableChange  非必须，若存在排序或者筛选功能则必须  （sortValues,filterValues） => {}
 *  transformSorter  非必须，排序时处理函数  values => newValues,不设置则使用默认处理
 *  transformFilter 非必须，筛选时处理函数  values => newValues，不设置则使用默认处理
 */

const CommonTable = (props: any) => {
  const {
    tableProps,
    run,
    formValues,
    extraValues,
    handleTableChange,
    transformSorter,
    transformFilter,
  } = props;

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    // sorter支持多列排序，设置sorter:{ multiple: 1 } 标识多列排序（multiple数字越小，使用前端排序越优先，使用后端排序时也默认遵从此规则），设置为true标识单列排序
    let sorterResult: any[] = [];
    if (sorter && Array.isArray(sorter)) {
      // 多列排序  sorter是个数组，此处先按照优先级排序
      sorterResult = sorter.sort((a, b) => a.column.sorter.multiple - b.column.sorter.multiple);
    } else if (sorter && Object.keys(sorter).length) {
      // 单列排序  sorter是个对象
      sorterResult = [sorter];
    }
    // 取消多列或者单列排序时，也会存在一个sorter,但是order为undefined，因此过滤且不参与排序
    sorterResult = sorterResult.filter((i: any) => i.order);
    /**
     * sorter处理。若无自定义处理函数，则默认方式处理
     */
    if (transformSorter) {
      sorterResult = transformSorter(sorterResult);
    } else {
      // 默认转换为 key  value结构
      // todo
    }

    let filtersResult = { ...filters };
    /**
     *  filter处理。若无自定义处理函数，则默认方式处理
     */
    if (transformFilter) {
      filtersResult = transformFilter(filtersResult);
    } else {
      // 默认使用filters进行全选时,改变传参为undefined
      const filterColumns = tableProps.columns.filter((i: any) => !!i.filters);
      for (const k in filters) {
        const target = filterColumns.find((i: any) => i.dataIndex === k);
        if (target.filters.length === filters[k].length) {
          filtersResult[k] = undefined;
        } else {
          filtersResult[k] = filters[k];
        }
      }
    }
    handleTableChange(sorterResult, filtersResult);
    const params = {
      current: pagination.current,
      size: pagination.pageSize,
      ...sorterResult,
      ...filtersResult,
      ...formValues,
      ...extraValues,
    };
    run(params);
  };
  const globalPageProps = {
    pageSizeOptions: [10, 20, 50, 100],
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal: (total: number) => `总共${total || 0}条记录`,
    simple: false,
    size: 'default',
  };
  // 注入全局分页属性, 如果原配置pagination不存在或者为false，说明无需配置分页参数
  const tableFinallyProps = {
    ...tableProps,
    pagination: !tableProps.pagination ? false : { ...globalPageProps, ...tableProps.pagination },
  };
  return <Table onChange={onChange} {...tableFinallyProps} />;
};
export default CommonTable;

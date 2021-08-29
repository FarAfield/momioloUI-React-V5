## Common 组件说明文档

## CommonSearchForm CommonTable
-- 两者同时配置开启 run 查询，实现 form 与 table 的联动。本质上 run 查询的参数是一致的
-- 除分页参数外，run查询所需参数均为extraValues(额外动态参数) formValues(表单参数) sortValues(排序参数) filterValues(过滤参数)
-- CommonSearchForm组件内部自动处理formValues，通过transformValues进行参数转换
-- CommonTable组件内部自动处理sortValues以及filterValues，通过transformSorter以及transformFilter进行参数转换
-- CommonSearchForm组件通过handleSubmit以及handleReset暴露处理好的formValues
-- CommonTable组件通过handleTableChange暴露处理好的sortValues以及filterValues
-- extraValues的用途是父组件传递了动态参数，若有非动态参数，可通过useTableFetch配置静态参数

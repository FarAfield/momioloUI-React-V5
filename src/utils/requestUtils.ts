import { useState } from 'react';
import { message } from 'antd';
import { request } from 'umi';

/**
 *  判断接口返回是否成功
 */
export const isSuccess = (response: any) => {
  return response?.statusCode === '0';
};

/**
 *  获取一个请求信号
 *  与请求相关联，则可以使用cancel方法取消请求
 *  要确保每次请求都是不同的signal
 *  例如：
 *  const { signal,cancel } = createSignal()
 *  dispatch({
 *    type:'base/getData',
 *    payload: { url:"xxx", signal }
 *  })
 *  使用cancel则可以取消掉这次请求
 */
export const createSignal = () => {
  const controller = new AbortController(); // 创建一个控制器
  const { signal } = controller; // 返回一个 AbortSignal 对象实例，它可以用来 with/abort 一个 DOM 请求
  function cancel() {
    controller.abort();
  }
  return { signal, cancel };
};

/**
 *  基于table
 *  options: 均非必传
 *     transformParam  入参转换函数
 *     transformResult  出参转换函数
 *     extraParams  额外附加的参数（run查询每次都会附加）
 *
 *  @return
 *     list
 *     pagination
 *     loading
 *     run 执行函数
 *     params 执行函数此次执行时的参数
 *     refresh 以原参数再次执行run
 *     cancel  取消此次请求
 */
interface optionsProps {
  transformParam?: Function;
  transformResult?: Function;
  extraParams?: object;
}
export const useTableFetch = (service: any, options: optionsProps = {}) => {
  const { transformParam, transformResult, extraParams = {} } = options;
  const [list, setList] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  async function run(p: any = {}) {
    const { current: reqCurrent = 1, size: reqSize = 10, ...rest } = p;
    let finalParams = { current: reqCurrent, size: reqSize, ...rest, ...extraParams };
    if (transformParam) {
      finalParams = transformParam(finalParams);
    }
    setParams(finalParams);
    setLoading(true);
    let response: any = await service(finalParams);
    setLoading(false);
    if (transformResult) {
      response = transformResult(response);
    }
    if (isSuccess(response)) {
      const {
        records = [],
        total: resTotal = 0,
        current: resCurrent = 1,
        size: resSize = 10,
      } = response.data;
      setList(records);
      setCurrent(resCurrent);
      setPageSize(resSize);
      setTotal(resTotal);
    } else {
      setList([]);
      setCurrent(1);
      setPageSize(10);
      setTotal(0);
    }
  }
  function refresh() {
    run(params);
  }
  return {
    list,
    pagination: {
      current,
      pageSize,
      total,
    },
    loading,
    run,
    params,
    refresh,
  };
};

/**
 *  创建promise
 */
export const createService = (url: string, method: string = 'get') => {
  if (method === 'get') {
    return (params: any = undefined) => request(url, { method, params });
  }
  if (method === 'post') {
    return (data: any = undefined) => request(url, { method, data });
  }
  // 创建失败
  return () => {
    message.error('无效的Promise,请检查！');
  };
};

/**
 *  配合createService使用
 */
export const transformResponse = (response: any, showError: boolean = false) => {
  if (isSuccess(response)) {
    return response.data;
  }
  if (showError) {
    message.error(response?.statusMessage);
  }
  return null;
};

const cache = {};
/**
 *
 * @param {*} key 此次处理的唯一key值
 * @returns function 判断请求是否有效的函数
 */
const asyncDebounce = (key: string) => {
  const time = new Date().getTime();
  cache[key] = time;
  return () => {
    return cache[key] === time;
  };
};
export default asyncDebounce;

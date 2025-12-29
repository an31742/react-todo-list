import { memo } from "react";

const PreventRerenderHooks = (props) => {
  return (
    <div>
      <p>Fruit: {props.fruit}</p>
    </div>
  );
};
//使用memo 组织重复渲染
export default memo(PreventRerenderHooks);

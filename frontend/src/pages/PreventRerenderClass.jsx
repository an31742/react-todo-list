import { Component } from "react";

class PreventRerenderClass extends Component {
  //所以，使用 shouldComponentUpdate 生命周期来检查 fruit 属性是否改变。 如果相同，则子组件不会重新渲染
  // 防止铸件重新渲染重新赋值
  //子组件使用props来接手  shouldComponentUpdate 来判断是否一致lai
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.fruit !== nextProps.fruit;
  }
  // shouldComponentUpdate
  render() {
    return (
      <div>
        <p>Fruit: {this.props.fruit}</p>
      </div>
    );
  }
}

export default PreventRerenderClass;

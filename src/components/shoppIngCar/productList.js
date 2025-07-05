/*
 * @Author: an31742 2234170284@qq.com
 * @Date: 2025-07-03 02:01:05
 * @LastEditors: an31742 2234170284@qq.com
 * @LastEditTime: 2025-07-03 18:17:40
 * @FilePath: /react-todo-list/src/components/shoppIngCar/productList.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import react from "react"
//传过来三个参数  商品的总数量  购物车的商品
function ProductList({ products, cart, dispatch }) {
  //获取当前购物车每个商品的数量
  const getCartQuantity = (productId) => {
    //如果商品id是相同的那么就获得对应的数量
    const cartItem = cart.find((item) => item.id === productId)
    return cartItem ? cartItem.quantity : 0
  }

  return (
    <div className="product-list">
      <h2>商品列表</h2>
      <div clasName="products">
        {products.map((product) => {
          //判断商品id和购物车的id是否相同如果相同就返回对应的数量
          const cartQuantity = getCartQuantity(product.id)
          //商品的总数量减去购物车数量等于剩余的数量
          const remainingStock = product.stock - cartQuantity
          return (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>价格：￥{product.price}</p>
              <p>库存：{remainingStock > 0 ? remainingStock : 0}</p>
              <p>已加入购物车：{cartQuantity} 件</p>
              {/* //如果剩余数量小于等于0则禁用按钮 */}
              {/* 如果剩余商品大于0就是显示加入购物车否则就是显示已售罄 */}
              <button disabled={remainingStock <= 0} onClick={() => dispatch({ type: "ADD_ITEM", payload: product })}>
                {remainingStock > 0 ? "加入购物车" : "已售罄"}
              </button>
              {/* 如果购物车数量大于0就显示移除按钮 */}
              {cartQuantity > 0 && <span className="in-cart-badge">已在购物车: {cartQuantity}件</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProductList

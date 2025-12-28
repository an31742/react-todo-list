import { useLocation } from "react-router-dom";
import { useParams } from "react-router";
function Home() {
  let location = useLocation();
   const { keyword } = useParams();
  return (
    <div>
      <h2>我是产品的内容</h2>
      <div>{location.state}</div>
      <div>{keyword}</div>
    </div>
  );
}

export default Home;

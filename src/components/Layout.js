import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/barchart">BarChart</Link> 
          </li>
          <li>
            <Link to="/bubblechart">BubbleChart</Link> 
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
};

export default Layout;
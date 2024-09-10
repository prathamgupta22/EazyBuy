import React from "react";
import { NavLink, Link } from "react-router-dom";
import { GiShoppingBag } from "react-icons/gi";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import { Dropdown } from "flowbite-react";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  const toggleMobileMenu = () => {
    const navMenu = document.getElementById("mobile-menu");
    navMenu.classList.toggle("hidden");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            to="/"
            className="text-2xl font-bold flex items-center hover:text-blue-600"
          >
            <span className="font-extrabold text-blue-600">🛒</span>
            <span className="font-extrabold text-gray-800">Eazy</span>
            <span className="font-extrabold text-red-600">Buy</span>
          </Link>
          <button
            className="text-gray-600 md:hidden"
            type="button"
            aria-controls="mobile-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <SearchInput />
          <NavLink
            to="/"
            className="text-gray-800 font-semibold hover:text-blue-600 hover:border-b-2 border-blue-600"
          >
            Home
          </NavLink>
          <Dropdown
            label={
              <span className="text-black font-bold pl-5">Categories</span>
            }
            dismissOnClick={false}
            className="text-black font-semibold"
          >
            <Dropdown.Item>
              <Link
                to={"/categories"}
                className="px-4 py-2 text-black font-semibold hover:text-white"
              >
                All Categories
              </Link>
            </Dropdown.Item>
            {categories?.map((c) => (
              <Dropdown.Item key={c._id}>
                <Link
                  to={`/category/${c.slug}`}
                  className="px-4 py-2 text-black font-semibold"
                >
                  {c.name}
                </Link>
              </Dropdown.Item>
            ))}
          </Dropdown>

          {/* Authentication Links */}
          {!auth.user ? (
            <>
              <NavLink
                to="/register"
                className="text-gray-800 font-semibold hover:text-blue-600 hover:border-b-2 border-blue-600"
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="text-gray-800 font-semibold hover:text-blue-600 hover:border-b-2 border-blue-600"
              >
                Login
              </NavLink>
            </>
          ) : (
            <Dropdown
              label={<span className="text-black font-bold  pl-4">User</span>}
              dismissOnClick={false}
              className=""
            >
              <Dropdown.Item>
                <NavLink
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  className="px-4 py-2 text-black font-semibold"
                >
                  Dashboard
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item>
                <NavLink
                  onClick={handleLogout}
                  to="/login"
                  className="px-4 py-2 text-black font-semibold"
                >
                  Logout
                </NavLink>
              </Dropdown.Item>
            </Dropdown>
          )}

          {/* Cart Badge */}
          <Badge
            size="small"
            count={cart?.length}
            className="relative"
            style={{
              backgroundColor: "#ff4d4f",
              color: "#fff",
              fontSize: "0.75rem",
            }}
          >
            <NavLink
              to="/cart"
              className="flex items-center text-gray-800 font-semibold hover:text-blue-600"
              style={{
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <GiShoppingBag className="mr-2 text-xl" /> Cart
            </NavLink>
          </Badge>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <ul className="flex flex-col space-y-2 mt-2 hidden" id="mobile-menu">
          <li>
            <SearchInput />
          </li>
          <li>
            <NavLink
              to="/"
              className="text-gray-800 font-semibold hover:text-blue-600"
              onClick={toggleMobileMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <Dropdown label="a" className="text-black">
              <Dropdown.Item>
                <Link
                  to={"/categories"}
                  className="block px-4 py-2 text-gray-300 hover:text-white"
                >
                  All Categories
                </Link>
              </Dropdown.Item>
              {categories?.map((c) => (
                <Dropdown.Item key={c._id}>
                  <Link
                    to={`/category/${c.slug}`}
                    className="block px-4 py-2 text-gray-300 hover:text-white"
                  >
                    {c.name}
                  </Link>
                </Dropdown.Item>
              ))}
            </Dropdown>
          </li>

          {!auth.user ? (
            <>
              <li>
                <NavLink
                  to="/register"
                  className="text-gray-800 font-semibold hover:text-blue-600"
                  onClick={toggleMobileMenu}
                >
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className="text-gray-800 font-semibold hover:text-blue-600"
                  onClick={toggleMobileMenu}
                >
                  Login
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to={`/dashboard/${auth?.user?.role === 1 ? "admin" : "user"}`}
                  className="text-gray-800 font-semibold hover:text-blue-600"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu();
                  }}
                  to="/login"
                  className="text-gray-800 font-semibold hover:text-blue-600"
                >
                  Logout
                </NavLink>
              </li>
            </>
          )}
          <li>
            <NavLink
              to="/cart"
              className="flex items-center text-gray-800 font-semibold hover:text-blue-600"
              onClick={toggleMobileMenu}
            >
              <GiShoppingBag className="mr-2" /> Cart {cart.length}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;

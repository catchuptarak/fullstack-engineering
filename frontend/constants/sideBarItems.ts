import { FaUserPlus } from "react-icons/fa";
import { TiHome, TiUser } from "react-icons/ti";

const sideBarItems = [
  {
    title: "Home",
    route: "/",
    Icon: TiHome,
  },
  {
    title: "Systems",
    route: "/systems",
    Icon: TiUser,
    submenu: [
      { title: "System Code", route: "/systems/code" },
      { title: "Properties", route: "/systems/properties" },
      { title: "Menus", route: "/systems/menus" },
      { title: "API List", route: "/systems/api-list" },
    ],
  },
  {
    title: "Users & Group",
    route: "/users",
    Icon: FaUserPlus,
  },
  {
    title: "Competition",
    route: "/competition",
    Icon: FaUserPlus,
  },
];

export default sideBarItems;

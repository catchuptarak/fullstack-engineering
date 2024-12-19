import { IconType } from "react-icons";
import { FaUserPlus } from "react-icons/fa";
import { TiHome, TiUser } from "react-icons/ti";

interface SubMenuItemType {
  title: string;
  route: string;
  // Icon: IconType;
}

interface sideBarItemType {
  title: string;
  route: string;
  Icon: IconType;
  submenu?: SubMenuItemType[];
}

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
      { title: "Properties", route: "/systems/Properties" },
      { title: "Menus", route: "/systems/menus" },
      { title: "API List", route: "/systems/apilist" },
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

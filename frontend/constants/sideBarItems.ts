import { IconType } from "react-icons";
import { FaUserPlus } from "react-icons/fa";
import { TiHome, TiUser } from "react-icons/ti";

interface sideBarItemType {
  title: string;
  route: string;
  Icon: IconType;
}

const sideBarItems: sideBarItemType[] = [
  {
    title: "Home",
    route: "/",
    Icon: TiHome,
  },
  {
    title: "Systems",
    route: "/systems",
    Icon: TiUser,
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

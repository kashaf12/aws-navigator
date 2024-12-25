import { useView } from "@/hooks";
import classes from "./styles.module.css";
import {
  FileText,
  History,
  MessageCircle,
  Plus,
  Settings,
  User,
} from "lucide-react";
import Tooltip from "../Tooltip";
import { ViewType } from "@/contexts";

export const navigationItems = [
  {
    id: ViewType.CurrentChat,
    label: "Current Chat",
    Icon: MessageCircle,
    position: "top",
    showInNav: true,
  },
  {
    id: ViewType.History,
    label: "History",
    Icon: History,
    position: "top",
    showInNav: true,
  },
  {
    id: ViewType.Settings,
    label: "Settings",
    Icon: Settings,
    position: "top",
    showInNav: true,
  },
  {
    id: ViewType.Documentation,
    label: "Documentation",
    Icon: FileText,
    position: "top",
    showInNav: true,
  },
  {
    id: ViewType.UserProfile,
    label: "Profile",
    Icon: User,
    position: "bottom",
    showInNav: true,
  },
];

const Navigation = () => {
  const { activeView, setActiveView } = useView();

  const topItems = navigationItems.filter((item) => item.position === "top");
  const bottomItems = navigationItems.filter(
    (item) => item.position === "bottom"
  );

  return (
    <nav className={classes.navigation}>
      <div className={classes.topItems}>
        <Tooltip content={"New Chat"} position="right" delay={300}>
          <button
            // onClick={() => setActiveView(id)}
            className={`${classes.navButton} ${classes.accentButton}`}
            title={"New"}
          >
            <Plus size={20} />
          </button>
        </Tooltip>
        {topItems.map(({ id, Icon, label }) => (
          <Tooltip key={id} content={label} position="right" delay={300}>
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`${classes.navButton} ${
                activeView === id ? classes.active : ""
              }`}
              title={label}
            >
              <Icon size={20} />
            </button>
          </Tooltip>
        ))}
      </div>
      <div className={classes.bottomItems}>
        {bottomItems.map(({ id, label, Icon }) => (
          <Tooltip key={id} content={label} position="right" delay={300}>
            <button
              onClick={() => setActiveView(id)}
              className={`${classes.navButton} ${
                activeView === id ? classes.active : ""
              }`}
              title={label}
            >
              <Icon size={20} />
            </button>
          </Tooltip>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;

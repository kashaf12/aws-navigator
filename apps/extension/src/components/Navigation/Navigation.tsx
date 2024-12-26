import classes from "./styles.module.css";
import {
  FileText,
  History,
  MessageCircle,
  Plus,
  Settings,
  SquarePlay,
  User,
} from "lucide-react";
import Tooltip from "../Tooltip";
import { ViewType } from "@/contexts";
import { useChats, useView } from "@/hooks";
import { PositionType } from "./types";

export const navigationItems = [
  {
    id: ViewType.CurrentChat,
    label: "Current Chat",
    Icon: MessageCircle,
    position: PositionType.Top,
    showInNav: true,
  },
  {
    id: ViewType.History,
    label: "History",
    Icon: History,
    position: PositionType.Top,
    showInNav: true,
  },
  {
    id: ViewType.Task,
    label: "Task",
    Icon: SquarePlay,
    position: PositionType.Top,
    showInNav: true,
  },
  {
    id: ViewType.Settings,
    label: "Settings",
    Icon: Settings,
    position: PositionType.Top,
    showInNav: true,
  },
  {
    id: ViewType.Documentation,
    label: "Documentation",
    Icon: FileText,
    position: PositionType.Top,
    showInNav: true,
  },
  {
    id: ViewType.UserProfile,
    label: "Profile",
    Icon: User,
    position: PositionType.Bottom,
    showInNav: true,
  },
];

const Navigation = () => {
  const { activeView, setActiveView } = useView();
  const { updateActiveChat } = useChats();

  const topItems = navigationItems.filter(
    (item) => item.position === PositionType.Top
  );
  const bottomItems = navigationItems.filter(
    (item) => item.position === PositionType.Bottom
  );

  return (
    <nav className={classes.navigation}>
      <div className={classes.topItems}>
        <Tooltip content="New Chat" position={PositionType.Right} delay={300}>
          <button
            onClick={() => {
              updateActiveChat(null);
              setActiveView(ViewType.CurrentChat);
            }}
            className={`${classes.navButton} ${classes.accentButton}`}
            title={"New"}
          >
            <Plus size={20} />
          </button>
        </Tooltip>
        {topItems.map(({ id, Icon, label }) => (
          <Tooltip
            key={id}
            content={label}
            position={PositionType.Right}
            delay={300}
          >
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
          <Tooltip
            key={id}
            content={label}
            position={PositionType.Right}
            delay={300}
          >
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

import classes from "./styles.module.css";
import { HeaderProps } from "./types";

const Header = ({ title }: HeaderProps) => (
  <header className={classes.container}>
    <h1 className={classes.title}>{title}</h1>
  </header>
);

export default Header;

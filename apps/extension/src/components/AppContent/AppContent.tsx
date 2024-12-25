import classes from "./styles.module.css";
import Header from "../Header";
import ChatDashboard from "../ChatDashboard";

const AppContent = () => {
  return (
    <>
      <Header title="AWS Navigator" />
      <main className={classes.appMain}>
        <ChatDashboard />
      </main>
    </>
  );
};

export default AppContent;

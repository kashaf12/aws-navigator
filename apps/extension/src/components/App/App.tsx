import classes from "./styles.module.css";
import AppContent from "../AppContent";
import { ConversationProvider, ViewProvider } from "@/contexts";
import Header from "../Header";
import Navigation from "../Navigation";

const App = () => {
  return (
    <div className={classes.container}>
      <ConversationProvider>
        <ViewProvider>
          <Header title="AWS Navigator" />
          <div className={classes.layout}>
            <Navigation />
            <div className={classes.content}>
              <AppContent />
            </div>
          </div>
        </ViewProvider>
      </ConversationProvider>
    </div>
  );
};

export default App;

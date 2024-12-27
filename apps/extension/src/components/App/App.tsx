import classes from "./styles.module.css";
import AppContent from "../AppContent";
import {
  ChatProvider,
  TabProvider,
  TaskProvider,
  ViewProvider,
} from "@/contexts";
import Header from "../Header";
import Navigation from "../Navigation";

const App = () => {
  return (
    <div className={classes.container}>
      <TabProvider>
        <TaskProvider>
          <ChatProvider>
            <ViewProvider>
              <Header title="AWS Navigator" />
              <div className={classes.layout}>
                <Navigation />
                <div className={classes.content}>
                  <AppContent />
                </div>
              </div>
            </ViewProvider>
          </ChatProvider>
        </TaskProvider>
      </TabProvider>
    </div>
  );
};

export default App;

import NotAWSWarning from "../NotAWSWarning";
import ErrorMessage from "../ErrorMessage";
import classes from "./styles.module.css";
import { useAWSDetector } from "@/hooks";
import AppContent from "../AppContent";

const App = () => {
  const { isAWS, loading, error } = useAWSDetector();

  if (loading) {
    return <div className={classes.loading}>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className={classes.appContainer}>
      {isAWS ? <AppContent /> : <NotAWSWarning />}
    </div>
  );
};

export default App;

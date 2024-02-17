import styles from './App.module.css';
import Custom from './Custom';
import { JSX } from 'solid-js';

const App: () => JSX.Element = () => {
  return (
    <div class={styles.App}>
      <Custom />
    </div>
  );
};

export default App;

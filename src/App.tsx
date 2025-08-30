 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, type Transition } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './component/layout/Layout'
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { ChatPage } from './pages/Chatpage';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

const pageTransition:Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <LandingPage />
                </motion.div>
              </Layout>
            }
          />
          <Route
            path="/upload"
            element={
              <Layout>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <UploadPage />
                </motion.div>
              </Layout>
            }
          />
          <Route
            path="/chat"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ChatPage />
              </motion.div>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
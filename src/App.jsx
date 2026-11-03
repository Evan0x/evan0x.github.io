import { About } from './components/About.jsx';
import { Atmosphere } from './components/Atmosphere.jsx';
import { Contact } from './components/Contact.jsx';
import { Experience } from './components/Experience.jsx';
import { Footer } from './components/Footer.jsx';
import { Hero } from './components/Hero.jsx';
import { Navigation } from './components/Navigation.jsx';
import { Projects } from './components/Projects.jsx';
import { Toolkit } from './components/Toolkit.jsx';
import { Boot } from './motion/Boot.jsx';
import { MotionProvider } from './motion/MotionProvider.jsx';

function App() {
  return (
    <MotionProvider>
      <Boot>
        <div className="site">
          <a className="skip-link" href="#content">Skip to content</a>
          <Atmosphere />
          <Navigation />
          <main className="site-main" id="content">
            <Hero />
            <About />
            <Projects />
            <Experience />
            <Toolkit />
            <Contact />
          </main>
          <Footer />
        </div>
      </Boot>
    </MotionProvider>
  );
}

export default App;

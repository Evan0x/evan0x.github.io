import { useEffect } from 'react';
import { About } from './components/About.jsx';
import { Atmosphere } from './components/Atmosphere.jsx';
import { CaseStudy, MissingStudy } from './components/CaseStudy.jsx';
import { CommandPalette } from './components/CommandPalette.jsx';
import { Contact } from './components/Contact.jsx';
import { Experience } from './components/Experience.jsx';
import { Footer } from './components/Footer.jsx';
import { GithubDashboard } from './components/GithubDashboard.jsx';
import { Hero } from './components/Hero.jsx';
import { Navigation } from './components/Navigation.jsx';
import { Projects } from './components/Projects.jsx';
import { Terminal } from './components/Terminal.jsx';
import { Toolkit } from './components/Toolkit.jsx';
import { getCaseStudy } from './data/caseStudies.js';
import { useHashView } from './hooks/useHashView.js';
import { Boot } from './motion/Boot.jsx';
import { MotionProvider, useMotionPrefs } from './motion/MotionProvider.jsx';
import { scrollToHash } from './motion/scroll.js';
import { SystemsProvider } from './systems/SystemsContext.jsx';

function Site() {
  const view = useHashView();
  const prefs = useMotionPrefs();
  const study = view.kind === 'study' ? getCaseStudy(view.id) : null;
  const showingStudy = view.kind === 'study';

  useEffect(() => {
    if (showingStudy) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const hash = window.location.hash;
    if (!hash || hash.startsWith('#study/')) return undefined;
    const timer = window.setTimeout(() => {
      scrollToHash(hash, { reduced: prefs.reduced });
    }, 50);
    return () => window.clearTimeout(timer);
  }, [showingStudy, view.id, prefs.reduced]);

  return (
    <div className={showingStudy ? 'site site--study' : 'site'}>
      <a className="skip-link" href={showingStudy ? '#study' : '#content'}>
        Skip to content
      </a>
      <Atmosphere />
      <Navigation />
      <main className="site-main" id="content">
        {showingStudy ? (
          study ? <CaseStudy study={study} /> : <MissingStudy id={view.id} />
        ) : (
          <>
            <Hero />
            <About />
            <Projects />
            <Experience />
            <Toolkit />
            <GithubDashboard />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <CommandPalette />
      <Terminal />
    </div>
  );
}

function App() {
  return (
    <MotionProvider>
      <SystemsProvider>
        <Boot>
          <Site />
        </Boot>
      </SystemsProvider>
    </MotionProvider>
  );
}

export default App;

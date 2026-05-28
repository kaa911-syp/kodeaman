import { EvidenceLedger } from './components/EvidenceLedger'
import { ExhibitFinding } from './components/ExhibitFinding'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Install } from './components/Install'
import { Manifesto } from './components/Manifesto'
import { Nav } from './components/Nav'
import { ScannersIndex } from './components/ScannersIndex'
import { TranscriptSection } from './components/TranscriptSection'
import { useReveal } from './hooks/useReveal'

function App() {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#top">
        Skip to content
      </a>
      <div className="meander-rule" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <EvidenceLedger />
        <ExhibitFinding />
        <TranscriptSection />
        <ScannersIndex />
        <Install />
        <Manifesto />
      </main>
      <Footer />
      <div className="meander-rule" aria-hidden="true" />
    </>
  )
}

export default App

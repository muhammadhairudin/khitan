import Hero from '../components/home/Hero'
import About from '../components/home/About'
import Requirements from '../components/home/Requirements'
import Information from '../components/home/Information'
import Contact from '../components/home/Contact'
import Location from '../components/home/Location'
import Article from '../components/home/Article'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Hero />
      <About />
      <Information />
      <Requirements />
      <Article />
      <Location />
      <Contact />
    </div>
  )
} 
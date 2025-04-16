import './custom.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Intro from './components/Intro';
import Banner from './components/Banner';
import Perdidos from './components/Perdidos';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <Intro />
      <Banner />
      <Perdidos />
      <Footer />
    </>
  );
}

export default App;
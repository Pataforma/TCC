// src/pages/Home.jsx
import Header from "../components/Header";
import Intro from "../components/Intro";
import Banner from "../components/Banner";
import Perdidos from "../components/Perdidos";
import CarrouselSection from "../components/CarrouselSection";
import ProductHighlight from "../components/ProductHighlight";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";
import CardsHome from "../components/CardsHome";
import EventSection from "../components/EventSection";

const Home = () => {
  return (
    <>
      <Header />
      <Intro />
      <Banner />
      <CarrouselSection />
      <CardsHome /> 
      <EventSection />
      <ProductHighlight />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;
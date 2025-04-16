// src/pages/Home.jsx
import Header from "../components/Header";
import Intro from "../components/Intro";
import Banner from "../components/Banner";
import Perdidos from "../components/Perdidos";
import CarrouselSection from "../components/CarrouselSection";
import ProductHighlight from "../components/ProductHighlight";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <Intro />
      <Banner />
      <CarrouselSection />
      <Perdidos />
      <ProductHighlight />
      <CallToAction />
      <Footer />
    </>
  );
};

export default Home;
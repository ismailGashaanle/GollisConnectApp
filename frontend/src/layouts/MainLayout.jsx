import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 
// pages/_app.js
import '../../styles/globals.css';  // Adjust the path as needed
import '../../styles/Slideshow.css';
import '../../styles/Filter.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

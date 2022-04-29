import "bootstrap/dist/css/bootstrap.css";
import axiosClient from "../api";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // appContext = [Component, ctx]
  console.log("AppComponent getInitialProps!");
  const { data } = await axiosClient(appContext.ctx).get(
    "/api/users/currentuser"
  );

  let pageProps;
  if (appContext.Component.getInitialProps)
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;

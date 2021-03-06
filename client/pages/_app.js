import "bootstrap/dist/css/bootstrap.css";
import axiosClient from "../api";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // appContext = [Component, ctx]
  console.log("@gittix/client starting up..");
  const client = axiosClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps;
  if (appContext.Component.getInitialProps)
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;

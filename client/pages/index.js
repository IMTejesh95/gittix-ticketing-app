import axiosClient from "../api";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("LandingPage getInitialProps!");
  const { data } = await axiosClient(context).get("/api/users/currentuser");
  return data;
};

export default LandingPage;

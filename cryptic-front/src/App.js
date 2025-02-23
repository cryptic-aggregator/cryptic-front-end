import Home from "./pages/home/Home.js";
import SignUp from "./pages/signUp/SignUp.js";
import SignIn from "./pages/signIn/SignIn.js";
import "./styles/styles.css";

function App() {
  let component
  switch (window.location.pathname){
    case "/":
      component = <Home />
      break
    case "/signup":
      component = <SignUp />
      break
    case "/signin":
      component = <SignIn />
      break
  }
  return (
    <>
      {component}
    </>
  );
}

export default App;

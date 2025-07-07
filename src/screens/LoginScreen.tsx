import AuthenticateScreenWapper from "../components/layout/AuthenticateScreenWapper";
import InstractionComponent from "../components/authscreencomponents/InstractionComponent";
import LoginComponent from "../components/authscreencomponents/LoginComponent";
import { Instractions } from "../data/instractions";



const LoginScreen = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AuthenticateScreenWapper
        leftElement={<InstractionComponent data={Instractions} />}
        rightElement={<LoginComponent />}
      />
    </div>
  );
};

export default LoginScreen;

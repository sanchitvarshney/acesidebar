import AuthenticateScreenWapper from "../components/layout/AuthenticateScreenWapper";
import InstractionComponent from "../components/authscreencomponents/InstractionComponent";
import LoginComponent from "../components/authscreencomponents/LoginComponent";

const Instractions = [
  {
    id: 1,
    des: "Enter your company email (e.g., john.doe@dummycorp.com).",
  },
  {
    id: 2,
    des: 'Type your password – use "Show Password" to check it if needed.',
  },
  {
    id: 3,
    des: "Click the “Login” button to access your account.",
  },
  {
    id: 4,
    des: "Forgot your password? Click “Forgot Password?” to reset it.",
  },
];

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

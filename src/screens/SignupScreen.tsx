import React from 'react'
import AuthenticateScreenWapper from '../components/layout/AuthenticateScreenWapper'
import InstractionComponent from '../components/authscreencomponents/InstractionComponent'
import SignUpComponent from '../components/authscreencomponents/SignUpComponent'



const SignUpInstructions = [
  {
    id: 1,
    des: "Enter your full name as it appears on your official documents.",
  },
  {
    id: 2,
    des: "Provide a valid email address (e.g., john.doe@example.com).",
  },
  {
    id: 3,
    des: "Enter your mobile number with country code (e.g., +1 123 456 7890).",
  },
  {
    id: 4,
    des: 'Create a secure password – use "Show Password" to verify it.',
  },
  {
    id: 5,
    des: "Confirm your password by entering it again.",
  },
];


const SignupScreen = () => {
  return (
     <div style={{height:"100vh", width:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
    <AuthenticateScreenWapper leftElement={<InstractionComponent data={SignUpInstructions} />} rightElement={<SignUpComponent />} />
    </div>
  )
}

export default SignupScreen
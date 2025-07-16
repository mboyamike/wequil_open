import { LoginFooter } from "~/components/login/login-footer";
import { LoginMain } from "~/components/login/login-main";

export default function Login() {
  return (
    <div className='grid min-h-screen grid-rows-[1fr,auto]'>
      <LoginMain />
      <LoginFooter />
    </div>
  );
}
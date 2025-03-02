import Form from "../login/Form";
import logo from '../../assets/logo.png'

const Login = () => {
  return (
    <div className="grid place-items-center h-screen bg-[#F9FAFB]">
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={logo}
              alt="logo"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
          </div>
          {/* form component */}
          <Form />
        </div>
      </div>
    </div>
  );
};

export default Login;

import SignInForm from "./SigninForm";


export const metadata = {
  title: "SignIn",
};

export default function Page() {
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">Sign In</h2>
      <SignInForm />
    </div>
  );
}

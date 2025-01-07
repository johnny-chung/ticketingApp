import SignUpForm from "./SignupForm";

export const metadata = {
  title: "Signup",
};

export default function Page() {
  return (
    <div className="flex flex-col gap-10 mt-10 items-center">
      <h2 className="text-3xl font-semibold">Sign up</h2>
      <SignUpForm />
    </div>
  );
}

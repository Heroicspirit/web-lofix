import LoginForm from "../_components/LoginForm";

export default function LoginPage() {
return (
    <>
    <div className="flex flex-col items-center space-y-2 text-center mb-4">
        <div className="flex items-center gap-2 text-primary">
        <div className="bg-purple-600 p-1.5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
        </div>
        <span className="font-bold text-xl text-purple-600">Lofix</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-black dark:text-dark-100">
        Login to your account
        </h1>
    </div>

    <LoginForm />
    </>
  );
}
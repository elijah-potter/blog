import { signIn } from "../src/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github")
      }}
    >
      <button type="submit">Sign in with GitHub</button>
    </form>
  )
} 

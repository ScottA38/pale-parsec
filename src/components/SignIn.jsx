import { useStore } from "@nanostores/react";
import { $clerkStore } from "@clerk/astro/client";

export default function SignIn() {
  const clerk = useStore($clerkStore);

  return <button onClick={() => clerk.openSignin()}>Sign In</button>
}
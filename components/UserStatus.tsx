import { auth } from "../src/auth"
import SignIn from "./SignIn"
import UserAvatar from "./UserAvatar";
 
/** Shows the user's avatar if signed in, shows the sign in button otherwise. */
export default async function UserStatus() {
  const session = await auth()
 
  if (!session?.user) {
    return SignIn();
  }
  else {
    return await UserAvatar();
  }
}

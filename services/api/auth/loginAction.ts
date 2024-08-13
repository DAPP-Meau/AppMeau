import { LoginFields } from "@/components/organisms/LoginForm"
import { Auth, signInWithEmailAndPassword } from "firebase/auth"
import { UseFormReturn } from "react-hook-form"

/**
 * Faz o login de usuário no firebase.
 *
 * @param form O formulário gerado pelo gancho useHook do react-hook-form.
 * @param auth O objeto de autorização do firebase.
 */
export async function loginAction(
  form: UseFormReturn<LoginFields>,
  auth: Auth,
): Promise<void> {
  const fields = form.getValues()
  const { email, password } = fields
  await signInWithEmailAndPassword(auth, email, password)
}

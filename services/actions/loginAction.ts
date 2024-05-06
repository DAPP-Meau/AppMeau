import { LoginFields } from "@/components/completedForms/LoginForm";
import {
  Auth,
  AuthErrorCodes,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { UseFormReturn } from "react-hook-form";

/**
 * Faz o login de usuário no firebase.
 *
 * @param auth O objeto de autorização do firebase.
 * @param fields Os campos do formulário de login.
 * @param form O formulário gerado pelo gancho useHook do react-hook-form.
 */
export async function loginAction(
  auth: Auth,
  fields: LoginFields,
  form: UseFormReturn<LoginFields, any, undefined>
): Promise<void> {
  try {
    const { username, password } = fields;
    const userCredential = await signInWithEmailAndPassword(
      auth,
      username,
      password
    );
    alert("Bem vindo!");
    form.reset();
    // TODO: Navegação, permanência de credenciais, etc...
  } catch (error: any) {
    if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
      alert("Sua senha ou seu e-mail estão errados. Tente novamente");
      form.setError("username", {
        type: "custom",
        message: "Seu email pode estar errado.",
      });
      form.setError("password", {
        type: "custom",
        message: "Sua senha pode estar errada.",
      });
      form.setFocus("password");
    } else {
      console.log({ error });
      throw error;
    }
  }
}

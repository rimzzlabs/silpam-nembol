import { SignInForm } from "../components/signin-form";
import { ContainerForm } from "../components/container-form";

export default function SignIn() {
  return (
    <ContainerForm
      title="Masuk"
      description="Masuk ke SILPAM Nembol"
      button={{ label: "Belum punya akun? daftar", href: "/auth/signup" }}
    >
      <SignInForm />
    </ContainerForm>
  );
}

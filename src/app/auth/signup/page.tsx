import { ContainerForm } from "../components/container-form";
import { SignUpForm } from "../components/signup-form";

export default function SignUp() {
  return (
    <ContainerForm
      title="Daftar"
      description="Daftar ke SILPAM Nembol"
      button={{ label: "Sudah punya akun? masuk", href: "/auth/signin" }}
    >
      <SignUpForm />
    </ContainerForm>
  );
}

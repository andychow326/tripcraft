import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { AuthContext } from "../providers/AuthProvider";
import useMutateAuthLogin from "../queries/useMutateAuthLogin";
import { AppModalContext } from "../providers/AppModalProvider";

const LoginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const LoginModal: React.FC<LoginModalProps> = (props) => {
  const { isOpen, onClose, onOpenChange } = props;
  const { t } = useTranslation();
  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);
  const { onOpenSignupModal } = useContext(AppModalContext);
  const { authenticate } = useContext(AuthContext);

  const { handleSubmit, register, reset, formState } = useForm<LoginFormValues>(
    { resolver: zodResolver(LoginFormSchema) },
  );

  const { mutateAsync: login, isPending: isPendingLogin } =
    useMutateAuthLogin();

  const toggleVisibilityPassword = useCallback(() => {
    setIsVisiblePassword((value) => !value);
  }, []);

  const onValidSubmit = useCallback(
    async (data: LoginFormValues) => {
      try {
        const response = await login({
          email: data.email,
          password: data.password,
        });
        authenticate(response.accessToken);
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [authenticate, login, onClose],
  );

  const onClickSignup = useCallback(() => {
    onClose();
    onOpenSignupModal();
  }, [onClose, onOpenSignupModal]);

  useEffect(() => {
    reset();
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        <ModalHeader>{t("LoginModal.header")}</ModalHeader>
        <form onSubmit={handleSubmit(onValidSubmit)}>
          <ModalBody>
            <Input
              {...register("email")}
              autoFocus
              label={t("LoginModal.body.input.email.label")}
              placeholder={t("LoginModal.body.input.email.placeholder")}
              variant="bordered"
              isInvalid={formState.errors.email != null}
              errorMessage={formState.errors.email?.message}
            />
            <Input
              {...register("password")}
              label={t("LoginModal.body.input.password.label")}
              placeholder={t("LoginModal.body.input.password.placeholder")}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibilityPassword}
                >
                  {isVisiblePassword ? (
                    <IconEye className="text-default-400" />
                  ) : (
                    <IconEyeOff className="text-default-400" />
                  )}
                </button>
              }
              variant="bordered"
              type={isVisiblePassword ? "text" : "password"}
              isInvalid={formState.errors.password != null}
              errorMessage={formState.errors.password?.message}
            />
            <Button color="primary" type="submit" isLoading={isPendingLogin}>
              {t("LoginModal.body.button.login.label")}
            </Button>
            <Link color="primary" href="#" className="self-end">
              {t("LoginModal.body.button.forgot_password.label")}
            </Link>
          </ModalBody>
        </form>
        <ModalFooter className="justify-center">
          <span>{t("LoginModal.footer.button.signup.hint")}</span>
          <Link color="primary" href="#" onPress={onClickSignup}>
            {t("LoginModal.footer.button.signup.label")}
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;

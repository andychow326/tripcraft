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
import {
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useMutateAuthSignup from "../queries/useMutateAuthSignup";
import { AuthContext } from "../providers/AuthProvider";
import { AppModalContext } from "../providers/AppModalProvider";

const SignupFormSchema = z
  .object({
    name: z.string().min(4).max(16),
    email: z.string().email(),
    password: z.string().min(6).max(32),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    params: { i18n: { key: "mismatch_passwords" } },
  });

type SignupFormValues = z.infer<typeof SignupFormSchema>;

interface SignupModalProps {
  isDismissable?: boolean;
  hideCloseButton?: boolean;
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}

const SignupModal: React.FC<SignupModalProps> = (props) => {
  const { isDismissable, hideCloseButton, isOpen, onClose, onOpenChange } =
    props;
  const { t } = useTranslation();
  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);
  const [isCorrectPasswordConfirm, setIsCorrectVisiblePasswordConfirm] =
    useState<boolean>(false);
  const { authenticate } = useContext(AuthContext);
  const { onOpenLoginModal } = useContext(AppModalContext);

  const { handleSubmit, register, reset, formState, watch } =
    useForm<SignupFormValues>({
      resolver: zodResolver(SignupFormSchema),
    });
  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");

  const { mutateAsync: signup, isPending: isPendingSignup } =
    useMutateAuthSignup();

  const toggleVisibilityPassword = useCallback(() => {
    setIsVisiblePassword((value) => !value);
  }, []);

  const onValidSubmit = useCallback(
    async (data: SignupFormValues) => {
      try {
        const response = await signup({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        authenticate(response.accessToken);
        onClose();
      } catch (error) {
        console.error(error);
      }
    },
    [authenticate, onClose, signup],
  );

  const onClickLogin = useCallback(() => {
    onClose();
    onOpenLoginModal();
  }, [onClose, onOpenLoginModal]);

  useEffect(() => {
    reset();
  }, [isOpen, reset]);

  useEffect(() => {
    if (password != "" && password === passwordConfirm) {
      setIsCorrectVisiblePasswordConfirm(true);
    } else {
      setIsCorrectVisiblePasswordConfirm(false);
    }
  }, [password, passwordConfirm]);

  return (
    <Modal
      isDismissable={isDismissable}
      hideCloseButton={hideCloseButton}
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        <ModalHeader>{t("SignupModal.header")}</ModalHeader>
        <form onSubmit={handleSubmit(onValidSubmit)}>
          <ModalBody>
            <Input
              {...register("name")}
              autoFocus
              label={t("SignupModal.body.input.username.label")}
              placeholder={t("SignupModal.body.input.username.placeholder")}
              variant="bordered"
              isInvalid={formState.errors.name != null}
              errorMessage={formState.errors.name?.message}
            />
            <Input
              {...register("email")}
              label={t("SignupModal.body.input.email.label")}
              placeholder={t("SignupModal.body.input.email.placeholder")}
              variant="bordered"
              isInvalid={formState.errors.email != null}
              errorMessage={formState.errors.email?.message}
            />
            <Input
              {...register("password")}
              label={t("SignupModal.body.input.password.label")}
              placeholder={t("SignupModal.body.input.password.placeholder")}
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
            <Input
              {...register("passwordConfirm")}
              label={t("SignupModal.body.input.password_confirm.label")}
              placeholder={t(
                "SignupModal.body.input.password_confirm.placeholder",
              )}
              endContent={
                isCorrectPasswordConfirm ? (
                  <IconCircleCheck className="text-green-500" />
                ) : (
                  <IconCircleX className="text-red-500" />
                )
              }
              variant="bordered"
              type="password"
              isInvalid={formState.errors.passwordConfirm != null}
              errorMessage={formState.errors.passwordConfirm?.message}
            />
            <Button color="primary" type="submit" isLoading={isPendingSignup}>
              {t("SignupModal.body.button.signup.label")}
            </Button>
          </ModalBody>
        </form>
        <ModalFooter className="justify-center">
          <span>{t("SignupModal.footer.button.login.hint")}</span>
          <Link color="primary" href="#" onPress={onClickLogin}>
            {t("SignupModal.footer.button.login.label")}
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;

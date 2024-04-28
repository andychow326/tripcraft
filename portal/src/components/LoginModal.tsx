import {
  Button,
  Checkbox,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

const LoginModal: React.FC<LoginModalProps> = (props) => {
  const { isOpen, onOpenChange } = props;
  const { t } = useTranslation();
  const [isVisiblePassword, setIsVisiblePassword] = useState<boolean>(false);
  const [isRememberMeEnabled, setIsRememberMeEnabled] =
    useState<boolean>(false);

  const toggleVisibilityPassword = useCallback(() => {
    setIsVisiblePassword((value) => !value);
  }, []);

  const onClickLoginButton = useCallback(
    (callback: () => void) => () => {
      callback();
    },
    [],
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{t("LoginModal.header")}</ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                label={t("LoginModal.body.input.username.label")}
                placeholder={t("LoginModal.body.input.username.placeholder")}
                variant="bordered"
              />
              <Input
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
              />
              <Checkbox
                isSelected={isRememberMeEnabled}
                onValueChange={setIsRememberMeEnabled}
              >
                {t("LoginModal.body.checkbox.remember_me.label")}
              </Checkbox>
              <Button color="primary" onPress={onClickLoginButton(onClose)}>
                {t("LoginModal.body.button.login.label")}
              </Button>
              <Link color="primary" href="#" className="self-end">
                {t("LoginModal.body.button.forgot_password.label")}
              </Link>
            </ModalBody>
            <ModalFooter className="justify-center">
              <span>{t("LoginModal.footer.button.signup.hint")}</span>
              <Link color="primary" href="#">
                {t("LoginModal.footer.button.signup.label")}
              </Link>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;

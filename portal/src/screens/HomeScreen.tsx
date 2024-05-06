import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import { Button } from "@nextui-org/react";
import { AuthContext } from "../providers/AuthProvider";
import { AppModalContext } from "../providers/AppModalProvider";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { onOpenLoginModal } = useContext(AppModalContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const onClickStartPlanningButton = useCallback(() => {
    if (!isAuthenticated) {
      onOpenLoginModal();
    } else {
      navigate(AppRoutes.PlanCreateScreen.path);
    }
  }, [isAuthenticated, navigate, onOpenLoginModal]);

  return (
    <div className="flex flex-col divide-y-1 divide-black">
      <div className={cn("p-4 flex flex-col gap-8 bg-yellow-100", "sm:p-8")}>
        <h1 className={cn("text-2xl font-black", "sm:text-4xl")}>
          {t("HomeScreen.campaign.header")}
        </h1>
        <p
          className={cn(
            "whitespace-pre-line text-lg font-semibold leading-loose",
            "sm:text-xl",
          )}
        >
          {t("HomeScreen.campaign.content")}
        </p>
        <Button
          color="primary"
          className="w-1/4 h-16 text-xl font-semibold"
          onPress={onClickStartPlanningButton}
        >
          {t("HomeScreen.campaign.button.start_planning")}
        </Button>
      </div>
    </div>
  );
};

export default HomeScreen;

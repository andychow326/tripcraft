import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@nextui-org/react";
import { AuthContext } from "../providers/AuthProvider";
import { AppModalContext } from "../providers/AppModalProvider";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";
import useQueryPlans from "../queries/useQueryPlans";

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const { onOpenLoginModal } = useContext(AppModalContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: plans } = useQueryPlans();

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
          className="w-full h-16 text-xl font-semibold"
          onPress={onClickStartPlanningButton}
        >
          {t("HomeScreen.campaign.button.start_planning")}
        </Button>
      </div>
      {isAuthenticated && (
        <div className={cn("p-4 flex flex-col gap-8", "sm:p-8")}>
          <h1 className={cn("text-2xl font-black", "sm:text-4xl")}>
            {t("HomeScreen.my_plans.header")}
          </h1>
          <div className="flex flex-wrap gap-4">
            {plans?.results.map((plan) => (
              <Card
                key={plan.id}
                as="a"
                href={AppRoutes.PlanScreen.render(plan.id)}
              >
                <CardHeader className={cn("text-lg font-medium", "sm:text-xl")}>
                  {plan.name}
                </CardHeader>
                <CardBody></CardBody>
                <CardFooter>
                  {plan.config.dateStart} - {plan.config.dateEnd}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;

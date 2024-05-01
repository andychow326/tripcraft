import React from "react";
import { IconGps } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import cn from "classnames";

const HomeScreen: React.FC = () => {
  const { t } = useTranslation();

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
      </div>
      <div className={cn("p-4 flex flex-col gap-4", "sm:p-8")}>
        <h1 className={cn("text-2xl font-black", "sm:text-4xl")}>
          {t("HomeScreen.explore.header")}
        </h1>
        <div className="flex flex-row gap-2 items-center">
          <IconGps className={cn("w-6 h-6", "sm:w-8 sm:h-8")} />
          <span className={cn("text-xl font-semibold", "sm:text-2xl")}>
            {t("HomeScreen.explore.popular.header")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;

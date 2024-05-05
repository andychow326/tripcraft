import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import cn from "classnames";
import {
  Button,
  Card,
  CardBody,
  DateValue,
  Divider,
  Input,
} from "@nextui-org/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { today, getLocalTimeZone } from "@internationalized/date";
import { z } from "zod";
import DateRangeCalendar from "../components/DateRangeCalendar";
import useMutatePlan from "../queries/useMutatePlan";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../AppRoutes";

const PlanCreateFormSchema = z
  .object({
    name: z.string().min(4),
    date: z
      .object({
        start: z.custom<DateValue>(),
        end: z.custom<DateValue>(),
      })
      .optional(),
  })
  .refine((data) => data.date?.start != null && data.date?.end != null, {
    path: ["date"],
    params: {
      i18n: { key: "empty_date" },
    },
  });

type PlanCreateFormValues = z.infer<typeof PlanCreateFormSchema>;

const PlanCreateScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync: mutatePlan, isPending } = useMutatePlan();

  const { handleSubmit, setValue, clearErrors, register, watch, formState } =
    useForm<PlanCreateFormValues>({
      resolver: zodResolver(PlanCreateFormSchema),
    });
  const date = watch("date");

  const onValidSubmit = useCallback(
    async (value: PlanCreateFormValues) => {
      if (value.date == null) {
        return;
      }
      try {
        const plan = await mutatePlan({
          name: value.name,
          config: {
            dateStart: value.date.start.toString(),
            dateEnd: value.date.end.toString(),
          },
        });
        navigate(
          AppRoutes.PlanScreen.render(plan.id, value.date.start.toString()),
        );
      } catch (e) {
        console.error(e);
      }
    },
    [mutatePlan, navigate],
  );

  return (
    <div className="flex flex-col items-center w-full mt-4">
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onValidSubmit)}
      >
        <h1 className={cn("text-2xl font-black text-center", "sm:text-4xl")}>
          {t("PlanCreateScreen.header")}
        </h1>
        <Input
          {...register("name")}
          autoFocus
          label={t("PlanCreateScreen.input.name.label")}
          variant="bordered"
          isInvalid={formState.errors.name != null}
          errorMessage={formState.errors.name?.message}
        />
        <Card>
          <CardBody>
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="sm:text-start sm:block w-full flex flex-row justify-between items-center">
                <p className="text-lg font-medium">
                  {t("PlanCreateScreen.input.date.depart.label")}
                </p>
                <p>
                  {date?.start?.toString() ??
                    t("PlanCreateScreen.input.date.depart.placeholder")}
                </p>
              </div>
              <div className="w-full">
                <span className="hidden sm:block text-center">-</span>
                <Divider className="sm:hidden block my-4" />
              </div>
              <div className="sm:text-end sm:block w-full flex flex-row justify-between items-center">
                <p className="text-lg font-medium">
                  {t("PlanCreateScreen.input.date.return.label")}
                </p>
                <p>
                  {date?.end?.toString() ??
                    t("PlanCreateScreen.input.date.return.placeholder")}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
        <DateRangeCalendar
          {...register("date")}
          className="self-center"
          onChange={(e) => {
            clearErrors("date");
            setValue("date.start", e.start);
            setValue("date.end", e.end);
          }}
          minValue={today(getLocalTimeZone())}
          value={
            date?.start != null && date?.end != null
              ? {
                  start: date?.start,
                  end: date?.end,
                }
              : undefined
          }
          isInvalid={formState.errors.date != null}
          errorMessage={formState.errors.date?.message}
        />
        <Button type="submit" isLoading={isPending}>
          {t("PlanCreateScreen.button.submit.label")}
        </Button>
      </form>
    </div>
  );
};

export default PlanCreateScreen;

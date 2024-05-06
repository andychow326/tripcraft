import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
import { useTranslation } from "react-i18next";
import { Key } from "@react-types/shared";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import cn from "classnames";
import useQueryPlanDetail from "../queries/useQueryPlanDetail";
import { AppLocaleContext } from "../providers/AppLocaleProvider";
import { IconArrowLeft, IconPencil, IconPlus } from "@tabler/icons-react";
import useQueryWorldState from "../queries/useQueryWorldState";
import { useDebounce } from "@uidotdev/usehooks";
import { StateSchema } from "../../generated";
import useMutatePlanDetail from "../queries/useMutatePlanDetail";

const PlanScreen: React.FC = () => {
  const { t } = useTranslation();
  const { translate, localeString } = useContext(AppLocaleContext);
  const { planId } = useParams() as { planId: string };
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isOpen: isOpenDestinationModal,
    onOpenChange: onOpenChangeDestinationModal,
  } = useDisclosure();
  const [worldStateQuery, setWorldStateQuery] = useState<string>("");
  const _worldStateQuery = useDebounce(worldStateQuery, 500);
  const [selectedDestinations, setSelectedDestinations] = useState<
    StateSchema[]
  >([]);
  const {
    isOpen: isOpenDestinationAutoComplete,
    onOpenChange: onOpenChangeDestinationAutoComplete,
  } = useDisclosure();

  const {
    data: planData,
    isLoading: isLoadingPlanData,
    refetch: refetchPlanData,
  } = useQueryPlanDetail(planId);
  const {
    data: _worldStateData,
    hasNextPage: hasMoreWorldStateData,
    fetchNextPage: onLoadMoreWorldStateData,
    isFetching: isFetchingWorldStateData,
  } = useQueryWorldState(_worldStateQuery);
  const worldStateData = useMemo(
    () => _worldStateData?.pages.flatMap((data) => data.results),
    [_worldStateData?.pages],
  );

  useEffect(() => {}, []);

  const {
    mutateAsync: mutatePlanDetail,
    isPending: isPendingMutatePlanDetail,
  } = useMutatePlanDetail(planId);

  const [, scrollerRef] = useInfiniteScroll({
    hasMore: !isFetchingWorldStateData && hasMoreWorldStateData,
    isEnabled: isOpenDestinationAutoComplete,
    shouldUseLoader: false,
    onLoadMore: onLoadMoreWorldStateData,
  });

  const detailDatePanelRef = useRef<HTMLDivElement>(null);

  const onClickPlanDetail = useCallback(
    (date: string) => () => {
      setSearchParams({
        date: date,
      });
    },
    [setSearchParams],
  );

  const onClickBackButton = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const onAddDestination = useCallback(
    (id: number) => {
      if (worldStateData == null) {
        return;
      }
      setSelectedDestinations((states) => [
        ...states.filter((state) => state.id !== id),
        ...worldStateData.filter((state) => state.id === id),
      ]);
    },
    [worldStateData],
  );

  const onSelectDestination = useCallback(
    (id: Key) => {
      onAddDestination(Number(id));
      setWorldStateQuery("");
    },
    [onAddDestination],
  );

  const getDestinationName = useCallback(
    (destination: StateSchema) => {
      return (
        destination.country.emoji +
        " " +
        [translate(destination.name), translate(destination.country.name)].join(
          ", ",
        )
      );
    },
    [translate],
  );

  const onInputChangeWorldState = useCallback((value: string) => {
    setWorldStateQuery(value);
  }, []);

  const onConfirmSelectDestinationModal = useCallback(
    (date: string) => async () => {
      if (planData == null || selectedDestinations.length === 0) {
        return;
      }
      try {
        await mutatePlanDetail({
          ...planData,
          config: {
            ...planData.config,
            details: [
              {
                date: date,
                destinations: selectedDestinations.map((destination) => ({
                  type: "state",
                  id: destination.id,
                })),
                schedules: [],
              },
            ],
          },
        });
        refetchPlanData();
        setSelectedDestinations([]);
        onOpenChangeDestinationModal();
      } catch (err) {
        console.error(err);
      }
    },
    [
      mutatePlanDetail,
      onOpenChangeDestinationModal,
      planData,
      refetchPlanData,
      selectedDestinations,
    ],
  );

  if (isLoadingPlanData) {
    return (
      <Spinner className="absolute top-1/2 left-1/2 transform" size="lg" />
    );
  }

  if (planData == null) {
    return (
      <div className="flex flex-col items-center w-full mt-4">
        <h1 className={cn("text-2xl font-black text-center", "sm:text-4xl")}>
          {t("PlanScreen.plan_not_found")}
        </h1>
      </div>
    );
  }

  if (searchParams.get("date") != null && planData.config.details != null) {
    const date = searchParams.get("date");
    const detail = planData.config.details.find(
      (detail) => detail.date === date,
    );
    if (detail != null) {
      const index = planData.config.details.indexOf(detail);
      detailDatePanelRef.current?.scrollTo({
        top: 64 * index - (detailDatePanelRef.current.clientHeight * 1) / 3,
        behavior: "smooth",
      });

      return (
        <div className="flex flex-col w-full pt-4 gap-2 divide-y-1 divide-black h-full overflow-hidden">
          <div className="flex flex-row items-center px-4">
            <Button
              startContent={<IconArrowLeft />}
              onPress={onClickBackButton}
            >
              <span>{t("PlanScreen.detail.button.back")}</span>
            </Button>
          </div>
          <div className="flex flex-row divide-x-1 divide-black h-full">
            <div
              ref={detailDatePanelRef}
              className="min-w-56 text-lg overflow-auto"
            >
              {planData.config.details.map((d) => (
                <div
                  key={d.date}
                  onClick={onClickPlanDetail(d.date)}
                  className={cn(
                    "flex flex-row justify-between items-center px-4 h-16 border-b-1 border-black hover:cursor-pointer",
                    d.date === date && "bg-blue-100",
                  )}
                >
                  <div>{d.date}</div>
                  <div>
                    (
                    {new Date(d.date).toLocaleString(localeString, {
                      weekday: "short",
                    })}
                    )
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full h-full flex flex-col divide-y-1 divide-black">
              <div className="flex flex-col pl-8 py-4 gap-4">
                <h1 className={cn("text-2xl font-black", "sm:text-4xl")}>
                  {t("PlanScreen.detail.content.header", { day: index + 1 })}
                </h1>
                <span className={cn("text-xl font-semibold", "sm:text-2xl")}>
                  {detail.date}
                </span>
                <div className="flex flex-row items-center gap-4">
                  <span className={cn("text-lg font-normal", "sm:text-xl")}>
                    {detail.destinations
                      .map((destination) => translate(destination.name))
                      .join(" -> ") || "-"}
                  </span>
                  {planData.isEditable && (
                    <Button
                      isIconOnly
                      variant="light"
                      onPress={onOpenChangeDestinationModal}
                    >
                      <IconPencil />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4 py-2 px-4">
                {planData.isEditable && (
                  <Button startContent={<IconPlus />}>
                    {t("PlanScreen.detail.schedule.button.add.label")}
                  </Button>
                )}
                {detail.schedules.map((schedule) => (
                  <Card
                    key={`${schedule.place}-${schedule.timeStart}-${schedule.timeEnd}`}
                  >
                    <CardHeader></CardHeader>
                    <CardBody></CardBody>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <Modal
            isOpen={isOpenDestinationModal || detail.destinations.length === 0}
            onOpenChange={onOpenChangeDestinationModal}
          >
            <ModalContent>
              <ModalHeader>
                {t("PlanScreen.detail.modal.destination.header")}
              </ModalHeader>
              <ModalBody>
                <Autocomplete
                  autoFocus
                  label={
                    selectedDestinations.length === 0
                      ? t(
                          "PlanScreen.detail.modal.destination.search.from.label",
                        )
                      : t("PlanScreen.detail.modal.destination.search.to.label")
                  }
                  placeholder={
                    selectedDestinations.length === 0
                      ? t(
                          "PlanScreen.detail.modal.destination.search.from.placeholder",
                        )
                      : t(
                          "PlanScreen.detail.modal.destination.search.to.placeholder",
                        )
                  }
                  inputValue={worldStateQuery}
                  isLoading={
                    isFetchingWorldStateData ||
                    worldStateQuery !== _worldStateQuery
                  }
                  scrollRef={scrollerRef}
                  onOpenChange={onOpenChangeDestinationAutoComplete}
                  defaultItems={worldStateData ?? []}
                  onInputChange={onInputChangeWorldState}
                  variant="bordered"
                  selectedKey={null}
                  onSelectionChange={onSelectDestination}
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {getDestinationName(item)}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {selectedDestinations.map((destination, index) => (
                  <div key={`selected-destination-${destination.id}`}>
                    {index === 0 && (
                      <p>
                        {t("PlanScreen.detail.modal.destination.from.label")}
                      </p>
                    )}
                    {index === 1 && (
                      <p>{t("PlanScreen.detail.modal.destination.to.label")}</p>
                    )}
                    <Chip radius="sm" size="lg">
                      {getDestinationName(destination)}
                    </Chip>
                  </div>
                ))}
                <Button
                  color="primary"
                  onPress={onConfirmSelectDestinationModal(detail.date)}
                  isLoading={isPendingMutatePlanDetail}
                >
                  {t(
                    "PlanScreen.detail.modal.destination.footer.button.confirm",
                  )}
                </Button>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col w-full p-4">
      <h1 className={cn("text-2xl font-black", "sm:text-4xl")}>
        {planData.name}
      </h1>
      <p className={cn("text-lg font-bold pt-8 pb-4", "sm:text-xl")}>
        {planData.config.dateStart} - {planData.config.dateEnd}
      </p>
      <div className="border-y-1 border-black divide-y-1 divide-black">
        {planData.config.details?.map((detail) => (
          <div
            key={detail.date}
            onClick={onClickPlanDetail(detail.date)}
            className="flex flex-row min-h-20 hover:cursor-pointer"
          >
            <div className="min-w-32">
              <p>{detail.date}</p>
              <p>
                {new Date(detail.date).toLocaleString(localeString, {
                  weekday: "short",
                })}
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <p className="font-bold min-h-8">
                {detail.destinations
                  .map((destination) => translate(destination.name))
                  .join(" -> ")}
              </p>
              <p className="min-h-8">
                {detail.schedules
                  .map((schedule) => schedule.place)
                  .join(" -> ")}
              </p>
              <p className="min-h-8 text-red-600 font-medium">
                {detail.destinationHolidays != null &&
                  Object.keys(detail.destinationHolidays).length !== 0 && (
                    <>
                      {t("PlanScreen.brief_table.holiday")} -{" "}
                      {Object.entries(detail.destinationHolidays)
                        .map(
                          ([key, value]) =>
                            translate(value) +
                            " (" +
                            translate(
                              detail.destinations.find(
                                (d) => d.countryIso2 === key,
                              )?.name,
                            ) +
                            ")",
                        )
                        .join(", ")}
                    </>
                  )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanScreen;

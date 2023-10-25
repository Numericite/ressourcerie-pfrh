import { Box, Button, Heading, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { fetchApi } from "../../../../utils/api/fetch-api";
import { TEvents } from "../../../api/events/types";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { GetServerSideProps } from "next";
import EventCard from "../../../../components/bo/events/EventCard";
import EventModal from "../../../../components/bo/events/EventModal";

interface EventsManagerProps {
  events: TEvents[];
}

const EventsManager = (props: EventsManagerProps) => {
  const events = props.events.map((event) => {
    return {
      title: event.title,
      start: new Date(event.start_date),
      external_link: event.external_link,
      end: new Date(event.end_date || event.start_date),
    };
  });
  const [displayEventModal, setDisplayEventModal] =
    React.useState<boolean>(false);

  const [eventsList, setEventsList] = React.useState<TEvents[]>(props.events);
  const toast = useToast();

  const [currentEvent, setCurrentEvent] = React.useState<any>(null);

  const onDragEnd = (
    title: string,
    oldDate: Date | null,
    newDate: Date | null,
    newEndDate: Date | null
  ) => {
    let tmpEventsList = [...eventsList];

    tmpEventsList.map((event) => {
      if (
        event.title === title &&
        event.start_date.split("T")[0] === oldDate?.toISOString().split("T")[0]
      ) {
        if (newDate) event.start_date = newDate.toISOString();
        if (newEndDate) event.end_date = newEndDate.toISOString();
        fetchApi
          .put("/api/events/update", event)
          .then((res) => {
            toast({
              title: "L'évenement a été mis à jour",
              description: event.title,
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            setEventsList(tmpEventsList);
          })
          .catch((err) => {
            toast({
              title: "Erreur lors de la mise à jour de l'évenement",
              description: err.message,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          });
      }
    });
  };

  const router = useRouter();

  const handleDeleteEvent = () => {
    return fetchApi
      .delete("/api/events/delete", {
        id: currentEvent.id as number,
      })
      .then((res) => {
        toast({
          title: "L'évenement a été supprimé",
          description: currentEvent.title,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setDisplayEventModal(false);
        router.reload();
        return res;
      })
      .catch((err) => {
        toast({
          title: "Erreur lors de la suppression de l'évenement",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleModaleClose = () => {
    setCurrentEvent(null);
    setDisplayEventModal(false);
  };

  return (
    <Box minW="full">
      {displayEventModal && (
        <EventModal
          event={currentEvent}
          open={displayEventModal}
          onClose={() => handleModaleClose()}
          onDelete={handleDeleteEvent}
        />
      )}

      <Heading size="lg" mb={5}>
        Gestion des évenements à venir :{" "}
      </Heading>
      <Button
        size="sm"
        mb={5}
        onClick={() => {
          setCurrentEvent({
            id: undefined,
            title: "",
            external_link: "",
            start_date: new Date(),
          });
          setDisplayEventModal(true);
        }}
      >
        Ajouter un évenement
      </Button>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale="fr"
        weekends={false}
        events={events}
        height="auto"
        eventClick={(info) => {
          if (info.event.start !== null && info.event.title) {
            let event = eventsList.find((event) => {
              if (
                event.title === info.event.title &&
                event.start_date.split("T")[0] ===
                  info.event.start?.toISOString().split("T")[0]
              ) {
                return event;
              }
            });
            setCurrentEvent(event);
            setDisplayEventModal(true);
          }
        }}
        handleWindowResize={true}
        nowIndicator={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth dayGridWeek dayGridDay",
        }}
        buttonText={{
          today: "Aujourd'hui",
          day: "Jour",
          week: "Semaine",
          month: "Mois",
        }}
        titleFormat={{ year: "numeric", month: "long" }}
        eventContent={(eventInfo) => {
          return (
            <EventCard event={eventInfo.event} currentEvent={currentEvent} />
          );
        }}
        eventStartEditable={true}
        eventDrop={(info) => {
          const { title, start: newStartDate, end: newEndDate } = info.event;
          const { start: OldDate } = info.oldEvent;
          onDragEnd(title, OldDate, newStartDate, newEndDate);
        }}
      />
    </Box>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const events = await fetchApi.get("/api/events/list").then((res) => {
    return res.data;
  });

  return {
    props: {
      events: (events as TEvents[]) || [],
    },
  };
};

export default EventsManager;

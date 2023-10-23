import { Box, Button, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { fetchApi } from "../../../../utils/api/fetch-api";
import { TEvents } from "../../../api/events/types";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import { GetServerSideProps } from "next";
import EventCard from "../../../../components/bo/events/EventCard";

interface EventsManagerProps {
  events: TEvents[];
}

const EventsManager = (props: EventsManagerProps) => {
  const events = props.events.map((event) => {
    return {
      title: event.title,
      start: new Date(event.start_date),
    };
  });

  const router = useRouter();

  return (
    <Box minW="full">
      <Heading size="lg" mb={5}>
        Gestion des évenements à venir :{" "}
      </Heading>
      <Button
        size="sm"
        mb={5}
        onClick={() => router.push("/dashboard/bo/events/new")}
      >
        Ajouter un évenement
      </Button>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale="fr"
        weekends={false}
        events={events}
        height="auto"
        selectable={true}
        select={(info) => {
          console.log(info);
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
          return <EventCard event={eventInfo.event} />;
        }}
        eventStartEditable={true}
        eventDragStop={(info) => {
          console.log(info);
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

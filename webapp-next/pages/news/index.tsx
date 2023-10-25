import { Box, Container, Text } from "@chakra-ui/react";
import EventListDisplay from "../../components/ui/events/EventListDisplay";
import { fetchApi } from "../../utils/api/fetch-api";
import { TEvents } from "../api/events/types";
import { TNewsLetter } from "../api/newsletters/types";
import _ from "lodash";
import NewsLetterDisplay from "../../components/ui/newsletter/NewsLetterDisplay";

interface ArticlesPageProps {
  events: TEvents[];
  newsletters: TNewsLetter[];
}

const Articles: React.FC<ArticlesPageProps> = (props) => {
  const { events, newsletters } = props;
  const newsLetterToDisplay = newsletters[0] || null;

  return (
    <>
      <EventListDisplay events={events} />

      {newsLetterToDisplay && (
        <NewsLetterDisplay newsletter={newsLetterToDisplay} />
      )}
    </>
  );
};

export const getServerSideProps = async () => {
  const today = new Date().toISOString().split("T")[0];

  const events = await fetchApi.get("/api/events/list", {
    pagination: {
      page: 1,
      pageSize: 20,
    },
    filters: {
      start_date: {
        $gte: today,
      },
    },
  });

  const newsletters = await fetchApi.get("/api/newsletters/list", {
    pagination: {
      page: 1,
      pageSize: 20,
    },
    sort: {
      createdAt: "desc",
    },
    populate: {
      ressources_list: { populate: ["ressource"] },
    },
    filters: {
      status: "sent",
    },
  });

  return {
    props: {
      events: events.data,
      newsletters: newsletters.data,
    },
  };
};

export default Articles;

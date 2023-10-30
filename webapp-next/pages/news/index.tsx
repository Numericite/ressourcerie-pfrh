import { Box, Container, Text } from "@chakra-ui/react";
import EventListDisplay from "../../components/ui/events/EventListDisplay";
import { fetchApi } from "../../utils/api/fetch-api";
import { TEvents } from "../api/events/types";
import { TNewsLetter } from "../api/newsletters/types";
import _ from "lodash";
import NewsLetterDisplay from "../../components/ui/newsletter/NewsLetterDisplay";
import NewsLetterList from "../../components/ui/newsletter/NewsLetterList";
import React from "react";
import Loader from "../../components/ui/loader";

interface ArticlesPageProps {
  events: TEvents[];
  newsletters: TNewsLetter[];
}

const Articles: React.FC<ArticlesPageProps> = (props) => {
  const { events, newsletters } = props;
  const [newsLetterToDisplay, setNewsLetterToDisplay] =
    React.useState<TNewsLetter | null>(newsletters[0] || null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleNewsLetterChange = (newsLetter: TNewsLetter) => {
    setLoading(true);
    setNewsLetterToDisplay(newsLetter);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (loading) return <Loader />;

  return (
    <>
      <EventListDisplay events={events} />
      {newsLetterToDisplay && (
        <>
          <NewsLetterDisplay newsletter={newsLetterToDisplay} />
          <NewsLetterList
            newsletters={newsletters.filter(
              (newsletter) => newsletter !== newsLetterToDisplay
            )}
            handleNewsLetterChange={handleNewsLetterChange}
          />
        </>
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

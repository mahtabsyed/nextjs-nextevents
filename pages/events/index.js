import { getAllEvents } from "../../helpers/api-util";
import EventList from "../../components/events/event-list";
import { Fragment } from "react";
import EventsSearch from "../../components/events/events-search";
import { useRouter } from "next/router";
import Head from "next/head";

function AllEventsPage(props) {
  const router = useRouter(props);
  const { events } = props;

  function findEventsHandler(year, month) {
    // programatically navigate
    const fullPath = `/events/${year}/${month}`;
    router.push(fullPath);
  }

  return (
    <Fragment>
      <Head>
        <title>All Events</title>
        <meta
          name="description"
          content="Find a lot of great events that allow you to evolve..."
        />
      </Head>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </Fragment>
  );
}

export async function getStaticProps() {
  const events = await getAllEvents();
  return {
    props: {
      events: events,
    },
    revalidate: 60,
  };
}

export default AllEventsPage;

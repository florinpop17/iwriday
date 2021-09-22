import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import InfiniteScroll from "react-infinite-scroll-component";


import Thread from "./Thread";

const Timeline = () => {
  const [threads, setThreads] = useState([]);
  const [count, setCount] = useState(0);

  const hasMore = threads.length < count - 1;

  // Parameter to set how many items you want to add on scroll
  const nbOfItems = 4

  useEffect(() => {
    fetchThreads(0,3);
  }, []);

  const fetchThreads = async (minRange, maxRange) => {
    if(maxRange > count) maxRange = count
    let {
      data: newThreads,
      error,
      count,
    } = await supabase
      .from("posts")
      .select(
        "id, full_text, date, url, word_count, public_users ( username ) ",
        { count: "exact" }
      )
      .range(minRange, maxRange)
      .order("date", { ascending: false });
    if (error) console.log("error", error);
    else {
      setThreads(prevThreads => [...prevThreads, ...newThreads]);
      setCount(count);
    }
  };

  return (
    <div>
      <InfiniteScroll
          dataLength={threads.length}
          next={() => fetchThreads(threads.length + 1, threads.length + nbOfItems)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
      {threads.map((thread) => (
        <Thread key={thread.id} thread={thread} />
      ))}
      </InfiniteScroll>
    </div>
  );
};

export default Timeline;

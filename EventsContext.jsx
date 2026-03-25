import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE_URL = "http://localhost:3000";

export const EventsContext = createContext(undefined);

const sortEventsByStartTime = (items) =>
  [...items].sort(
    (left, right) =>
      new Date(left.startTime).getTime() - new Date(right.startTime).getTime(),
  );

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const [eventsResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/events`),
        fetch(`${API_BASE_URL}/categories`),
      ]);

      if (!eventsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch event data.");
      }

      const [eventsData, categoriesData] = await Promise.all([
        eventsResponse.json(),
        categoriesResponse.json(),
      ]);

      setEvents(sortEventsByStartTime(eventsData));
      setCategories(categoriesData);
    } catch (fetchError) {
      setError(fetchError.message || "Failed to fetch event data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createEvent = useCallback(async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to create event.");
    }

    const createdEvent = await response.json();

    setEvents((currentEvents) =>
      sortEventsByStartTime([...currentEvents, createdEvent]),
    );

    return createdEvent;
  }, []);

  const updateEvent = useCallback(async (eventId, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to update event.");
    }

    const updatedEvent = await response.json();

    setEvents((currentEvents) =>
      sortEventsByStartTime(
        currentEvents.map((event) =>
          event.id === eventId ? updatedEvent : event,
        ),
      ),
    );

    return updatedEvent;
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete event.");
    }

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== eventId),
    );
  }, []);

  const getCategoryName = useCallback(
    (categoryId) =>
      categories.find((category) => category.id === categoryId)?.name ??
      "Unknown category",
    [categories],
  );

  const getCategoryNames = useCallback(
    (categoryIds = []) => categoryIds.map(getCategoryName),
    [getCategoryName],
  );

  const value = useMemo(
    () => ({
      events,
      categories,
      isLoading,
      error,
      fetchData,
      createEvent,
      updateEvent,
      deleteEvent,
      getCategoryName,
      getCategoryNames,
      isAddModalOpen,
      setIsAddModalOpen,
    }),
    [
      events,
      categories,
      isLoading,
      error,
      fetchData,
      createEvent,
      updateEvent,
      deleteEvent,
      getCategoryName,
      getCategoryNames,
      isAddModalOpen,
      setIsAddModalOpen,
    ],
  );

  return (
    <EventsContext.Provider value={value}>{children}</EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider.");
  }

  return context;
};

export { API_BASE_URL };

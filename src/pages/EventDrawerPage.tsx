import React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Chip,
    IconButton,
    FormControl,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    Slide,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import StarIcon from "@mui/icons-material/Star";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PublicIcon from "@mui/icons-material/Public";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TimezoneSelect, { type ITimezone } from "react-timezone-select";
import CustomSideBarPanel from "../components/reusable/CustomSideBarPanel";
import timerGif from "../assets/icons/timer.gif";

const timeSlots = ["10:00am", "11:00am", "1:00pm", "2:30pm", "4:00pm"];

type CalendarEvent = {
  id: string;
  title: string;
  location: string;
  start: Date;
  end: Date;
  category: "meeting" | "call" | "review" | "deadline" | "workshop";
};

interface EventDrawerPageProps {
    open: boolean;
    onClose: () => void;
}

const EventDrawerPage: React.FC<EventDrawerPageProps> = ({ open, onClose }) => {
    const today = React.useMemo(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    }, []);

    const maxDate = React.useMemo(() => {
        const future = new Date(today);
        future.setMonth(future.getMonth() + 6);
        future.setHours(0, 0, 0, 0);
        return future;
    }, [today]);

    const minMonth = React.useMemo(
        () => new Date(today.getFullYear(), today.getMonth(), 1),
        [today]
    );

    const maxMonth = React.useMemo(
        () => new Date(maxDate.getFullYear(), maxDate.getMonth(), 1),
        [maxDate]
    );

    const [currentMonth, setCurrentMonth] = React.useState<Date>(minMonth);
    const [selectedDate, setSelectedDate] = React.useState<Date>(today);
    const [selectedSlot, setSelectedSlot] = React.useState<string>("");
    const [selectedTimezone, setSelectedTimezone] = React.useState<ITimezone | string>(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const [currentStep, setCurrentStep] = React.useState<"date" | "time" | "details">("date");
    const [isDateLoading, setIsDateLoading] = React.useState(false);
    const [meetingDescription, setMeetingDescription] = React.useState("");
    const [meetingLocation, setMeetingLocation] = React.useState("");
    const [meetingGuests, setMeetingGuests] = React.useState("");
    const [meetingVisibility, setMeetingVisibility] = React.useState<"public" | "private">("public");
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [viewLayout, setViewLayout] = React.useState<"list" | "day" | "week" | "month" | "year">("month");
    const layoutOptions = React.useMemo(
        () => [
            { value: "list", label: "List" },
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
            { value: "year", label: "Year" },
        ],
        []
    );
    const events = React.useMemo<CalendarEvent[]>(() => {
        const base = new Date(today);

        const createEvent = (
            offsetDays: number,
            startHour: number,
            startMinute: number,
            durationMinutes: number,
            title: string,
            location: string,
            category: "meeting" | "call" | "review" | "deadline" | "workshop"
        ) => {
            const start = new Date(base);
            start.setDate(base.getDate() + offsetDays);
            start.setHours(startHour, startMinute, 0, 0);
            const end = new Date(start);
            end.setMinutes(start.getMinutes() + durationMinutes);
            return {
                id: `${title}-${offsetDays}-${startHour}-${startMinute}`,
                title,
                location,
                start,
                end,
                category,
            };
        };

        return [
            createEvent(0, 9, 0, 60, "Product Kickoff", "Zoom Conference", "meeting"),
            createEvent(0, 13, 30, 45, "Sales Follow-up", "Call with Amanda", "call"),
            createEvent(1, 10, 0, 90, "UX Workshop", "Design Studio", "workshop"),
            createEvent(2, 16, 0, 30, "Ops Status", "Ops Team", "meeting"),
            createEvent(4, 11, 0, 45, "Legal Review", "Board Room", "review"),
            createEvent(7, 14, 0, 60, "Client Demo", "Zoom Webinar", "meeting"),
            createEvent(12, 9, 30, 30, "Billing Call", "Call with Riya", "call"),
            createEvent(18, 15, 0, 90, "Roadmap Planning", "Product HQ", "workshop"),
            createEvent(25, 13, 0, 120, "Quarterly Review", "Executive Room", "review"),
            createEvent(32, 17, 0, 30, "Invoice Deadline", "Finance", "deadline"),
        ];
    }, [today]);

    const sortedEvents = React.useMemo<CalendarEvent[]>(
        () =>
            [...events].sort(
                (a, b) => a.start.getTime() - b.start.getTime()
            ),
        [events]
    );

    const weekStart = React.useMemo(() => {
        const start = new Date(selectedDate);
        const diff = start.getDay();
        start.setDate(start.getDate() - diff);
        start.setHours(0, 0, 0, 0);
        return start;
    }, [selectedDate]);

    const weekDays = React.useMemo(
        () =>
            Array.from({ length: 7 }, (_, index) => {
                const day = new Date(weekStart);
                day.setDate(day.getDate() + index);
                return day;
            }),
        [weekStart]
    );

    const isSameDay = (dateA: Date, dateB: Date) =>
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth() &&
        dateA.getDate() === dateB.getDate();

    const eventsByMonthDay = React.useMemo(() => {
        const map = new Map<number, CalendarEvent[]>();
        sortedEvents.forEach((event) => {
            if (
                event.start.getFullYear() === currentMonth.getFullYear() &&
                event.start.getMonth() === currentMonth.getMonth()
            ) {
                const key = event.start.getDate();
                const existing = map.get(key) ?? [];
                map.set(key, [...existing, event]);
            }
        });
        return map;
    }, [sortedEvents, currentMonth]);

    const eventsByMonth = React.useMemo(() => {
        const map = new Map<number, number>();
        sortedEvents.forEach((event) => {
            if (event.start.getFullYear() === selectedDate.getFullYear()) {
                const monthIndex = event.start.getMonth();
                map.set(monthIndex, (map.get(monthIndex) ?? 0) + 1);
            }
        });
        return map;
    }, [sortedEvents, selectedDate]);

    const yearMonths = React.useMemo(
        () =>
            Array.from({ length: 12 }, (_, index) =>
                new Date(selectedDate.getFullYear(), index, 1)
            ),
        [selectedDate]
    );

    const formatTime = React.useCallback(
        (date: Date) =>
            date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
            }),
        []
    );

    const dayEvents = React.useMemo(
        () => sortedEvents.filter((event) => isSameDay(event.start, selectedDate)),
        [sortedEvents, selectedDate]
    );

    const handleDateSelect = React.useCallback((date: Date) => {
        setCurrentStep("time");
        setIsDateLoading(true);
        setSelectedSlot("");
        setMeetingDescription("");
        setMeetingLocation("");
        setMeetingGuests("");
        setMeetingVisibility("public");
        setSelectedDate(date);

        window.setTimeout(() => {
            setIsDateLoading(false);
        }, 600);
    }, []);

    const handleTimeSelect = React.useCallback((slot: string) => {
        setSelectedSlot(slot);
        setIsDateLoading(false);
        setCurrentStep("details");
    }, []);

    const handleResetDate = React.useCallback(() => {
        setSelectedDate(today);
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        setCurrentStep("date");
        setSelectedSlot("");
        setMeetingDescription("");
        setMeetingLocation("");
        setMeetingGuests("");
        setMeetingVisibility("public");
    }, [today]);

    const handleResetTime = React.useCallback(() => {
        setSelectedSlot("");
        setCurrentStep("time");
        setMeetingDescription("");
        setMeetingLocation("");
        setMeetingGuests("");
        setMeetingVisibility("public");
    }, []);

    const handleSaveMeeting = React.useCallback(() => {
        setConfirmOpen(true);
    }, []);

    const handleConfirmClose = React.useCallback(() => {
        setConfirmOpen(false);
    }, []);

    const handleConfirmSubmit = React.useCallback(() => {
        setConfirmOpen(false);
    }, []);

    const eventsByWeek = React.useMemo(
        () =>
            weekDays.map((day) =>
                sortedEvents.filter((event) => isSameDay(event.start, day))
            ),
        [weekDays, sortedEvents]
    );

    const calendarCells = React.useMemo(() => {
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const previousMonthDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
        const startWeekday = startOfMonth.getDay();
        const daysInMonth = endOfMonth.getDate();
        const totalCells = 42;

        return Array.from({ length: totalCells }, (_, index) => {
            const dayNumber = index - startWeekday + 1;
            if (dayNumber < 1) {
                return {
                    date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, previousMonthDays + dayNumber),
                    inMonth: false,
                };
            }
            if (dayNumber > daysInMonth) {
                return {
                    date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, dayNumber - daysInMonth),
                    inMonth: false,
                };
            }
            return {
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber),
                inMonth: true,
            };
        });
    }, [currentMonth]);

    const categoryColorMap: Record<
        CalendarEvent["category"],
        "primary" | "secondary" | "success" | "warning" | "info" | "error"
    > = {
        meeting: "primary",
        call: "info",
        review: "success",
        deadline: "error",
        workshop: "warning",
    };

    const categoryAccentMap: Record<CalendarEvent["category"], string> = {
        meeting: "#2563eb",
        call: "#14b8a6",
        review: "#16a34a",
        deadline: "#ef4444",
        workshop: "#f59e0b",
    };

    const renderEventLayout = React.useCallback(() => {
        const dayLabelFormatter = new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });

        switch (viewLayout) {
            case "list":
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        {sortedEvents.map((event) => (
                            <Box
                                key={event.id}
                                sx={{
                                    backgroundColor: "white",
                                    borderRadius: 3,
                                    p: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    boxShadow: "0 6px 15px rgba(59,130,246,0.08)",
                                    border: "1px solid #e2e8f0",
                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 10px 25px rgba(59,130,246,0.15)",
                                    },
                                }}
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    <Typography fontWeight={700} color="#0f172a">
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatTime(event.start)} – {formatTime(event.end)} · {event.location}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={event.category.toUpperCase()}
                                    size="small"
                                    color={categoryColorMap[event.category]}
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>
                        ))}
                    </Box>
                );

            case "day":
                return dayEvents.length ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {dayEvents.map((event) => (
                            <Box
                                key={event.id}
                                sx={{
                                    backgroundColor: "white",
                                    borderLeft: `4px solid ${categoryAccentMap[event.category]}`,
                                    borderRadius: 3,
                                    p: 2,
                                    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
                                    display: "flex",
                                    gap: 2,
                                }}
                            >
                                <Box sx={{ minWidth: 90 }}>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 700, color: "#1f2937" }}
                                    >
                                        {formatTime(event.start)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatTime(event.end)}
                                    </Typography>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography fontWeight={700} color="#0f172a">
                                        {event.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.location}
                                    </Typography>
                                    <Chip
                                        label={event.category.toUpperCase()}
                                        size="small"
                                        color={categoryColorMap[event.category]}
                                        sx={{ mt: 1, alignSelf: "flex-start" }}
                                    />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            backgroundColor: "white",
                            borderRadius: 3,
                            p: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                            color: "#64748b",
                        }}
                    >
                        <Typography fontWeight={700}>No events scheduled</Typography>
                        <Typography variant="body2">Enjoy your free time!</Typography>
                    </Box>
                );

            case "week":
                return (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, minmax(140px, 1fr))",
                            gap: 1.5,
                        }}
                    >
                        {weekDays.map((day, index) => {
                            const daySpecificEvents = eventsByWeek[index];
                            const isTodayDay = isSameDay(day, today);
                            return (
                                <Box
                                    key={day.toISOString()}
                                    sx={{
                                        backgroundColor: "white",
                                        borderRadius: 3,
                                        p: 2,
                                        boxShadow: "0 6px 15px rgba(15, 23, 42, 0.08)",
                                        border: isTodayDay ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        minHeight: 140,
                                    }}
                                >
                                    <Typography fontWeight={700} color="#0f172a">
                                        {dayLabelFormatter.format(day)}
                                    </Typography>
                                    {daySpecificEvents.length ? (
                                        daySpecificEvents.map((event) => (
                                            <Box
                                                key={event.id}
                                                sx={{
                                                    backgroundColor: "#f1f5f9",
                                                    borderRadius: 2,
                                                    p: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 0.5,
                                                }}
                                            >
                                                <Typography variant="body2" fontWeight={600}>
                                                    {event.title}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {formatTime(event.start)} – {formatTime(event.end)}
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="caption" color="text.secondary">
                                            Free slot
                                        </Typography>
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                );

            case "month":
                return (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(7, minmax(120px, 1fr))",
                            gap: 1,
                        }}
                    >
                        {calendarCells.map(({ date, inMonth }, index) => {
                            const eventsForDay = inMonth
                                ? eventsByMonthDay.get(date.getDate()) ?? []
                                : [];
                            const isSelected = isSameDay(date, selectedDate);
                            return (
                                <Box
                                    key={`${date.toISOString()}-${index}`}
                                    sx={{
                                        backgroundColor: isSelected ? "#e0e7ff" : "white",
                                        borderRadius: 2,
                                        p: 1.5,
                                        border: inMonth ? "1px solid #e2e8f0" : "1px dashed #e2e8f0",
                                        opacity: inMonth ? 1 : 0.55,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 0.75,
                                        minHeight: 110,
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        fontWeight={700}
                                        color={isSelected ? "#1d4ed8" : "#0f172a"}
                                    >
                                        {date.getDate()}
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                                        {eventsForDay.length ? (
                                            eventsForDay.map((event) => (
                                                <Chip
                                                    key={event.id}
                                                    size="small"
                                                    label={event.title}
                                                    color={categoryColorMap[event.category]}
                                                    sx={{
                                                        maxWidth: "100%",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        borderLeft: `3px solid ${categoryAccentMap[event.category]}`,
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">
                                                No events
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                );

            case "year":
                return (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                            gap: 1.5,
                        }}
                    >
                        {yearMonths.map((monthDate) => {
                            const monthIndex = monthDate.getMonth();
                            const count = eventsByMonth.get(monthIndex) ?? 0;
                            const isCurrentMonth =
                                monthIndex === currentMonth.getMonth() &&
                                monthDate.getFullYear() === currentMonth.getFullYear();
                            return (
                                <Box
                                    key={monthDate.toISOString()}
                                    sx={{
                                        backgroundColor: "white",
                                        borderRadius: 3,
                                        p: 2,
                                        boxShadow: "0 6px 15px rgba(15, 23, 42, 0.08)",
                                        border: isCurrentMonth ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        minHeight: 120,
                                    }}
                                >
                                    <Typography fontWeight={700} color="#0f172a">
                                        {monthDate.toLocaleDateString("en-US", { month: "long" })}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {count ? `${count} scheduled events` : "No events"}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(7, 1fr)",
                                            gap: 0.5,
                                            mt: 1,
                                        }}
                                    >
                                        {Array.from({ length: 21 }).map((_, idx) => (
                                            <Box
                                                key={`${monthIndex}-${idx}`}
                                                sx={{
                                                    width: "100%",
                                                    aspectRatio: "1 / 1",
                                                    borderRadius: 1,
                                                    backgroundColor:
                                                        idx < count ? "#2563eb" : "rgba(148, 163, 184, 0.25)",
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                );

            default:
                return null;
        }
    }, [
        currentMonth,
        dayEvents,
        eventsByMonth,
        eventsByMonthDay,
        eventsByWeek,
        formatTime,
        selectedDate,
        sortedEvents,
        today,
        viewLayout,
        weekDays,
    ]);

    const menuPortalTarget = React.useMemo<HTMLElement | undefined>(
        () => (typeof window !== "undefined" ? document.body : undefined),
        []
    );

    const handleMonthChange = (delta: number) => {
        const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1);
        if (next < minMonth || next > maxMonth) {
            return;
        }

        setCurrentMonth(next);
        setSelectedDate((prev) => {
            const daysInNextMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
            const desiredDay = Math.min(prev.getDate(), daysInNextMonth);
            let candidate = new Date(next.getFullYear(), next.getMonth(), desiredDay);

            if (candidate < today) {
                candidate = today;
            }
            if (candidate > maxDate) {
                candidate = maxDate;
            }
            return candidate;
        });
        setCurrentStep("date");
        setSelectedSlot("");
        setMeetingDescription("");
        setMeetingLocation("");
        setMeetingGuests("");
        setMeetingVisibility("public");
    };

    const monthLabel = currentMonth.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const selectedDateLabel = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <CustomSideBarPanel
            open={open}
            close={onClose}
            width="80%"
            title={<Typography fontWeight={700}>Schedule Visit</Typography>}
        >
            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    height: "100%",
                    minHeight: 0,
                }}
            >
                {/* Left panel */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        background: "#f4f6ff",
                        boxShadow: "inset 0 0 0 1px #e0e7ff",
                        overflow: "hidden",
                        minHeight: 0,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2.5 }}>
                        <TextField
                            fullWidth
                            placeholder="Name, address or specialist"
                            variant="outlined"
                            size="small"
                            sx={{ backgroundColor: "white" }}
                        />
                        <IconButton size="small" sx={{ backgroundColor: "white" }}>
                            <EventNoteIcon />
                        </IconButton>
                    </Box>

                    <Box
                        sx={{ display: "flex", gap: 1, flexWrap: "wrap", px: 2.5, pb: 2 }}
                    >
                        {[{ label: "Today" }, { label: "Tomorrow" }, { label: "Next Week" }].map((chip) => (
                            <Chip
                                key={chip.label}
                                label={chip.label}
                                color={chip.label === "Today" ? "primary" : "default"}
                                sx={{ borderRadius: 999, fontWeight: 600 }}
                            />
                        ))}

                        <FormControl
                            size="small"
                            sx={{ minWidth: 140, ml: "auto", alignSelf: "center" }}
                        >
                            <Select
                                value={viewLayout}
                                onChange={(event) => setViewLayout(event.target.value as typeof viewLayout)}
                                displayEmpty
                                renderValue={(value) =>
                                    layoutOptions.find((option) => option.value === value)?.label ?? "Month"
                                }
                                MenuProps={{
                                    disablePortal: false,
                                    PaperProps: {
                                        sx: {
                                            borderRadius: 2,
                                            mt: 0.5,
                                            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.18)",
                                            zIndex: 13010,
                                        },
                                        style: {
                                            zIndex: 13010,
                                        },
                                    },
                                    sx: {
                                        zIndex: 13010,
                                    },
                                }}
                                sx={{
                                    borderRadius: 999,
                                    fontWeight: 600,
                                    fontSize: 14,
                                    "& .MuiSelect-select": {
                                        py: 0.75,
                                        pl: 2,
                                        pr: 4,
                                    },
                                }}
                            >
                                {layoutOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value} sx={{ fontWeight: 600 }}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            px: 2.5,
                            pb: 3,
                            pr: 2,
                        }}
                        className="custom-scrollbar"
                    >
                        {renderEventLayout()}
                    </Box>
                </Box>

                {/* Right panel */}
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        alignItems: "center",
                        justifyContent: "center",
                        px: { xs: 0, md: 2 },
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 560,
                            backgroundColor: "white",
                            borderRadius: 4,
                            boxShadow: "0 18px 30px rgba(59,130,246,0.12)",
                            overflow: "hidden",
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            position: "relative",
                            minHeight: 420,
                        }}
                    >
                        <Slide in={currentStep === "date"} direction="right" mountOnEnter unmountOnExit>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle2" fontWeight={700} color="#1f2937">
                                        Select a Date
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleMonthChange(-1)}
                                            disabled={currentMonth.getTime() <= minMonth.getTime()}
                                            sx={{
                                                backgroundColor: "#eef2ff",
                                                color: "#1d4ed8",
                                                "&.Mui-disabled": { opacity: 0.4 },
                                            }}
                                        >
                                            <ChevronLeftIcon fontSize="small" />
                                        </IconButton>
                                        <Typography fontWeight={700} color="#1f2937">
                                            {monthLabel}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleMonthChange(1)}
                                            disabled={currentMonth.getTime() >= maxMonth.getTime()}
                                            sx={{
                                                backgroundColor: "#eef2ff",
                                                color: "#1d4ed8",
                                                "&.Mui-disabled": { opacity: 0.4 },
                                            }}
                                        >
                                            <ChevronRightIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(7, minmax(52px, 1fr))",
                                        gap: 1.4,
                                    }}
                                >
                                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((label) => (
                                        <Typography
                                            key={label}
                                            variant="caption"
                                            textAlign="center"
                                            sx={{ color: "#94a3b8", fontWeight: 600 }}
                                        >
                                            {label}
                                        </Typography>
                                    ))}
                                    {calendarCells.map(({ date, inMonth }, index) => {
                                        const isDisabled =
                                            !inMonth ||
                                            date.getTime() < today.getTime() ||
                                            date.getTime() > maxDate.getTime();
                                        const isSelected = isSameDay(date, selectedDate);
                                        const isToday = isSameDay(date, today);

                                        return (
                                            <Button
                                                key={`${date.toISOString()}-${index}`}
                                                onClick={() => {
                                                    if (!isDisabled) {
                                                        handleDateSelect(date);
                                                    }
                                                }}
                                                disabled={isDisabled}
                                                sx={{
                                                    minWidth: 0,
                                                    height: 52,
                                                    borderRadius: 2,
                                                    px: 0,
                                                    fontWeight: 600,
                                                    backgroundColor: isSelected
                                                        ? "#2563eb"
                                                        : isDisabled
                                                            ? "transparent"
                                                            : "#f8fafc",
                                                    color: isSelected ? "#fff" : isDisabled ? "#cbd5f5" : "#1f2937",
                                                    boxShadow: isSelected
                                                        ? "0 6px 20px rgba(37,99,235,0.35)"
                                                        : isToday
                                                            ? "0 0 0 1px rgba(37,99,235,0.15)"
                                                            : "none",
                                                    border: isSelected
                                                        ? "1px solid #1e3a8a"
                                                        : isToday
                                                            ? "1px solid #2563eb"
                                                            : "1px solid transparent",
                                                    opacity: isDisabled ? 0.4 : 1,
                                                    "&:hover": {
                                                        backgroundColor: isDisabled
                                                            ? "transparent"
                                                            : isSelected
                                                                ? "#1e40af"
                                                                : "#e0e7ff",
                                                    },
                                                }}
                                            >
                                                {date.getDate()}
                                            </Button>
                                        );
                                    })}
                                </Box>

                                <FormControl fullWidth>
                                <Typography variant="subtitle2" fontWeight={600} mb={0.75}>
                                    Time zone
                                </Typography>
                                <TimezoneSelect
                                    value={selectedTimezone}
                                    onChange={(value) => setSelectedTimezone(value)}
                                    menuPortalTarget={menuPortalTarget}
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                    menuShouldScrollIntoView={false}
                                    styles={{
                                        control: (base) => ({
                                            ...base,
                                            borderRadius: 12,
                                            borderColor: "#e2e8f0",
                                            boxShadow: "none",
                                            minHeight: 42,
                                        }),
                                        menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 13000,
                                        }),
                                        menu: (base) => ({
                                            ...base,
                                            zIndex: 13000,
                                        }),
                                    }}
                                    theme={(theme) => ({
                                        ...theme,
                                        borderRadius: 12,
                                        colors: {
                                            ...theme.colors,
                                            primary: "#2563eb",
                                            primary25: "#e0e7ff",
                                            neutral20: "#cbd5f5",
                                        },
                                    })}
                                />
                                </FormControl>
                            </Box>
                        </Slide>

                        <Slide in={currentStep === "time"} direction="left" mountOnEnter unmountOnExit>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle2" fontWeight={700} color="#1f2937">
                                        Choose a time slot
                                    </Typography>
                                    <Button size="small" onClick={handleResetDate} startIcon={<ChevronLeftIcon />}
                                        sx={{ textTransform: "none" }}>
                                        Change date
                                    </Button>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedDateLabel}
                                </Typography>

                                {isDateLoading ? (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            py: 6,
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={timerGif}
                                            alt="Loading time slots"
                                            sx={{ width: 120, height: 120, objectFit: "contain" }}
                                        />
                                    </Box>
                                ) : (
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                        {timeSlots.map((slot) => {
                                            const isSelectedSlot = selectedSlot === slot;
                                            return (
                                                <Button
                                                    key={slot}
                                                    fullWidth
                                                    variant={isSelectedSlot ? "contained" : "outlined"}
                                                    onClick={() => handleTimeSelect(slot)}
                                                    sx={{
                                                        borderRadius: 2,
                                                        textTransform: "none",
                                                        fontWeight: 700,
                                                        color: isSelectedSlot ? "#fff" : "#1f2937",
                                                        backgroundColor: isSelectedSlot ? "#111827" : "transparent",
                                                        borderColor: isSelectedSlot ? "#111827" : "#2563eb",
                                                        "&:hover": {
                                                            backgroundColor: isSelectedSlot ? "#0f172a" : "#e0e7ff",
                                                        },
                                                    }}
                                                >
                                                    {slot}
                                                </Button>
                                            );
                                        })}
                                    </Box>
                                )}
                            </Box>
                        </Slide>

                        <Slide in={currentStep === "details"} direction="left" mountOnEnter unmountOnExit>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Typography variant="subtitle2" fontWeight={700} color="#1f2937">
                                        Meeting details
                                    </Typography>
                                    <Button size="small" onClick={handleResetTime} startIcon={<ChevronLeftIcon />}
                                        sx={{ textTransform: "none" }}>
                                        Change time
                                    </Button>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedDateLabel} · {selectedSlot}
                                </Typography>

                                <TextField
                                    label="Meeting description"
                                    value={meetingDescription}
                                    onChange={(event) => setMeetingDescription(event.target.value)}
                                    multiline
                                    minRows={2}
                                    placeholder="Add agenda or talking points"
                                />
                                <TextField
                                    label="Location"
                                    value={meetingLocation}
                                    onChange={(event) => setMeetingLocation(event.target.value)}
                                    placeholder="e.g. Zoom, Conference room"
                                />
                                <TextField
                                    label="Guests"
                                    value={meetingGuests}
                                    onChange={(event) => setMeetingGuests(event.target.value)}
                                    placeholder="Add guest emails separated by commas"
                                />
                                <FormControl component="fieldset">
                                    <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                                        Visibility
                                    </Typography>
                                    <RadioGroup
                                        row
                                        value={meetingVisibility}
                                        onChange={(event) =>
                                            setMeetingVisibility(event.target.value as "public" | "private")
                                        }
                                    >
                                        <FormControlLabel value="public" control={<Radio />} label="Public" />
                                        <FormControlLabel value="private" control={<Radio />} label="Private" />
                                    </RadioGroup>
                                </FormControl>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveMeeting}
                                    disabled={
                                        !meetingDescription.trim() ||
                                        !meetingLocation.trim() ||
                                        !selectedSlot
                                    }
                                >
                                    Save Meeting
                                </Button>
                            </Box>
                        </Slide>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        {currentStep === "details" && selectedSlot
                            ? `You selected ${selectedDateLabel} at ${selectedSlot}`
                            : currentStep === "time"
                            ? "Choose a time to finish booking"
                            : "Select a date to continue"}
                    </Typography>
                </Box>
            </Box>

            <Dialog open={confirmOpen} onClose={handleConfirmClose} fullWidth maxWidth="sm">
                <DialogTitle>Confirm meeting</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        You are scheduling a meeting for
                    </Typography>
                    <Typography fontWeight={700}>{selectedDateLabel}</Typography>
                    <Typography fontWeight={600}>Time: {selectedSlot || "Not selected"}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Visibility: {meetingVisibility === "public" ? "Public" : "Private"}
                    </Typography>
                    {meetingDescription && (
                        <TextField
                            label="Description"
                            value={meetingDescription}
                            multiline
                            minRows={3}
                            InputProps={{ readOnly: true }}
                        />
                    )}
                    {meetingLocation && (
                        <TextField
                            label="Location"
                            value={meetingLocation}
                            InputProps={{ readOnly: true }}
                        />
                    )}
                    {meetingGuests && (
                        <TextField
                            label="Guests"
                            value={meetingGuests}
                            InputProps={{ readOnly: true }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmClose}>Cancel</Button>
                    <Button
                        onClick={handleConfirmSubmit}
                        variant="contained"
                        disabled={!selectedSlot || isDateLoading}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </CustomSideBarPanel>
    );
};

export default EventDrawerPage;

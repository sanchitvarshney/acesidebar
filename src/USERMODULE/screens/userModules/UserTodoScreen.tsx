import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useSelector } from "react-redux";

type TodoStatus = "pending" | "completed";

type Todo = {
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  dueDate?: string;
  createdAt: string;
};

const initialTodos: Todo[] = [
  {
    id: "todo-1",
    title: "Follow up with Andrea on billing ticket",
    description:
      "Confirm the credit memo was issued and send update to customer.",
    status: "pending",
    dueDate: "Today, 4:30 PM",
    createdAt: "2025-11-09",
  },
  {
    id: "todo-2",
    title: "Draft post-incident summary for EU outage",
    description: "Loop in SRE notes before sharing with Success team.",
    status: "pending",
    dueDate: "Tomorrow, 11:00 AM",
    createdAt: "2025-11-09",
  },
  {
    id: "todo-3",
    title: "Archive closed onboarding workflows",
    status: "completed",
    dueDate: "Yesterday",
    createdAt: "2025-11-05",
  },
  {
    id: "todo-1",
    title: "Follow up with Andrea on billing ticket",
    description:
      "Confirm the credit memo was issued and send update to customer.",
    status: "pending",
    dueDate: "Today, 4:30 PM",
    createdAt: "2025-11-09",
  },
  {
    id: "todo-2",
    title: "Draft post-incident summary for EU outage",
    description: "Loop in SRE notes before sharing with Success team.",
    status: "pending",
    dueDate: "Tomorrow, 11:00 AM",
    createdAt: "2025-11-09",
  },
  {
    id: "todo-3",
    title: "Archive closed onboarding workflows",
    status: "completed",
    dueDate: "Yesterday",
    createdAt: "2025-11-05",
  },
  {
    id: "todo-1",
    title: "Follow up with Andrea on billing ticket",
    description:
      "Confirm the credit memo was issued and send update to customer.",
    status: "pending",
    dueDate: "Today, 4:30 PM",
    createdAt: "2025-11-09",
  },
  {
    id: "todo-2",
    title: "Draft post-incident summary for EU outage",
    description: "Loop in SRE notes before sharing with Success team.",
    status: "pending",
    dueDate: "Tomorrow, 11:00 AM",
    createdAt: "2025-11-09",
  },
  {
    id: "todo-3",
    title: "Archive closed onboarding workflows",
    status: "completed",
    dueDate: "Yesterday",
    createdAt: "2025-11-05",
  },
];

const emptyTodo: Todo = {
  id: "",
  title: "",
  description: "",
  status: "pending",
  createdAt: new Date().toISOString().slice(0, 10),
};

const UserTodoScreen = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [draft, setDraft] = useState<Todo>(emptyTodo);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TodoStatus | "all">("all");
  const { isOpenToggle } = useSelector((state: any) => state.genral);

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesFilter = filter === "all" ? true : todo.status === filter;
      const matchesSearch =
        search.trim().length === 0 ||
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        (todo.description ?? "").toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [todos, filter, search]);

  const pendingCount = todos.filter((todo) => todo.status === "pending").length;
  const completedCount = todos.filter(
    (todo) => todo.status === "completed"
  ).length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim()) return;

    const nextTodo: Todo = {
      ...draft,
      id: `todo-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setTodos((prev) => [nextTodo, ...prev]);
    setDraft(emptyTodo);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: todo.status === "pending" ? "completed" : "pending",
            }
          : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const { scrollY } = useScroll();
  const [isDetached, setIsDetached] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!formRef.current) return;

    const offsetTop = formRef.current.getBoundingClientRect().top;
    // If it scrolls above viewport top, detach
    if (offsetTop <= 0 && !isDetached) setIsDetached(true);
    if (offsetTop > 0 && isDetached) setIsDetached(false);
  });

  return (
    <div className="w-full h-full min-h-[calc(100vh-74px)] bg-slate-100 flex flex-col overflow-hidden">
      <header
        style={{ position: "relative" }}
        className="px-8 py-6 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">
            To-do
          </p>
          <h1 className="text-2xl font-semibold text-slate-900">
            Personal checklist
          </h1>
          <p className="text-sm text-slate-500 mt-1">{todayLabel}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center bg-white border border-slate-200 rounded-full px-3 py-1.5">
            <Search size={16} className="text-slate-400 mr-2" />
            <input
              className="bg-transparent outline-none text-sm text-slate-600 placeholder:text-slate-400"
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 sm:px-10 py-6">
        <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div
            ref={formRef}
            className="px-6 py-[6px] border-b border-slate-100"
          >
            <motion.div
              variants={{
                attached: {
                  position: "static",
                  scale: 1,
                  opacity: 1,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              
                },
                detached: {
                  position: "fixed",
                  top: 60,
                  left: isOpenToggle ? "18%" : "0%",
                  width: "100%",
                  zIndex: 50,
                  scale: 1.02,
                  opacity: 0.98,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                
                }
              }}
              animate={isDetached ? "detached" : "attached"}
              initial="attached"
              className="bg-white border-b border-slate-200 rounded-2xl"
            >
              <form
                onSubmit={handleSubmit}
                className="border-b border-slate-200 px-6 py-6 space-y-4"
              >
                <div className="flex items-start gap-3">
                  <button
                    type="submit"
                    className="mt-1 h-11 w-11 rounded-full bg-[#00a884] text-white flex items-center justify-center shadow hover:bg-[#008f72] transition"
                    title="Add todo"
                  >
                    <Plus size={20} />
                  </button>
                  <div className="flex-1 space-y-3">
                    <div>
                      <input
                        className="w-full text-base font-medium text-slate-900 bg-transparent border-none outline-none placeholder:text-slate-400"
                        placeholder="What do you need to do?"
                        value={draft.title}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                      />
                      <textarea
                        className="mt-2 w-full text-sm text-slate-600 bg-transparent border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00a884]/20 focus:border-[#00a884]"
                        placeholder="Optional: add notes or context…"
                        rows={2}
                        value={draft.description}
                        onChange={(e) =>
                          setDraft((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <label className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-slate-200 text-slate-500 hover:border-[#00a884]">
                        <Calendar size={14} />
                        <input
                          type="text"
                          className="bg-transparent border-none outline-none w-32 text-xs"
                          placeholder="Due date"
                          value={draft.dueDate ?? ""}
                          onChange={(e) =>
                            setDraft((prev) => ({
                              ...prev,
                              dueDate: e.target.value,
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </form>

              <div className="px-6 py-4 flex items-center gap-2 text-sm border-b border-slate-200">
                {(["all", "pending", "completed"] as const).map((value) => (
                  <button
                    key={value}
                    className={`px-3 py-1.5 rounded-full transition text-sm ${
                      filter === value
                        ? "bg-[#e6f7f3] text-[#005f4f] font-medium"
                        : "text-slate-500 hover:bg-slate-100"
                    }`}
                    onClick={() => setFilter(value)}
                  >
                    {value === "all"
                      ? "All"
                      : value === "pending"
                      ? "Pending"
                      : "Completed"}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
          <ul className="divide-y divide-slate-200">
            {filteredTodos.length === 0 && (
              <li className="px-6 py-10 text-center text-slate-400 text-sm">
                Nothing here yet. Add a todo to get started.
              </li>
            )}

            {filteredTodos.map((todo) => {
              const isCompleted = todo.status === "completed";
              return (
                <li
                  key={todo.id}
                  className={`px-6 py-5 flex flex-col sm:flex-row sm:items-start gap-4 transition ${
                    isCompleted ? "bg-slate-50" : "hover:bg-slate-50"
                  }`}
                >
                  <button
                    className={`mt-1 h-6 w-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center transition ${
                      isCompleted
                        ? "bg-[#00a884] border-[#00a884] text-white"
                        : "border-slate-300 text-transparent"
                    }`}
                    onClick={() => toggleTodo(todo.id)}
                    aria-label={
                      isCompleted ? "Mark as pending" : "Mark as completed"
                    }
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3
                        className={`text-sm font-semibold ${
                          isCompleted
                            ? "text-slate-500 line-through"
                            : "text-slate-900"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      <button
                        className="text-slate-300 hover:text-red-500 transition"
                        onClick={() => removeTodo(todo.id)}
                        aria-label="Delete todo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {todo.description && (
                      <p
                        className={`mt-1 text-sm ${
                          isCompleted
                            ? "text-slate-400 line-through"
                            : "text-slate-600"
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {todo.dueDate ?? "No due date"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Circle
                          size={10}
                          className="fill-[#00a884] text-[#00a884]"
                        />
                        Created {todo.createdAt}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default UserTodoScreen;

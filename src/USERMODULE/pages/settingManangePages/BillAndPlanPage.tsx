import React from "react";

const features = {
  free: [
    "Multiple mailboxes",
    "Access to Marketplace",
    "Time/event based automations",
    "Custom domain",
    "Helpdesk-in-depth reports",
    "Custom ticket fields/views",
    "Agent collision",
    "API rate limit - 100rpm",
  ],
  growth: [
    "WhatsApp Business",
    "SLA reminders & escalation",
    "Up to 5000 collaborators",
    "Multiple products",
    "Multiple SLAs and timezones",
    "Portal customization",
    "Custom roles",
    "Automatic ticket assignment",
    "Custom reporting",
    "Manage team dashboards",
    "Custom satisfaction surveys",
    "Multilingual Ticket Forms",
    "API rate limit - 400rpm",
    "Extendable API rate limit",
    "Custom Objects",
  ],
  pro: [
    "IP range restriction",
    "Skill based assignment",
    "Sandbox",
    "HIPAA Compliance",
    "API rate limit - 700rpm",
    "Knowledge base approval workflow",
    "Agent Shifts",
    "Increased ticket field limits",
    "Reporting on Custom Objects",
  ],
};

type PlanCardProps = {
  name: string;
  price: string;
  ctaTry?: boolean;
  active?: boolean;
  features: string[];
  accent?: "blue" | "emerald" | "indigo";
};

const PlanCard: React.FC<PlanCardProps> = ({
  name,
  price,
  ctaTry,
  active,
  features,
  accent = "blue",
}) => {
  const accentColor = {
    blue: "ring-blue-500 text-blue-600 bg-blue-50",
    emerald: "ring-emerald-500 text-emerald-600 bg-emerald-50",
    indigo: "ring-indigo-500 text-indigo-600 bg-indigo-50",
  }[accent];

  return (
    <div
      className={`flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm`}
    >
      <div className="p-6">
        <div className="mb-2 text-sm font-medium text-slate-500">{name}</div>
        <div className="flex items-end gap-2">
          <div className="text-4xl font-semibold tracking-tight">{price}</div>
          <span className="pb-1 text-sm text-slate-500">
            per agent/month billed annually
          </span>
        </div>
        <div className="mt-4 flex gap-3">
          {ctaTry && (
            <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Try For FREE
            </button>
          )}
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold text-white hover:opacity-95 ${
              accent === "indigo"
                ? "bg-indigo-600"
                : accent === "emerald"
                ? "bg-emerald-600"
                : "bg-blue-600"
            }`}
          >
            Upgrade Now
          </button>
        </div>
        <div className="mt-8 text-sm font-medium text-slate-600">
          Everything In{" "}
          {name === "Growth" ? "Free" : name === "Pro" ? "Growth" : "Pro"}
        </div>
        <ul className="mt-3 space-y-2 text-slate-700">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span
                className={`mt-1 inline-flex h-2 w-2 rounded-full ${
                  accent === "indigo"
                    ? "bg-indigo-500"
                    : accent === "emerald"
                    ? "bg-emerald-500"
                    : "bg-blue-500"
                }`}
              />
              <span className="leading-6">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      {active && (
        <div
          className={`mx-6 mb-6 rounded-md border ${accentColor} px-3 py-2 text-xs font-medium ring-1`}
        >
          Current plan
        </div>
      )}
      <div className="mt-auto p-6">
        <div className="flex gap-3">
          {ctaTry && (
            <button className="w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Try For FREE
            </button>
          )}
          <button
            className={`w-full rounded-md px-4 py-2 text-sm font-semibold text-white hover:opacity-95 ${
              accent === "indigo"
                ? "bg-indigo-600"
                : accent === "emerald"
                ? "bg-emerald-600"
                : "bg-blue-600"
            }`}
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

const BillAndPlanPage = () => {
  return (
    <div className="px-6 py-6">
      {/* Header Banner */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Plans & Billing
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Manage your subscription and explore available plans.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              <span className="text-slate-500">Plan :</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-white">
                Free
              </span>
            </div>
            <ul className="text-sm text-slate-600">
              <li>Free Plan</li>
              <li>2 agent seats</li>
              <li>Active Since Tue, 1 Jul at 2:14 AM</li>
            </ul>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Try other plans for free
              </button>
              <button className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:opacity-95">
                Enter payment details to upgrade
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Plan */}
      <h3 className="mb-3 text-lg font-semibold text-slate-800">Choose Plan</h3>
      <div className="grid gap-6 lg:grid-cols-3">
        <PlanCard
          name="Growth"
          price="$15"
          ctaTry
          features={features.free}
          accent="blue"
        />
        <PlanCard
          name="Pro"
          price="$49"
          ctaTry
          features={features.growth}
          accent="emerald"
        />
        <PlanCard
          name="Enterprise"
          price="$79"
          features={features.pro}
          accent="indigo"
        />
      </div>

      {/* Account & Billing details */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Payment Method */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-800">
            Payment Method
          </h4>
          <p className="mt-1 text-sm text-slate-600">
            No card on file. Add a card to enable upgrades and auto-renewal.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-95">
              Add Card
            </button>
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Add Billing Address
            </button>
          </div>
          <ul className="mt-4 space-y-1 text-xs text-slate-500">
            <li>We accept Visa, MasterCard, AmEx.</li>
            <li>Invoices are emailed to the billing contact.</li>
          </ul>
        </div>

        {/* Seat Management */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-800">
            Seats & Agents
          </h4>
          <div className="mt-2 grid grid-cols-3 items-center gap-3 text-sm">
            <div>
              <div className="text-slate-500">Included Seats</div>
              <div className="font-semibold">2</div>
            </div>
            <div>
              <div className="text-slate-500">In Use</div>
              <div className="font-semibold">2</div>
            </div>
            <div>
              <div className="text-slate-500">Available</div>
              <div className="font-semibold">0</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Add Seats
            </button>
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Manage Agents
            </button>
          </div>
        </div>

        {/* Usage & Limits */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="text-base font-semibold text-slate-800">
            Usage & Limits
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li className="flex items-center justify-between">
              <span>API rate limit</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                100 rpm
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Email tickets per day</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                Unlimited
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Custom objects</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                Not available on Free
              </span>
            </li>
          </ul>
          <div className="mt-4">
            <button className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:opacity-95">
              View Full Usage
            </button>
          </div>
        </div>
      </div>

      {/* Add-ons relevant to ticket management */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-800">
          Add-ons & Modules
        </h4>
        <p className="mt-1 text-sm text-slate-600">
          Enable advanced features to level-up your helpdesk and ticket
          workflows.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "SLA Policies",
              desc: "Define response & resolution targets.",
              tag: "Popular",
            },
            { title: "Sandbox", desc: "Test automation and workflows safely." },
            {
              title: "Knowledge Base",
              desc: "Public/Private articles with approval flow.",
            },
            {
              title: "Agent Collision Detection",
              desc: "Avoid duplicate replies.",
            },
            { title: "Custom Roles", desc: "Granular permissions for teams." },
            {
              title: "WhatsApp Business",
              desc: "Connect messaging channel for tickets.",
            },
          ].map((a) => (
            <div
              key={a.title}
              className="flex flex-col justify-between rounded-lg border border-slate-200 p-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-800">
                    {a.title}
                  </div>
                  {a.tag && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      {a.tag}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-slate-600">{a.desc}</p>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  Learn More
                </button>
                <button className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-95">
                  Enable
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-800">
          Billing History
        </h4>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Date
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Description
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Amount
                </th>
                <th className="px-4 py-2 text-left font-medium text-slate-600">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[
                {
                  date: "01 Jul 2025",
                  desc: "Free Plan Activation",
                  amount: "$0.00",
                  invoice: "-",
                },
              ].map((row) => (
                <tr key={row.date} className="hover:bg-slate-50">
                  <td className="px-4 py-2">{row.date}</td>
                  <td className="px-4 py-2">{row.desc}</td>
                  <td className="px-4 py-2">{row.amount}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-indigo-600 hover:underline disabled:text-slate-400"
                      disabled
                    >
                      {row.invoice === "-" ? "Not available" : "Download"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h4 className="text-base font-semibold text-slate-800">FAQs</h4>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {[
            {
              q: "Can I change plans anytime?",
              a: "Yes, you can upgrade or downgrade at any time. Changes apply prorated on the next invoice.",
            },
            {
              q: "What happens to my data on downgrade?",
              a: "We keep all ticket data safe. Features beyond your plan are disabled but your data remains accessible.",
            },
            {
              q: "Do you offer annual discounts?",
              a: "Displayed prices are per agent/month billed annually. Monthly billing is available at a different rate.",
            },
            {
              q: "Is there an SLA for paid plans?",
              a: "Yes, paid plans include higher API limits and SLA features. See plan details above.",
            },
          ].map((f) => (
            <div key={f.q} className="rounded-lg border border-slate-200 p-4">
              <div className="text-sm font-semibold text-slate-800">{f.q}</div>
              <p className="mt-1 text-sm text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Support banner */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-gradient-to-r from-indigo-50 to-emerald-50 p-6 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="text-base font-semibold text-slate-800">
              Need help choosing the right plan?
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Chat with our support team or schedule a quick call.
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Contact Support
            </button>
            <button className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:opacity-95">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillAndPlanPage;

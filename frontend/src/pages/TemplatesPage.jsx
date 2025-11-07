import { useState } from "react";
import { Pencil, Copy, Trash2, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Sidebar } from "../components/layout/DashboardLayout";
export default function TemplatesPage() {

    const [categories, setCategories] = useState([
        {
            name: "Cold Outreach",
            count: 5,
            open: true,
            templates: [
                {
                    title: "Quick Value Intro",
                    body: `Hey James, hope you're doing well. I had a quick thought that might be relevant for you. Would you be open if I share a short idea that could meaningfully improve your results in this area?`,
                    editing: false,
                },
                {
                    title: "Problem/Pain Point Hook",
                    body: `Hey Olivia, I noticed a lot of people in your space struggle with X not converting into actual outcomes. Is this something you're also facing right now? If yes, I think I can share a small approach that makes this way easier.`,
                    editing: false,
                },
                {
                    title: "Shared Space / Common Ground Connect",
                    body: `Hey Liam, looks like we operate around very similar spaces. I think there’s potential overlap in how we can benefit each other. Worth exploring for a few minutes?`,
                    editing: false,
                },
                {
                    title: "Founder to Founder Connect",
                    body: `Hey Sophia, founder to founder — I’m always looking to share perspective + learn from builders solving similar things. If you're open, I'd love to understand what you’re working on and where we can support each other.`,
                    editing: false,
                },
                {
                    title: "Soft Intro No Pitch Yet",
                    body: `Hey Noah, thanks for connecting. No pitch — just looking to get to know more operators who are actively building. How are things going on your side lately?`,
                    editing: false,
                },
            ],
        },
        {
            name: "Warm Follow Up",
            count: 5,
            open: false,
            templates: [
                {
                    title: "Just Checking Back In",
                    body: `Hey Isabella, just circling back here. Any update from your side?`,
                    editing: false,
                },
                {
                    title: "Any Thoughts on My Last Message?",
                    body: `Hey Mason, did you get a chance to take a look at my last message?`,
                    editing: false,
                },
                {
                    title: "Bringing You Back to Top of Inbox",
                    body: `Bumping this to the top for you Amelia — curious what you think here.`,
                    editing: false,
                },
                {
                    title: "Short Reminder Follow Up",
                    body: `Hey Ethan, gentle reminder here — would love your guidance on how we move this forward.`,
                    editing: false,
                },
                {
                    title: "Follow Up With New Value Add",
                    body: `Hey Ava, quick follow-up + an extra resource that might help you think through this better. Want me to share?`,
                    editing: false,
                },
            ],
        },
        {
            name: "Meeting Follow Up",
            count: 5,
            open: false,
            templates: [
                {
                    title: "Thanks for the Call",
                    body: `Lucas, really enjoyed our conversation earlier. Thanks again for taking the time. Here’s my suggestion — let’s define the next step before momentum drops. Are you open for it?`,
                    editing: false,
                },
                {
                    title: "Demo Recording + Next Steps",
                    body: `Hey Charlotte, sending a quick follow-up here. If it helps, I can also share a short recorded walk-through so your team can quickly evaluate next steps. Should I send it over?`,
                    editing: false,
                },
                {
                    title: "Recap + Confirmation",
                    body: `Logan, just to make sure we’re aligned — everything we discussed still makes sense from your side right? If yes, let’s lock path forward.`,
                    editing: false,
                },
                {
                    title: "Confirm Decision Maker",
                    body: `Quick thing Mia — for next steps, is there anyone else on your side who should be looped in so we can move faster?`,
                    editing: false,
                },
                {
                    title: "Scheduling Next Checkpoint",
                    body: `Elijah, how does your schedule look to lock a short next checkpoint? We don’t need long — just align what needs to happen next.`,
                    editing: false,
                },
            ],
        },
        {
            name: "Referral Request",
            count: 5,
            open: false,
            templates: [
                {
                    title: "Intro Request to Key Person",
                    body: `Hey Harper, would you be open to connecting me with the right person who handles this area on your side?`,
                    editing: false,
                },
                {
                    title: "Mutual Value Exchange Ask",
                    body: `Benjamin, I think I can share something valuable for someone in your network solving <problem>. If someone comes to mind — would you be open to connecting us?`,
                    editing: false,
                },
                {
                    title: "Soft Referral Ask",
                    body: `Ella, if you think someone in your circle might benefit from this — feel free to connect us anytime. No pressure.`,
                    editing: false,
                },
                {
                    title: "“If Not You” Referral Ask",
                    body: `Hey Henry, even if this might not be the right time for you — is there someone you recommend this would align better with?`,
                    editing: false,
                },
                {
                    title: "Warm Handoff Confirmation",
                    body: `Thanks Evelyn. If you’d like, I can send a short 2-line intro you can easily forward. Want me to send that over?`,
                    editing: false,
                },
            ],
        },
        {
            name: "Nurture Touch",
            count: 5,
            open: false,
            templates: [
                {
                    title: "Light Check-In After Time Gap",
                    body: `Hey James, just checking in after some time. How are things moving on your side lately?`,
                    editing: false,
                },
                {
                    title: "Re-Engage With Industry Insight",
                    body: `Hey Olivia, saw something recently that reminded me of our conversation. Curious — are you seeing similar patterns in your space now?`,
                    editing: false,
                },
                {
                    title: "Sharing Useful Resource",
                    body: `Liam, found a resource that could be helpful for what you’re working on. Want me to share?`,
                    editing: false,
                },
                {
                    title: "Soft Bump After No Reply",
                    body: `Hey Sophia, just giving this a gentle nudge — still relevant for you?`,
                    editing: false,
                },
                {
                    title: "Friendly No Pressure Check In",
                    body: `Just checking in Noah — hope everything is going well on your side.`,
                    editing: false,
                },
            ],
        },
        {
            name: "Deal Closing Push",
            count: 5,
            open: false,
            templates: [
                {
                    title: "Final Clarification Before Decision",
                    body: `Isabella, before you make final call here — is there anything still unclear that I can help clarify?`,
                    editing: false,
                },
                {
                    title: "Budget Alignment Follow Up",
                    body: `Hey Mason, is budget the main blocker here or is it something else?`,
                    editing: false,
                },
                {
                    title: "Last Blocker Removal",
                    body: `Amelia, if there’s a blocker on your side preventing this from moving — let’s solve that together. What’s the friction point?`,
                    editing: false,
                },
                {
                    title: "Clear Yes / No Ask",
                    body: `Ethan, totally okay whichever way you decide — I just need clarity so I know how to plan next. Is this a Yes or No for you right now?`,
                    editing: false,
                },
                {
                    title: "Offer Expiry Reminder",
                    body: `Ava, keeping you updated: this offer won’t be available long-term. Would you like to lock it before it closes?`,
                    editing: false,
                },
            ],
        },
    ]);

    const firstNames = [
        "James", "Olivia", "Liam", "Sophia", "Noah", "Isabella", "Mason", "Amelia",
        "Ethan", "Ava", "Lucas", "Charlotte", "Logan", "Mia", "Elijah", "Harper",
        "Benjamin", "Ella", "Henry", "Evelyn"
    ];

    return (
        <div className="p-6 w-full pb-32">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-[22px] font-semibold">Templates</h1>

                <div className="flex gap-3">
                    <input
                        placeholder="Search templates..."
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                    <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        + Add Category
                    </button>
                </div>
            </div>

            {categories.map((cat, i) => (
                <div key={i} className="mb-5 bg-white p-5 rounded-[15px] border border-gray-200">
                    <button
                        onClick={() =>
                            setCategories(c =>
                                c.map((x, idx) => (idx === i ? { ...x, open: !x.open } : x))
                            )
                        }
                        className="flex items-center justify-between w-full px-4 py-3"
                    >
                        <span className="flex items-center gap-2">
                            {cat.name}
                            <span className="text-[12px] px-2 py-[2px] rounded-full bg-[#EEF2FF] text-[#4F46E6] font-medium">
                                {cat.count}
                            </span>
                        </span>

                        {cat.open ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucide-chevron-up">
                                <path d="m18 15-6-6-6 6"></path>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="lucide lucide-chevron-down">
                                <path d="m6 9 6 6 6-6"></path>
                            </svg>
                        )}
                    </button>


                    {cat.open && (
                        <div className="p-4 relative bg-white  flex-[0_0_calc(33.333%-1rem)]"
                        >
                            {cat.open && (
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {cat.templates.map((t, j) => (
                                        <div
                                            key={j}
                                            className="border border-slate-200 rounded-xl p-4 relative bg-white hover:shadow-md transition"
                                        >
                                            <div className="absolute top-3 right-3 flex gap-2 text-slate-500">
                                                <Pencil size={15} />
                                                <Copy size={15} />
                                                <Trash2 size={15} />
                                            </div>

                                            <div className="font-semibold text-[15px] mb-2 text-slate-900 pr-11">
                                                {t.title}
                                            </div>

                                            <p className="text-sm text-slate-600 leading-5">
                                                {t.body}
                                            </p>
                                        </div>
                                    ))}

                                    {/* Add New Template Card */}
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col justify-center items-center cursor-pointer text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition">
                                        <Plus size={22} />
                                        <span className="mt-1">Add New Template</span>
                                    </div>
                                </div>

                            )}

                        </div>
                    )}
                </div>
            ))}

        </div>
    );

};
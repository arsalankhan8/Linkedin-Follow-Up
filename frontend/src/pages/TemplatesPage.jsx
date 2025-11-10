import { Pencil, Copy, Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Sidebar } from "../components/layout/DashboardLayout";
import { createTemplate, getTemplates, updateTemplate, deleteTemplate } from "../api/templates.js";
import { toast } from "sonner";


export const staticCategories = [
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
];

export default function TemplatesPage() {

    const firstNames = [
        "James", "Olivia", "Liam", "Sophia", "Noah", "Isabella", "Mason", "Amelia",
        "Ethan", "Ava", "Lucas", "Charlotte", "Logan", "Mia", "Elijah", "Harper",
        "Benjamin", "Ella", "Henry", "Evelyn"
    ];

    const [categories, setCategories] = useState(staticCategories);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [deletingTemplate, setDeletingTemplate] = useState(null);
    const [addingCategoryIndex, setAddingCategoryIndex] = useState(null);
    const [backendLoaded, setBackendLoaded] = useState(false);
    const _idCheck = (template) => !!template._id;

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await getTemplates(); // backend API call
            const backendTemplates = res.data || [];
            console.log("Templates fetched:", backendTemplates);

            // Group backend templates by category
            const grouped = {};
            backendTemplates.forEach(t => {
                if (!grouped[t.category]) grouped[t.category] = [];
                grouped[t.category].push({ ...t, editing: false }); // add editing flag
            });

            // Merge backend templates with hardcoded static templates
            const merged = staticCategories.map(cat => ({
                ...cat,
                templates: [
                    ...cat.templates,                 // keep hardcoded
                    ...(grouped[cat.name] || []),    // add backend templates if any
                ]
            }));

            setCategories(merged);
            setBackendLoaded(true);
        } catch (err) {
            console.error("Fetch Templates Error:", err.response?.data || err.message);
        }
    };

    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleCopy = (text, catIndex, templateIndex) => {
        navigator.clipboard.writeText(text);
        toast.success("Template copied!");
        setCopiedIndex(`${catIndex}-${templateIndex}`);

        // Reset copied state after 1s
        setTimeout(() => setCopiedIndex(null), 1000);
    };
    // Edit template

    const handleSaveEdit = async () => {
        const MAX_TITLE = 40;
        const MAX_BODY = 160;

        const { _id, title, body, catIndex, templateIndex } = editingTemplate;

        if (!title || !body) {
            return toast.error("Please fill both fields");
        }

        if (title.length > MAX_TITLE) {
            return toast.error(`Title max ${MAX_TITLE} characters`);
        }

        if (body.length > MAX_BODY) {
            return toast.error(`Template text max ${MAX_BODY} characters`);
        }

        try {
            let updated;
            if (_id) {
                updated = await updateTemplate(_id, {
                    title,
                    body,
                    category: categories[catIndex].name,
                });
            } else {
                updated = await createTemplate({
                    title,
                    body,
                    category: categories[catIndex].name,
                });
            }

            const newCategories = [...categories];
            newCategories[catIndex].templates[templateIndex] = updated.data;
            setCategories(newCategories);
            setEditingTemplate(null);
            toast.success("Template saved successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    // Delete template
    const handleConfirmDelete = async () => {
        const { _id, catIndex, templateIndex } = deletingTemplate;
        try {
            if (_id) await deleteTemplate(_id); // delete from backend
            const newCategories = [...categories];
            newCategories[catIndex].templates.splice(templateIndex, 1);
            setCategories(newCategories);
            setDeletingTemplate(null);
            toast.success("Template deleted successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    // Add new template
    const handleAddNew = async (catIndex, title, body) => {
        try {
            const newTemp = await createTemplate({
                title,
                body,
                category: categories[catIndex].name,
            });
            const newCategories = [...categories];
            newCategories[catIndex].templates.push(newTemp.data);
            setCategories(newCategories);
            setAddingCategoryIndex(null);
            toast.success("Template added successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    const toggleCategory = (index) => {
        setCategories(categories.map((cat, i) => (i === index ? { ...cat, open: !cat.open } : cat)));
    };

    return (
        <div className="p-6 w-full pb-32">
            <h1 className="text-[22px] font-semibold mb-6">Templates</h1>

            {categories.map((cat, i) => (
                <div key={i} className="mb-5 bg-white p-5 rounded-[15px] border border-gray-200">
                    <button
                        onClick={() => toggleCategory(i)}
                        className="flex items-center justify-between w-full px-4 py-3"
                    >
                        <span className="flex items-center gap-2 text-[20px] font-semibold">
                            {cat.name}
                            <span className="text-[12px] px-2 py-[2px] rounded-full bg-[#EEF2FF] text-[#4F46E6] font-medium">
                                {cat.templates.length}
                            </span>
                        </span>
                        {cat.open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>

                    {cat.open && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {cat.templates.map((t, j) => (
                                <div key={j} className="border border-slate-200 rounded-xl p-4 relative bg-white hover:shadow-md transition">
                                    <div className="absolute top-3 right-3 flex gap-2 text-slate-500">
                                        <Copy
                                            size={15}
                                            onClick={() => handleCopy(t.body, i, j)}
                                            className={`cursor-pointer transition-transform ${copiedIndex === `${i}-${j}` ? "scale-125 text-green-500" : "text-slate-500"
                                                }`}
                                        />
                                        {_idCheck(t) && (
                                            <>
                                                <Pencil size={15} onClick={() => setEditingTemplate({ ...t, catIndex: i, templateIndex: j })} className="cursor-pointer" />
                                                <Trash2 size={15} onClick={() => setDeletingTemplate({ ...t, catIndex: i, templateIndex: j })} className="cursor-pointer" />
                                            </>
                                        )}
                                    </div>

                                    <div className="font-semibold text-[15px] mb-2 text-slate-900 pr-11">{t.title}</div>
                                    <p className="text-sm text-slate-600 leading-5">{t.body}</p>
                                </div>
                            ))}

                            {/* Add New Template Card */}
                            <div
                                onClick={() => setAddingCategoryIndex(i)}
                                className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col justify-center items-center cursor-pointer text-sm text-slate-500 hover:border-slate-400 hover:text-slate-700 transition"
                            >
                                <Plus size={22} />
                                <span className="mt-1">Add New Template</span>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Edit Modal */}

            {editingTemplate && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Edit Template</h2>

                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            className="border p-2 w-full mb-1 rounded"
                            placeholder="Enter template title"
                            value={editingTemplate.title}
                            onChange={(e) =>
                                setEditingTemplate({ ...editingTemplate, title: e.target.value })
                            }
                        />
                        <div
                            className={`text-xs mb-3 text-right ${editingTemplate.title.length > 40 ? "text-red-600" : "text-slate-500"
                                }`}
                        >
                            {editingTemplate.title.length}/40
                        </div>

                        <label className="block text-sm font-medium mb-1">Template Text</label>
                        <textarea
                            className="border p-2 w-full mb-1 rounded resize-none"
                            rows={5}
                            placeholder="Enter the template text"
                            value={editingTemplate.body}
                            onChange={(e) =>
                                setEditingTemplate({ ...editingTemplate, body: e.target.value })
                            }
                        />
                        <div
                            className={`text-xs mb-4 text-right ${editingTemplate.body.length > 160 ? "text-red-600" : "text-slate-500"
                                }`}
                        >
                            {editingTemplate.body.length}/160
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 border rounded"
                                onClick={() => setEditingTemplate(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-violet-600 text-white rounded"
                                onClick={handleSaveEdit}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}



            {/* Delete Confirmation Modal */}
            {deletingTemplate && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete "{deletingTemplate.title}"?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 border rounded"
                                onClick={() => setDeletingTemplate(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={handleConfirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Template Modal */}
            {addingCategoryIndex !== null && (
                <AddTemplateModal
                    category={categories[addingCategoryIndex]}
                    catIndex={addingCategoryIndex} // pass explicitly
                    onSave={(title, body) => handleAddNew(addingCategoryIndex, title, body)}
                    onClose={() => setAddingCategoryIndex(null)}
                />
            )}
        </div>
    );

}

// AddTemplateModal component

function AddTemplateModal({ category, catIndex, onSave, onClose }) {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const MAX_TITLE = 40;
    const MAX_BODY = 160;

    const handleSave = async () => {
        if (!title || !body) {
            return toast.error("Please fill both fields");
        }

        if (title.length > MAX_TITLE) {
            return toast.error(`Title max ${MAX_TITLE} characters`);
        }

        if (body.length > MAX_BODY) {
            return toast.error(`Template text max ${MAX_BODY} characters`);
        }

        await onSave(title, body); // call parent
        setTitle(""); // clear modal
        setBody("");
        onClose(); // close modal
        toast.success("Template added successfully!");
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-lg font-semibold mb-4">
                    Add Template to "{category.name}"
                </h2>

                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    className="border p-2 w-full mb-1 rounded"
                    placeholder="Enter template title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div
                    className={`text-xs mb-3 text-right ${title.length > MAX_TITLE ? "text-red-600" : "text-slate-500"
                        }`}
                >
                    {title.length}/{MAX_TITLE}
                </div>

                <label className="block text-sm font-medium mb-1">Template Text</label>
                <textarea
                    className="border p-2 w-full mb-1 rounded resize-none"
                    rows={5}
                    placeholder="Enter the template text"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <div
                    className={`text-xs mb-4 text-right ${body.length > MAX_BODY ? "text-red-600" : "text-slate-500"
                        }`}
                >
                    {body.length}/{MAX_BODY}
                </div>

                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 border rounded" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-violet-600 text-white rounded"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
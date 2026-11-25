import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowLeft, FaChevronDown, FaChevronRight, FaRotateRight } from 'react-icons/fa6'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../store/slices/adminAuthSlice'
import { selectIsDark } from '../../store/slices/themeSlice'
import SEO from '../../components/SEO'

const API_URL = (import.meta.env.VITE_CHATBOT_API_URL || (import.meta.env.DEV ? 'http://localhost:8000' : '')).replace(/\/$/, '')
const RANGES = [7, 30, 90]
const VISITOR_LABELS = {
    recruiter: 'Recruiter',
    hiring_manager: 'Hiring manager',
    exploring: 'Just exploring',
    unknown: 'Unknown',
    'not yet classified': 'In progress',
}
const CHANNEL_LABELS = { chat: 'Chat', voice: 'Voice' }
// Single-series chart color (validated: contrast >= 3:1 on the light and dark card surfaces)
const BAR_COLOR = { light: '#9333ea', dark: '#a855f7' }

const formatDateTime = (iso) =>
    iso ? new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''
const formatDay = (isoDate) =>
    new Date(`${isoDate}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })

const card = 'p-5 bg-white dark:bg-neutral-800/50 rounded-2xl border border-gray-100 dark:border-neutral-700'
const sectionTitle = 'text-lg font-semibold text-gray-900 dark:text-white mb-3'

const useAdminFetch = () => {
    const dispatch = useAppDispatch()
    const token = useAppSelector((state) => state.adminAuth.token)
    return useCallback(async (path) => {
        const response = await fetch(`${API_URL}${path}`, { headers: { Authorization: `Bearer ${token}` } })
        if (response.status === 401) {
            dispatch(logout())
            throw new Error('Session expired, please log in again')
        }
        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new Error(data.detail || 'Request failed')
        }
        return response.json()
    }, [dispatch, token])
}

const StatTile = ({ label, value, hint }) => (
    <div className={card}>
        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white tabular-nums">{value}</p>
        {hint && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
)

const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const point = payload[0].payload
    return (
        <div className="px-3 py-2 rounded-lg shadow-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-xs">
            <p className="text-gray-500 dark:text-gray-400">{formatDay(point.date)}</p>
            <p className="font-semibold text-gray-900 dark:text-white">
                {point.conversations} conversation{point.conversations === 1 ? '' : 's'}
            </p>
        </div>
    )
}

const DailyChart = ({ daily, isDark }) => {
    const grid = isDark ? '#404040' : '#e5e7eb'
    const ink = isDark ? '#a3a3a3' : '#6b7280'
    return (
        <div className={card}>
            <h2 className={sectionTitle}>Conversations per day</h2>
            <div className="h-56" role="img" aria-label="Bar chart of conversations per day">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={daily} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap={2}>
                        <CartesianGrid vertical={false} stroke={grid} strokeDasharray="2 4" />
                        <XAxis
                            dataKey="date"
                            tickFormatter={formatDay}
                            tick={{ fill: ink, fontSize: 11 }}
                            tickLine={false}
                            axisLine={{ stroke: grid }}
                            minTickGap={24}
                        />
                        <YAxis allowDecimals={false} tick={{ fill: ink, fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
                        <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }} />
                        <Bar
                            dataKey="conversations"
                            fill={isDark ? BAR_COLOR.dark : BAR_COLOR.light}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={28}
                            isAnimationActive={false}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <details className="mt-3 text-sm">
                <summary className="cursor-pointer text-gray-500 dark:text-gray-400">Show as table</summary>
                <table className="mt-2 w-full text-left text-gray-700 dark:text-gray-300">
                    <thead><tr className="text-xs text-gray-500"><th className="py-1">Date</th><th className="py-1 text-right">Conversations</th></tr></thead>
                    <tbody>
                        {[...daily].reverse().map((d) => (
                            <tr key={d.date} className="border-t border-gray-100 dark:border-neutral-700">
                                <td className="py-1">{formatDay(d.date)}</td>
                                <td className="py-1 text-right tabular-nums">{d.conversations}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </details>
        </div>
    )
}

// Who the visitors were: plain HTML bars (one hue, magnitude only), labelled with name and count
const VisitorTypes = ({ visitorTypes, isDark }) => {
    const entries = Object.entries(visitorTypes).sort((a, b) => b[1] - a[1])
    const max = Math.max(1, ...entries.map(([, n]) => n))
    return (
        <div className={card}>
            <h2 className={sectionTitle}>Who's talking to the assistant</h2>
            {entries.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">No conversations in this period.</p>}
            <ul className="space-y-3">
                {entries.map(([type, count]) => (
                    <li key={type}>
                        <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300 mb-1">
                            <span>{VISITOR_LABELS[type] || type}</span>
                            <span className="tabular-nums text-gray-900 dark:text-white">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-neutral-700">
                            <div
                                className="h-2 rounded-full"
                                style={{ width: `${(count / max) * 100}%`, background: isDark ? BAR_COLOR.dark : BAR_COLOR.light }}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

const Leads = ({ leads }) => (
    <div className={card}>
        <h2 className={sectionTitle}>Recruiter & hiring manager leads</h2>
        {leads.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No leads in this period yet.</p>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400">
                        <tr><th className="py-2 pr-3">When</th><th className="py-2 pr-3">Who</th><th className="py-2 pr-3">Role</th><th className="py-2 pr-3">Email</th><th className="py-2">Next step</th></tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                        {leads.map((lead) => (
                            <tr key={lead.session_id} className="border-t border-gray-100 dark:border-neutral-700 align-top">
                                <td className="py-2 pr-3 whitespace-nowrap">{formatDateTime(lead.created_at)}</td>
                                <td className="py-2 pr-3">
                                    <span className="text-gray-900 dark:text-white">{lead.name || 'Unnamed'}</span>
                                    {lead.company && <span className="text-gray-500 dark:text-gray-400"> · {lead.company}</span>}
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{VISITOR_LABELS[lead.visitor_type]}</div>
                                </td>
                                <td className="py-2 pr-3">{lead.role || '-'}</td>
                                <td className="py-2 pr-3">
                                    {lead.email ? <a className="text-purple-600 dark:text-purple-400 underline" href={`mailto:${lead.email}`}>{lead.email}</a> : '-'}
                                </td>
                                <td className="py-2 text-gray-600 dark:text-gray-400">{lead.next_step || lead.summary || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
)

const ConversationRow = ({ convo, adminFetch }) => {
    const [open, setOpen] = useState(false)
    const [detail, setDetail] = useState(null)
    const [error, setError] = useState(null)

    const toggle = async () => {
        const next = !open
        setOpen(next)
        if (next && !detail) {
            try {
                setDetail(await adminFetch(`/api/admin/insights/conversations/${convo.id}`))
            } catch (e) {
                setError(e.message)
            }
        }
    }

    const who = convo.visitor_type
        ? `${VISITOR_LABELS[convo.visitor_type] || convo.visitor_type}${convo.name ? `: ${convo.name}` : ''}${convo.company ? ` (${convo.company})` : ''}`
        : 'In progress'

    return (
        <li className="border-t border-gray-100 dark:border-neutral-700 first:border-t-0">
            <button type="button" onClick={toggle} className="w-full flex items-start gap-3 py-3 text-left" aria-expanded={open}>
                <span className="mt-1 text-gray-400">{open ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}</span>
                <span className="flex-1 min-w-0">
                    <span className="block text-sm text-gray-900 dark:text-white truncate">{convo.first_question || '(no questions)'}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">
                        {formatDateTime(convo.started_at)} · {convo.questions} question{convo.questions === 1 ? '' : 's'} ·{' '}
                        {convo.channels.map((c) => CHANNEL_LABELS[c] || c).join(' + ')} · {who}
                    </span>
                </span>
            </button>
            {open && (
                <div className="pl-7 pb-4 space-y-2">
                    {convo.summary && <p className="text-sm italic text-gray-600 dark:text-gray-400">{convo.summary}</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    {!detail && !error && <p className="text-sm text-gray-500">Loading...</p>}
                    {detail?.messages.map((m, i) => (
                        <div
                            key={i}
                            className={`p-3 rounded-xl text-sm whitespace-pre-wrap ${
                                m.role === 'user'
                                    ? 'bg-purple-50 dark:bg-purple-950/30 text-gray-900 dark:text-white'
                                    : 'bg-gray-50 dark:bg-neutral-900 text-gray-700 dark:text-gray-300'
                            }`}
                        >
                            <span className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {m.role === 'user' ? 'Visitor' : 'Assistant'} · {CHANNEL_LABELS[m.channel] || m.channel} · {formatDateTime(m.created_at)}
                            </span>
                            {m.content}
                        </div>
                    ))}
                </div>
            )}
        </li>
    )
}

const Contacts = ({ contacts }) => (
    <div className={card}>
        <h2 className={sectionTitle}>Contact form messages</h2>
        {contacts.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No messages in this period.</p>
        ) : (
            <ul className="space-y-3">
                {contacts.map((c) => (
                    <li key={c.id} className="border-t border-gray-100 dark:border-neutral-700 first:border-t-0 pt-3 first:pt-0">
                        <p className="text-sm text-gray-900 dark:text-white">
                            {c.name || 'Unnamed'} ·{' '}
                            <a className="text-purple-600 dark:text-purple-400 underline" href={`mailto:${c.email}`}>{c.email}</a>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDateTime(c.created_at)} · {c.ack_sent_at ? 'Confirmation sent' : 'No confirmation sent'}
                        </p>
                        {c.message && <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{c.message}</p>}
                    </li>
                ))}
            </ul>
        )}
    </div>
)

const AdminInsights = () => {
    const adminFetch = useAdminFetch()
    const isDark = useAppSelector(selectIsDark)
    const [days, setDays] = useState(30)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            setData(await adminFetch(`/api/admin/insights?days=${days}`))
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }, [adminFetch, days])

    useEffect(() => {
        load()
    }, [load])

    const s = data?.summary

    return (
        <div className="pt-8 max-w-5xl mx-auto pb-20 space-y-6">
            <SEO title="Insights | Admin" description="Assistant and contact insights" path="/admin/insights" />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-purple-500">
                        <FaArrowLeft size={12} /> Posts
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
                </div>
                {/* Filters: one row above everything they affect */}
                <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-xl bg-gray-100 dark:bg-neutral-800 p-1" role="group" aria-label="Date range">
                        {RANGES.map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setDays(r)}
                                aria-pressed={days === r}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                    days === r ? 'bg-white dark:bg-neutral-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                {r} days
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={load}
                        aria-label="Refresh"
                        className="p-2.5 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 hover:text-purple-500"
                    >
                        <FaRotateRight size={14} />
                    </button>
                </div>
            </div>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            {loading && !data && (
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                </div>
            )}

            {data && (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatTile label="Conversations" value={s.conversations} hint={`${s.chat_conversations} chat · ${s.voice_conversations} voice`} />
                        <StatTile label="Visitor questions" value={s.questions} />
                        <StatTile label="Recruiters & hiring managers" value={s.recruiters} hint={`${s.leads_with_email} left an email`} />
                        <StatTile label="Contact messages" value={s.contact_messages} hint={`${s.copies_sent} conversation copies sent`} />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2"><DailyChart daily={data.daily} isDark={isDark} /></div>
                        <VisitorTypes visitorTypes={data.visitor_types} isDark={isDark} />
                    </div>

                    <Leads leads={data.leads} />

                    <div className={card}>
                        <h2 className={sectionTitle}>Conversations</h2>
                        {data.conversations.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No conversations in this period.</p>
                        ) : (
                            <ul>
                                {data.conversations.map((c) => <ConversationRow key={c.id} convo={c} adminFetch={adminFetch} />)}
                            </ul>
                        )}
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Visitor details are filled in when a conversation ends and its transcript is emailed to you.
                        </p>
                    </div>

                    <Contacts contacts={data.contacts} />

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Website traffic (visitors, pages, referrers) is in Google Analytics; backend health and costs are on the CloudWatch dashboard.
                    </p>
                </>
            )}
        </div>
    )
}

export default AdminInsights

import {useMemo,useState} from 'react'
import {Link,NavLink,Route,Routes,useParams} from 'react-router-dom'
import {DATA,type Sch} from './data'
import {match,money,daysLeft,type Profile} from './match'
import {useApp,STATUSES} from './store'

function Ring({v,size=64}:{v:number;size?:number}){
  const r=size/2-5,c=2*Math.PI*r,col=v>=70?'#0E7C66':v>=40?'#B7791F':'#C73E5A'
  return <svg width={size} height={size} role="img" aria-label={`${v}% match`} className="shrink-0">
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#D5E2DC" strokeWidth="6"/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth="6" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-v/100)} transform={`rotate(-90 ${size/2} ${size/2})`} style={{transition:'stroke-dashoffset .6s'}}/>
    <text x="50%" y="50%" dy=".35em" textAnchor="middle" className="font-head font-bold" fontSize={size/3.4} fill="#0F2A2E">{v}%</text></svg>
}
const Due=({d}:{d:string})=>{const n=daysLeft(d);return <span className={n<=14?'font-medium text-rose':'text-soft'}>{n<0?'Closed':n===0?'Closes today':`${n} day${n===1?'':'s'} left`}</span>}

function Layout({children}:{children:React.ReactNode}){
  const n=useApp(s=>s.apps.length)
  const l=({isActive}:{isActive:boolean})=>`rounded-full px-4 py-2 text-sm font-medium ${isActive?'bg-ink text-white':'hover:bg-white'}`
  return <div className="min-h-screen flex flex-col">
    <header className="border-b border-line bg-white"><nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <Link to="/" className="font-head text-2xl font-extrabold">Grantly<span className="text-teal">.</span></Link>
      <div className="flex gap-1"><NavLink to="/" end className={l}>Discover</NavLink><NavLink to="/tracker" className={l}>My tracker{n>0&&<span className="ml-2 rounded-full bg-sun px-2 text-xs text-ink">{n}</span>}</NavLink></div></nav></header>
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    <footer className="border-t border-line py-6 text-center text-sm text-soft">Sample data: all scholarships are fictional and for demonstration.</footer></div>
}

const LV=['Class 10-12','Undergraduate','Postgraduate','PhD'],FD=['Engineering','Medicine','Science','Commerce','Arts','Law','Any'],CT=['General','OBC','SC','ST','EWS','Minority'],ST=['Maharashtra','Karnataka','Gujarat','Delhi','Tamil Nadu','Uttar Pradesh']
function Sel({id,label,v,set,opts}:{id:string;label:string;v:string;set:(x:string)=>void;opts:string[]}){
  return <div><label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label><select id={id} className="field" value={v} onChange={e=>set(e.target.value)}><option value="">Select</option>{opts.map(o=><option key={o}>{o}</option>)}</select></div>
}
function ProfileForm(){
  const {profile:p,setProfile}=useApp()
  const num=(k:'income'|'pct')=>(e:React.ChangeEvent<HTMLInputElement>)=>setProfile({[k]:e.target.value===''?null:Number(e.target.value)})
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <Sel id="lv" label="Study level" v={p.level} set={v=>setProfile({level:v})} opts={LV}/>
    <Sel id="fd" label="Field of study" v={p.field} set={v=>setProfile({field:v})} opts={FD}/>
    <Sel id="ct" label="Category" v={p.cat} set={v=>setProfile({cat:v})} opts={CT}/>
    <Sel id="st" label="State" v={p.state} set={v=>setProfile({state:v})} opts={ST}/>
    <div><label htmlFor="gn" className="mb-1 block text-sm font-medium">Gender</label><select id="gn" className="field" value={p.gender} onChange={e=>setProfile({gender:e.target.value as Profile['gender']})}><option value="">Prefer not to say</option><option value="f">Female</option><option value="m">Male</option></select></div>
    <div><label htmlFor="inc" className="mb-1 block text-sm font-medium">Family income per year (₹)</label><input id="inc" type="number" min={0} className="field" value={p.income??''} onChange={num('income')} placeholder="e.g. 400000"/></div>
    <div><label htmlFor="pc" className="mb-1 block text-sm font-medium">Last exam percentage</label><input id="pc" type="number" min={0} max={100} className="field" value={p.pct??''} onChange={num('pct')} placeholder="e.g. 78"/></div></div>
}

function Card({s,score}:{s:Sch;score:number}){
  const {apps,add}=useApp(),saved=apps.some(a=>a.id===s.id)
  return <article className="flex gap-4 rounded-xl border border-line bg-white p-5">
    <Ring v={score}/>
    <div className="flex min-w-0 flex-1 flex-col">
      <h3 className="text-lg font-bold leading-snug"><Link to={`/s/${s.id}`} className="hover:underline">{s.name}</Link></h3>
      <p className="text-sm text-soft">{s.provider}</p>
      <p className="mt-2 text-sm"><span className="font-head text-xl font-bold">{money(s.amount)}</span> <span className="text-soft">· </span><Due d={s.deadline}/></p>
      <div className="mt-3 flex gap-2"><Link to={`/s/${s.id}`} className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-white">Check eligibility</Link>
        <button onClick={()=>add(s.id)} disabled={saved} aria-label={saved?`${s.name} is saved`:`Save ${s.name}`} className="rounded-full border border-line px-4 py-1.5 text-sm font-medium disabled:bg-sun disabled:border-sun">{saved?'Saved':'Save'}</button></div></div></article>
}

function Discover(){
  const {profile}=useApp()
  const [q,setQ]=useState(''),[lvl,setLvl]=useState(''),[win,setWin]=useState(0),[only,setOnly]=useState(false),[sort,setSort]=useState('match')
  const rows=useMemo(()=>DATA.map(s=>({s,m:match(s,profile)}))
    .filter(({s,m})=>(!q||(s.name+s.provider).toLowerCase().includes(q.toLowerCase()))&&(!lvl||s.levels.includes(lvl))&&(!win||daysLeft(s.deadline)<=win)&&(!only||m.score>=70))
    .sort((a,b)=>sort==='match'?b.m.score-a.m.score:sort==='amount'?b.s.amount-a.s.amount:a.s.deadline.localeCompare(b.s.deadline)),[profile,q,lvl,win,only,sort])
  return <>
    <section className="mb-8 max-w-3xl"><h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">See which scholarships you can actually win.</h1>
      <p className="mt-3 text-lg text-soft">Tell us a little about you. Every scholarship shows how well you match and exactly what is missing.</p></section>
    <section aria-labelledby="pf" className="mb-8 rounded-xl border border-line bg-white p-5"><h2 id="pf" className="mb-3 text-xl font-bold">Your profile</h2><ProfileForm/></section>
    <section aria-labelledby="ls"><div className="mb-4 flex flex-wrap items-end gap-3"><h2 id="ls" className="mr-auto text-2xl font-bold">{rows.length} scholarship{rows.length===1?'':'s'}</h2>
      <div><label htmlFor="q" className="sr-only">Search</label><input id="q" className="field" placeholder="Search name or provider" value={q} onChange={e=>setQ(e.target.value)}/></div>
      <div><label htmlFor="fl" className="sr-only">Level</label><select id="fl" className="field" value={lvl} onChange={e=>setLvl(e.target.value)}><option value="">All levels</option>{LV.map(o=><option key={o}>{o}</option>)}</select></div>
      <div><label htmlFor="fw" className="sr-only">Deadline</label><select id="fw" className="field" value={win} onChange={e=>setWin(Number(e.target.value))}><option value={0}>Any deadline</option><option value={14}>Within 14 days</option><option value={30}>Within 30 days</option><option value={90}>Within 90 days</option></select></div>
      <div><label htmlFor="so" className="sr-only">Sort</label><select id="so" className="field" value={sort} onChange={e=>setSort(e.target.value)}><option value="match">Best match</option><option value="deadline">Soonest deadline</option><option value="amount">Highest amount</option></select></div>
      <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={only} onChange={e=>setOnly(e.target.checked)} className="h-4 w-4 accent-teal"/>Strong matches only</label></div>
      {rows.length?<div className="grid gap-4 md:grid-cols-2">{rows.map(({s,m})=><Card key={s.id} s={s} score={m.score}/>)}</div>
      :<div className="rounded-xl border border-dashed border-line bg-white p-10 text-center"><p className="font-bold">No scholarships match these filters.</p><p className="text-soft">Clear the search or turn off “Strong matches only”.</p></div>}</section></>
}

const ICON={met:['✓','bg-teal text-white','Met'],unmet:['✕','bg-rose text-white','Not met'],unknown:['?','bg-sun text-ink','Add to your profile']} as const
function Detail(){
  const {id}=useParams(),s=DATA.find(x=>x.id===id),{profile,apps,add}=useApp()
  if(!s)return <p>Scholarship not found. <Link to="/" className="underline">Back to discover</Link></p>
  const m=match(s,profile),saved=apps.some(a=>a.id===s.id)
  return <article className="max-w-3xl"><Link to="/" className="text-sm font-medium underline">Back to all scholarships</Link>
    <div className="mt-4 flex items-start gap-5"><Ring v={m.score} size={96}/><div><h1 className="text-3xl font-extrabold">{s.name}</h1><p className="text-soft">{s.provider}</p>
      <p className="mt-2"><span className="font-head text-2xl font-bold">{money(s.amount)}</span> <span className="text-soft">· Deadline {new Date(s.deadline).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} · </span><Due d={s.deadline}/></p></div></div>
    <p className="mt-5">{s.desc}</p>
    <section className="mt-8" aria-labelledby="el"><h2 id="el" className="text-xl font-bold">Do you qualify?</h2>
      <p className="text-soft">{m.known?`You meet ${m.met} of ${m.known} criteria we could check.`:'Fill in your profile to see how you match.'}</p>
      <ul className="mt-3 space-y-2">{m.checks.map(c=>{const [i,cls,t]=ICON[c.status];return <li key={c.label} className="flex items-center gap-3 rounded-lg border border-line bg-white p-3"><span aria-hidden className={`grid h-7 w-7 place-items-center rounded-full text-sm font-bold ${cls}`}>{i}</span><span className="flex-1">{c.label}</span><span className="text-sm text-soft">{t}</span></li>})}</ul></section>
    <div className="mt-8 grid gap-6 sm:grid-cols-2">
      <section aria-labelledby="dc"><h2 id="dc" className="text-xl font-bold">Documents to keep ready</h2><ul className="mt-2 list-disc space-y-1 pl-5">{s.docs.map(d=><li key={d}>{d}</li>)}</ul></section>
      <section aria-labelledby="sp"><h2 id="sp" className="text-xl font-bold">How to apply</h2><ol className="mt-2 list-decimal space-y-1 pl-5">{s.steps.map(d=><li key={d}>{d}</li>)}</ol></section></div>
    <div className="mt-8">{saved?<Link to="/tracker" className="inline-block rounded-full bg-sun px-6 py-3 font-bold">Saved. Open my tracker</Link>:<button onClick={()=>add(s.id)} className="rounded-full bg-ink px-6 py-3 font-bold text-white">Add to my tracker</button>}</div></article>
}

const LABEL={saved:'Saved',applying:'Applying',submitted:'Submitted',result:'Result'} as const
function Tracker(){
  const {apps,move,remove,note,toggleDoc}=useApp()
  const items=apps.map(a=>({a,s:DATA.find(x=>x.id===a.id)!})).filter(x=>x.s)
  const total=items.reduce((t,x)=>t+x.s.amount,0),active=items.filter(x=>x.a.status==='applying').length
  const next=items.filter(x=>x.a.status==='saved'||x.a.status==='applying').sort((a,b)=>a.s.deadline.localeCompare(b.s.deadline)).slice(0,3)
  if(!items.length)return <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center"><h1 className="text-2xl font-bold">Your tracker is empty</h1><p className="mt-1 text-soft">Save a scholarship and it will show up here with its documents and deadline.</p><Link to="/" className="mt-4 inline-block rounded-full bg-ink px-5 py-2 font-medium text-white">Find scholarships</Link></div>
  return <><h1 className="text-3xl font-extrabold">My tracker</h1>
    <div className="my-5 grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl bg-ink p-5 text-white"><p className="text-sm text-white/70">Potential funding</p><p className="font-head text-3xl font-bold">{money(total)}</p></div>
      <div className="rounded-xl border border-line bg-white p-5"><p className="text-sm text-soft">Applications in progress</p><p className="font-head text-3xl font-bold">{active}</p></div>
      <div className="rounded-xl border border-line bg-white p-5"><p className="text-sm text-soft">Closing next</p>{next.length?<ul className="mt-1 text-sm">{next.map(x=><li key={x.s.id} className="flex justify-between gap-2"><span className="truncate">{x.s.name}</span><Due d={x.s.deadline}/></li>)}</ul>:<p className="text-sm">Nothing pending.</p>}</div></div>
    <div className="grid gap-4 lg:grid-cols-4">{STATUSES.map((st,ci)=><section key={st} aria-labelledby={`c-${st}`} className="rounded-xl bg-white/60 p-3">
      <h2 id={`c-${st}`} className="mb-3 font-bold">{LABEL[st]} <span className="text-soft">({items.filter(x=>x.a.status===st).length})</span></h2>
      <div className="space-y-3">{items.filter(x=>x.a.status===st).map(({a,s})=><div key={s.id} className="rounded-lg border border-line bg-white p-3">
        <Link to={`/s/${s.id}`} className="font-medium leading-snug hover:underline">{s.name}</Link>
        <p className="text-sm"><Due d={s.deadline}/></p>
        <fieldset className="mt-2"><legend className="text-sm font-medium">Documents ready</legend>{s.docs.map(d=><label key={d} className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-teal" checked={a.docs.includes(d)} onChange={()=>toggleDoc(s.id,d)}/>{d}</label>)}</fieldset>
        <label htmlFor={`n-${s.id}`} className="mt-2 block text-sm font-medium">Notes</label><textarea id={`n-${s.id}`} rows={2} className="field" value={a.notes} onChange={e=>note(s.id,e.target.value)}/>
        <div className="mt-2 flex items-center gap-2">
          <button disabled={ci===0} onClick={()=>move(s.id,STATUSES[ci-1])} aria-label={`Move ${s.name} to ${LABEL[STATUSES[ci-1]??'saved']}`} className="rounded-full border border-line px-3 py-1 text-sm disabled:opacity-30">Back</button>
          <button disabled={ci===3} onClick={()=>move(s.id,STATUSES[ci+1])} aria-label={`Move ${s.name} to ${LABEL[STATUSES[ci+1]??'result']}`} className="rounded-full bg-ink px-3 py-1 text-sm text-white disabled:opacity-30">Next stage</button>
          <button onClick={()=>remove(s.id)} className="ml-auto text-sm text-rose underline" aria-label={`Remove ${s.name}`}>Remove</button></div></div>)}</div></section>)}</div></>
}

export default function App(){return <Layout><Routes><Route path="/" element={<Discover/>}/><Route path="/s/:id" element={<Detail/>}/><Route path="/tracker" element={<Tracker/>}/><Route path="*" element={<p>Page not found. <Link to="/" className="underline">Go home</Link></p>}/></Routes></Layout>}

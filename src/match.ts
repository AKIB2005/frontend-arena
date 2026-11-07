import type {Sch} from './data'
export type Profile={name:string;level:string;field:string;cat:string;gender:''|'f'|'m';state:string;income:number|null;pct:number|null}
export type Check={label:string;status:'met'|'unmet'|'unknown'}
export const emptyProfile:Profile={name:'',level:'',field:'',cat:'',gender:'',state:'',income:null,pct:null}
const inr=(n:number)=>'₹'+n.toLocaleString('en-IN')
/** Score = criteria met / criteria we can judge. Unspecified criteria are skipped; unknown profile values are excluded, not penalised. */
export function match(s:Sch,p:Profile){
  const checks:Check[]=[]
  const add=(label:string,ok:boolean|null)=>checks.push({label,status:ok===null?'unknown':ok?'met':'unmet'})
  add(`Study level: ${s.levels.join(' or ')}`,p.level?s.levels.includes(p.level):null)
  if(!s.fields.includes('Any'))add(`Field: ${s.fields.join(' or ')}`,p.field?s.fields.includes(p.field):null)
  if(s.cats.length)add(`Category: ${s.cats.join(' or ')}`,p.cat?s.cats.includes(p.cat):null)
  if(s.female)add('Open to women applicants',p.gender?p.gender==='f':null)
  if(s.maxIncome)add(`Family income up to ${inr(s.maxIncome)}`,p.income===null?null:p.income<=s.maxIncome)
  if(s.minPct)add(`At least ${s.minPct}% in last exam`,p.pct===null?null:p.pct>=s.minPct)
  if(!s.states.includes('All'))add(`State: ${s.states.join(', ')}`,p.state?s.states.includes(p.state):null)
  const known=checks.filter(c=>c.status!=='unknown'),met=known.filter(c=>c.status==='met').length
  return{checks,met,known:known.length,score:known.length?Math.round(met/known.length*100):0}
}
export const money=inr
export const daysLeft=(d:string)=>Math.ceil((new Date(d).getTime()-Date.now())/864e5)

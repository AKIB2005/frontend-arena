const day=(n:number)=>new Date(Date.now()+n*864e5).toISOString().slice(0,10)
const DOCS=['Income certificate','Latest marksheet','Aadhaar card','Bank passbook copy']
const STEPS=['Create an account on the provider portal','Fill in the application form','Upload the documents listed','Submit and save the acknowledgement number']
import type { Sch } from './data.real.ts'
const s=(id:string,name:string,provider:string,amount:number,days:number,levels:string[],fields:string[],o:Partial<Sch>={}):Sch=>({id,name,provider,desc:`${name} supports students who meet the criteria below with a one-time grant towards tuition and learning costs.`,amount,deadline:day(days),levels,fields,cats:[],states:['All'],docs:DOCS,steps:STEPS,isSample:true,...o})
export const SAMPLE:Sch[]=[
s('1','Kaveri Merit Grant','Kaveri Education Trust',50000,9,['Undergraduate'],['Engineering','Science'],{minPct:75}),
s('2','Sahyadri Women in Tech Award','Sahyadri Foundation',75000,21,['Undergraduate','Postgraduate'],['Engineering'],{female:true,minPct:60}),
s('3','Bharat First Generation Learner Fund','Bharat Learning Alliance',40000,34,['Undergraduate'],['Any'],{maxIncome:300000}),
s('4','Medhavi Medical Aspirant Scholarship','Medhavi Health Society',120000,48,['Undergraduate'],['Medicine'],{minPct:80,maxIncome:600000}),
s('5','Prakash Class 12 Bridge Grant','Prakash Charitable Trust',25000,6,['Class 10-12'],['Any'],{maxIncome:250000}),
s('6','Vidya EWS Support Scheme','State Education Board',60000,58,['Undergraduate','Postgraduate'],['Any'],{cats:['EWS'],maxIncome:800000,states:['Maharashtra']}),
s('7','Tarang Arts and Humanities Prize','Tarang Cultural Council',35000,72,['Undergraduate','Postgraduate'],['Arts'],{minPct:65}),
s('8','Nyaya Law Scholars Fellowship','Nyaya Bar Foundation',90000,41,['Undergraduate','Postgraduate'],['Law'],{minPct:70}),
s('9','Samata SC/ST Higher Education Grant','Samata Development Fund',100000,63,['Undergraduate','Postgraduate','PhD'],['Any'],{cats:['SC','ST'],maxIncome:450000}),
s('10','Alpha Minority Excellence Award','Alpha Minority Trust',55000,27,['Undergraduate','Postgraduate'],['Any'],{cats:['Minority'],minPct:60,maxIncome:500000}),
s('11','Ganit Research Starter Grant','Ganit Science Society',150000,85,['PhD'],['Science','Engineering'],{minPct:70}),
s('12','Vanijya Commerce Leaders Scholarship','Vanijya Chambers',45000,53,['Undergraduate'],['Commerce'],{minPct:70}),
s('13','OBC Pragati Tuition Support','Pragati Welfare Board',50000,38,['Undergraduate','Postgraduate'],['Any'],{cats:['OBC'],maxIncome:450000}),
s('14','Nirmaan Engineering Merit-cum-Means','Nirmaan Industries Forum',80000,16,['Undergraduate'],['Engineering'],{minPct:70,maxIncome:500000,states:['Maharashtra','Karnataka','Gujarat']}),
s('15','Cauvery Rural Girls Education Grant','Cauvery Education Society',35000,12,['Class 10-12','Undergraduate'],['Any'],{female:true,maxIncome:300000,states:['Tamil Nadu'],docs:['Income certificate','Latest marksheet','Aadhaar card','Domicile certificate']}),
s('16','Dilli Digital Skills Scholarship','Capital Tech Council',30000,19,['Undergraduate','Postgraduate'],['Engineering','Science'],{minPct:65,states:['Delhi'],docs:['Latest marksheet','Aadhaar card','Domicile certificate','Bank passbook copy']}),
s('17','Ahilya Teaching Excellence Fellowship','Ahilya Bai Education Trust',60000,29,['Postgraduate'],['Arts','Science'],{female:true,minPct:70,docs:['Latest marksheet','Recommendation letter','Aadhaar card','Bank passbook copy']}),
s('18','Kisan Families Scholarship','Kisan Welfare Society',45000,45,['Undergraduate','Postgraduate'],['Any'],{maxIncome:350000,states:['Uttar Pradesh','Gujarat'],docs:['Income certificate','Latest marksheet','Aadhaar card','Land record extract']}),
s('19','Pratibha Class 10 Achievers Prize','Pratibha Foundation',15000,52,['Class 10-12'],['Any'],{minPct:85,docs:['Latest marksheet','Aadhaar card','Bank passbook copy']}),
s('20','Arogya Nursing and Allied Health Grant','Arogya Care Trust',55000,68,['Undergraduate'],['Medicine'],{maxIncome:400000,docs:['Income certificate','Latest marksheet','Admission letter','Bank passbook copy']}),
s('21','Sanvidhan Law Moot Fellowship','Sanvidhan Legal Aid Society',70000,80,['Postgraduate'],['Law'],{minPct:65,docs:['Latest marksheet','Recommendation letter','Admission letter','Aadhaar card']}),
s('22','Udyam Commerce Founders Grant','Udyam Startup Forum',65000,95,['Undergraduate','Postgraduate'],['Commerce'],{minPct:60,states:['Maharashtra','Karnataka'],docs:['Latest marksheet','Aadhaar card','Admission letter','Bank passbook copy']}),
s('23','Vanvasi Research Scholars Support','Vanvasi Research Trust',120000,108,['PhD'],['Any'],{cats:['ST'],maxIncome:600000,docs:['Income certificate','Caste certificate','Research proposal','Recommendation letter']}),
s('24','Sarvodaya Minority Girls Scholarship','Sarvodaya Trust',50000,118,['Undergraduate'],['Any'],{cats:['Minority'],female:true,maxIncome:500000,docs:['Income certificate','Latest marksheet','Aadhaar card','Bank passbook copy']})]

export type Sch={id:string;name:string;provider:string;desc:string;amount:number;deadline:string;levels:string[];fields:string[];cats:string[];female?:boolean;maxIncome?:number;minPct?:number;states:string[];docs:string[];steps:string[]}
const day=(n:number)=>new Date(Date.now()+n*864e5).toISOString().slice(0,10)
const DOCS=['Income certificate','Latest marksheet','Aadhaar card','Bank passbook copy']
const STEPS=['Create an account on the provider portal','Fill in the application form','Upload the documents listed','Submit and save the acknowledgement number']
const s=(id:string,name:string,provider:string,amount:number,days:number,levels:string[],fields:string[],o:Partial<Sch>={}):Sch=>({id,name,provider,desc:`${name} supports students who meet the criteria below with a one-time grant towards tuition and learning costs.`,amount,deadline:day(days),levels,fields,cats:[],states:['All'],docs:DOCS,steps:STEPS,...o})
export const DATA:Sch[]=[
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
// ── 10 new scholarships ──
s('15','Kiran Women in Medicine Scholarship','Kiran Health Foundation',95000,45,['Undergraduate','Postgraduate'],['Medicine'],{female:true,minPct:70,maxIncome:700000}),
s('16','Udaan Rural Talent Award','Udaan Social Trust',30000,30,['Class 10-12','Undergraduate'],['Any'],{maxIncome:200000,states:['Uttar Pradesh','Maharashtra']}),
s('17','Srishti Design and Arts Fellowship','Srishti Creative Labs',65000,90,['Undergraduate','Postgraduate'],['Arts'],{minPct:55}),
s('18','Neev SC/ST Class 12 Grant','Neev Empowerment Fund',20000,18,['Class 10-12'],['Any'],{cats:['SC','ST'],maxIncome:300000}),
s('19','Dharitri Environmental Science Prize','Dharitri Green Council',80000,75,['Postgraduate','PhD'],['Science'],{minPct:65}),
s('20','Lakshya Gujarat Engineering Scholarship','Lakshya Industries Trust',70000,55,['Undergraduate'],['Engineering'],{minPct:75,maxIncome:600000,states:['Gujarat']}),
s('21','Saraswati Postgraduate Research Grant','Saraswati Academic Society',110000,100,['Postgraduate','PhD'],['Science','Engineering','Medicine'],{minPct:70}),
s('22','Ankur EWS Commerce Support','Ankur Welfare Trust',35000,40,['Undergraduate'],['Commerce'],{cats:['EWS'],maxIncome:500000,states:['Delhi','Uttar Pradesh']}),
s('23','Shakti Women in Law Award','Shakti Legal Foundation',85000,65,['Undergraduate','Postgraduate'],['Law'],{female:true,minPct:60}),
s('24','Pragnya Karnataka Merit Scholarship','Pragnya Education Board',50000,110,['Undergraduate','Postgraduate'],['Any'],{minPct:80,states:['Karnataka']})]

// Local, explainable content-based recommender for the hackathon prototype.
// No network request, model API, or personal data leaves the browser.
const MindBridgeMatching=(()=>{
 const topics={
  c1:'artificial intelligence ai python machine learning neural network data science automation coding programming alqoritm süni intellekt maşın öyrənməsi proqramlaşdırma',
  c2:'build website web application react javascript html css frontend backend portfolio app sayt veb tətbiq yaratmaq proqramlaşdırma',
  c3:'english speaking conversation debate ielts language fluency vocabulary ingilis dili danışıq söhbət lüğət',
  c4:'scratch robotics robot games children kids creative coding logic robototexnika uşaqlar oyun məntiq',
  c5:'mathematics math algebra logic problem solving analysis numbers riyaziyyat məntiq məsələlər',
  c6:'exam preparation dim school graduation tests score university imtahan buraxılış universitet hazırlıq'
 };
 const plans=[
  ['c1','evening','beginner',14,17],['c1','weekend','intermediate',18,85],
  ['c2','evening','beginner',15,17],['c2','weekend','intermediate',18,85],
  ['c3','morning','beginner',12,17],['c3','evening','intermediate',18,85],
  ['c4','weekend','beginner',8,14],['c4','morning','intermediate',8,14],
  ['c5','evening','beginner',14,17],['c5','weekend','advanced',18,85],
  ['c6','weekend','intermediate',15,19],['c6','evening','advanced',15,19]
 ].map(([subject,schedule,level,minAge,maxAge],index)=>({id:`cohort-${index+1}`,subject,schedule,level,minAge,maxAge,seats:index%3+2}));
 const tokens=value=>String(value||'').toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9əıöüçğş]+/g,' ').split(/\s+/).filter(word=>word.length>2);
 const termSets=Object.fromEntries(Object.entries(topics).map(([id,copy])=>[id,new Set(tokens(copy))]));
 const frequency={};for(const terms of Object.values(termSets))for(const term of terms)frequency[term]=(frequency[term]||0)+1;
 const idf=word=>Math.log(1+6/(frequency[word]||1));
 const documentNorm=Object.fromEntries(Object.entries(termSets).map(([id,terms])=>[id,Math.sqrt([...terms].reduce((sum,word)=>sum+idf(word)**2,0))]));
 const semantic=(goal,subject)=>{
  const words=[...new Set(tokens(goal))];if(!words.length)return {score:0,matched:[]};
  const terms=termSets[subject],matched=words.filter(word=>terms.has(word));
  const dot=matched.reduce((sum,word)=>sum+idf(word)**2,0);
  const queryNorm=Math.sqrt(words.reduce((sum,word)=>sum+idf(word)**2,0));
  const cosine=queryNorm&&documentNorm[subject]?dot/(queryNorm*documentNorm[subject]):0;
  return {score:Math.min(1,cosine*2.5),matched};
 };
 function recommend(input){
  const age=Number(input.age),goal=String(input.goal||'').trim();
  if(!Number.isFinite(age)||age<8||age>85)return [];
  return plans.filter(cohort=>age>=cohort.minAge&&age<=cohort.maxAge).map(cohort=>{
   const meaning=semantic(goal,cohort.subject);
   const factors={goal:Math.round(meaning.score*45),subject:cohort.subject===input.subject?20:0,level:cohort.level===input.level?20:cohort.level==='intermediate'?8:3,schedule:cohort.schedule===input.schedule?15:0};
   return {...cohort,score:Object.values(factors).reduce((sum,n)=>sum+n,0),factors,matched:meaning.matched};
  }).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,3);
 }
 return {recommend,semantic,plans};
})();
